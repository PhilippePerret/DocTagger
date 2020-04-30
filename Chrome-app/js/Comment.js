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
    this.saveAll    = this.saveAll.bind(this)
    this.doSaveAll  = this.doSaveAll.bind(this)
    this.chooseAWritableFile = this.chooseAWritableFile.bind(this)
  }

  static newId(){
    ++ this.lastId ;
    return this.lastId ;
  }

  /**
    Récupère le dernier identifiant
    Note : pour le moment, comme je suis encore assez "fragile", je récupère
    tout et je regarde le dernier ID enregistré.
  **/
  static async displayAllComments(){
    var allcomments = await this.DBgetAll()
    // console.log("Tous les commentaires :", allcomments)
    allcomments.forEach( dcomment => {
      if ( dcomment.id > this.lastId ) { this.lastId = Number(dcomment.id) }
      // TODO ÉCRIRE LE COMMENTAIRE
    })
  }

  /**
    Méthode pour enregistrer tous les commentaires dans un fichier
    Si le fichier n'est pas encore déterminé, on le choisit.
  **/
  static saveAll(){
    chrome.storage.local.get(['folder_comments'], result => {
      if ( result.folder_comments ) {
        chrome.fileSystem.isRestorable(result.folder_comments, isRestorable => {
          if (isRestorable) {
            console.log("Commentaires enregistrés dans dossier retenu")
            chrome.fileSystem.restoreEntry(result.folder_comments, this.doSaveAll)
          } else { this.chooseAWritableFile(this.doSaveAll) }
        })
      } else { this.chooseAWritableFile(this.doSaveAll) }
    })
  }
  /**
    Le fichier à enregistrer est défini, on peut procéder à l'enregistrement
  **/
  static doSaveAll(dirEntry){
    dirEntry.getFile('comments.txtcoms', {create: true}, async (entry) => {
      console.log("-> getFile")
      var allComments = await this.DBgetAll()
      console.log("allComments = ", allComments)
      // Create a FileWriter object for our FileEntry (log.txt).
       entry.createWriter(function(fileWriter) {
         fileWriter.onwriteend = function(e) {
           console.info('Enregistrement terminé');
         };
         fileWriter.onerror = console.error
         var alldata = {
           author: {patronyme: UI.FieldAuthor.value, diminutif: UI.FieldAuthorDim.value},
           comments: allComments,
           date: null // la régler plus tard
         }
         var blob = new Blob([JSON.stringify(alldata)], {type: 'text/plain'});
         fileWriter.write(blob);
       }, console.error)
    }, console.error)
  }

  /**
    Méthode pour choisir où enregistrer les commentaires
  **/
  static async chooseAWritableFile(callback){
    var folderEntry = await chooseFolder()
    var retainedFolderId = chrome.fileSystem.retainEntry(folderEntry)
    chrome.storage.local.set({'folder_comments': retainedFolderId}, e => {
      console.info("Dossier commentaires retenu.")
    })
    callback(folderEntry)
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
      rq.onsuccess = e => {
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

  // /**
  //   Méthode permettant de choisir un dossier dans lequel mettre les commentaires
  // **/
  // chooseCommentsFolder(callback){
  //   chooseFolder(this.onChooseFolder.bind(this, callback))
  // }
  // onChooseFolder(callback, entry){
  //   console.log("entry:", entry)
  //   console.log("callback", callback)
  //   console.log("Je m'arrête dans onChooseFolder")
  //   // callback()
  // }

}
