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
    if ( undefined === this.folder ) {
      return this.chooseCommentsFolder(this.save.bind(this))
    }
    console.log("Je vais sauver", this.data)
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
