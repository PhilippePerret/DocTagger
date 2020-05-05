'use strict';

const COMMENT_TYPES = {
    neu: {name: 'neutre',       id: 'neu',  key: 'x'}
  , pos: {name: 'positif',      id: 'pos',  key: 'p'}
  , neg: {name: 'négatif',      id: 'neg',  key: 'n'}
  , ort: {name: 'orthographe',  id: 'ort',  key: 'l'}
  , sty: {name: 'style',        id: 'sty',  key: 's'}
  , que: {name: 'question',     id: 'que',  key: 'q'}
}

class Comment {
  static init(){
    this.reset()
  }

  static reset(){
    this.lastId = 0
  }

  static newId(){
    ++ this.lastId ;
    return this.lastId ;
  }

  /**
    Récupère le dernier identifiant
  **/
  static async displayAllComments(){
    var allcomments = await this.DBgetAll()
    // console.log("Tous les commentaires :", allcomments)
    allcomments.forEach( dcomment => {
      if ( dcomment.id > this.lastId ) { this.lastId = Number(dcomment.id) }
      var comment = new Comment(dcomment)
      comment.display()
    })
  }

  /**
    Méthode qui renvoie tous les enregistrements
  **/
  static DBgetAll(){
    return new Promise((ok,ko) => {
      var dbmethod = function(os){
        var rq = os.getAll()
        rq.onsuccess = e => {
          console.info(e.target.result)
          console.info("Récupération de tous les commentaires")
          ok(e.target.result)
        }
        rq.onerror = console.error
      }
      this.dbrequest(dbmethod)
    })
  }
  /**
    Méthode qui permet d'effacer complètement la base de données
  **/
  static DBclear(){
    var dbmethod = function(os){
      var rq = os.clear()
      rq.oncomplete = e => {
        console.info(e.target.result)
        console.info("Base de donnée vidée avec succès.")
        if ( callback ) callback()
      }
      rq.onerror = console.error
    }
    this.dbrequest(dbmethod)
  }

  /**
    Méthode pour enregistrer dans indexedDB le commentaire
  **/
  static store(comment, callback){
    console.log("Commentaire à enregistrer :", comment)
    var dbmethod = function(os){
      var rq = os.add(comment, comment.id)
      rq.onsuccess = e => {
        console.info(e.target.result)
        console.info("Commentaire enregistré :", comment)
        if ( callback ) callback()
      }
      rq.onerror = console.error
    }
    this.dbrequest(dbmethod, callback)
  }

  static async storeAll(allcomments, callback){
    var comment ;
    var dbmethod = async (os) => {
      while (comment = allcomments.shift()){
        await this.storeNext(os, comment)
      }
    }
    this.dbrequest(dbmethod, callback)
  }
  static storeNext(os, comment){
    // console.log("Comment à enregistrer :", comment.data)
    return new Promise((ok,ko)=>{
      var rq = os.add(comment.data, comment.data.id)
      rq.onsuccess = ok
      rq.onerror = ko
    })
  }

  static dbrequest(dbMethod, callback){
    var con = indexedDB.open('comments', 1);
    con.onsuccess = e => {
      var db = e.target.result
      var tr = db.transaction(['comments'], 'readwrite')
      var os = tr.objectStore('comments')
      console.log("objectStore:",os)
      dbMethod(os)
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
  constructor(data_comment, mots){
    this.data = data_comment;
    if (undefined !== mots && undefined === this.data.mots){
      // Par exemple à la création
      Object.assign(this.data, {mots: mots.map(mot => mot.id)})
    } else {
      // Par exemple à l'instanciation d'un commentaire existant
      mots = this.data.mots.map( motId => Mot.get(motId))
    }
    this.mots = mots

    if (this.data.id == ''){
      // => C'est un nouveau mot
      this.data.id = this.constructor.newId()
    } else {
      this.data.id = Number(this.data.id)
    }
  }

  /**
    Affichage du commentaire

    Pour le moment, on le met à la hauteur du mot le plus haut, mais ensuite
    il faudra faire un affiche beaucoup plus fin.
  **/
  display(){
    // IL faut le détruire s'il existe
    var comObj = DGet(`com${this.data.id}`);
    if ( comObj ) comObj.remove()
    // Obtenir sa hauteur
    var top = 100000
    this.mots.forEach(mot => {
      console.log("mot ", mot, mot.top)
      if ( top > mot.top ) top = Number(mot.top)
    })
    // Fabriquer le div du commentaire
    comObj = document.createElement('DIV')
    comObj.className = 'com'
    comObj.id = `com${this.data.id}`
    comObj.innerHTML = this.data.content
    comObj.setAttribute('style', `top:${top}px;color:${this.color};opacity:${this.opacity};`)
    // Peindre les mots du commentaire
    this.mots.forEach(mot => mot.setColor(this.color))
    // Poser un observateur sur le commentaire (OU mettre des boutons
    // pour l'éditer)
    UI.divComments.appendChild(comObj)
  }

  // Couleur HTML de l'élément
  get color(){
    return this._color || (this._color = ColorSelector.COLORS[this.data.colorId].value)
  }
  get opacity(){
    return this.OPACITY_BY_INTENSITY[this.data.intensity]
  }
  get OPACITY_BY_INTENSITY(){
    return {
       1:0.6
      ,2:0.65
      ,3:0.7
      ,4:0.75
      ,5:0.8
      ,6:0.85
      ,7:0.9
      ,8:0.95
      ,9:1
    }
  }
  save(){
    // console.log("Je vais sauver", this.data)
    this.constructor.store.call(this.constructor, this.data)
    this.display()
  }

}
