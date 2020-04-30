'use strict';

const COMMENT_TYPES = {
  neu: {name: 'neutre',       id: 'neu',  key: 'x'},
  pos: {name: 'positif',      id: 'pos',  key: 'p'},
  neg: {name: 'négatif',      id: 'neg',  key: 'n'},
  ort: {name: 'orthographe',  id: 'ort',  key: 'l'},
  que: {name: 'question',     id: 'que',  key: 'q'}
}
class Comment {
  static init(){
    this.lastId = 0
  }
  static newId(){
    ++ this.lastId ;
    return this.lastId ;
  }

  static store(comment, callback){
    var con = indexedDB.open('comments', 1);
    con.onsuccess = e => {
      var db = e.target.result
      var tr = db.transaction(['comments'], 'readwrite')
      var os = tr.objectStore('comments')
      console.log("objectStore:",os)
      var rq = os.add(comment, 'id')
      rq.onsuccess = e => {
        console.info(e.target.result)
        console.info("Commentaire enregistré :", comment)
        if ( callback ) callback()
      }
      rq.onerror = console.error
    }
    con.onerror = e => {console.error(e.target.result)}
    //On upgrade needed.
    con.onupgradeneeded = e => {
      var db = e.target.result;
      console.log('Run onupgradeneeded');
      if (!db.objectStoreNames.contains("comments") ) {
        db.createObjectStore("comments", { keypath: "id"});
      }
    }
  }


  /** ---------------------------------------------------------------------
    *
    INSTANCE
    *
  *** --------------------------------------------------------------------- */
  constructor(mots, data_comment){
    this.data = data_comment;
    Object.assign(this.data, {mots: mots.map(mot => mot.id)})
    this.mots = mots

    if (this.data.id == ''){
      // => C'est un nouveau mot
      this.data.id = this.constructor.newId()
    } else {
      this.data.id = Number(this.data.id)
    }
  }

  save(){
    console.log("Je vais sauver", this.data)
    this.constructor.store.call(this.constructor, this.data)
  }

  /**
    Méthode permettant de choisir un dossier dans lequel mettre les commentaires
  **/
  chooseCommentsFolder(callback){
    chooseFolder(this.onChooseFolder.bind(this, callback))
  }
  onChooseFolder(callback, entry){
    console.log("entry:", entry)
    console.log("callback", callback)
    console.log("Je m'arrête dans onChooseFolder")
    // callback()
  }

}
