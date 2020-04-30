'use strict';
/** ---------------------------------------------------------------------


  entry ChromeFile.chooseAndRetainFolder(params)

  rfile = new ChromeReadFile(<params>)
      Retourne une instance ChromeReadFile qui permet d'obtenir le contenu
      d'un projet.

      Pour recevoir le contenu immédiatement :
        content = await rfile.read()
      ou
        rfile.read()
        .then(...)

      Pour se servir du contenu plus tard :
        rfile.choose()
      Et plus tard on utilise rfile.content pour obtenir le contenu du
      fichier.

*** --------------------------------------------------------------------- */
/**
  Méthode où je veux rassembler les choses :
  - Choisir un dossier (ou un fichier ?),
  – retenir cette entrée (local.storage)
  - récupérer cette entrée (local.storage)
  - récupérer le dossier et le renvoyer
**/
class ChromeFile {
  static chooseAndRetainFolder(params = {}){
    params.message || ( params.message = "Dossier :" );

  }
  // Demander un fichier à lire
  static chooseAndRetainFileForRead(params = {}){
    params.message || ( params.message = "Fichier à ouvrir :" );

  }
  // Demander un fichier à écrire
  // +Return+
  static chooseAndRetainFileForWrite(params = {}){
    params.message || ( params.message = "Enregistrer comme :" );

  }



}

/** ---------------------------------------------------------------------
  *   Gestion des fichiers à lire
  *
*** --------------------------------------------------------------------- */
class ChromeReadFile {
  constructor(params = {}){
    params.message || (params.message = 'Fichier à ouvrir')
    params.extensions || (params.extensions = ['*'])
    params.acceptAllTypes !== undefined || (params.acceptAllTypes = true)
    this.params = params

    this.errorHandler = this.errorHandler.bind(this)
    this.choose       = this.choose.bind(this)
    this.onChoosed    = this.onChoosed.bind(this)
    this.onLoaded     = this.onLoaded.bind(this)
    this.readContent  = this.readContent.bind(this)
  }

  read(){
    return new Promise((ok,ko)=>{
      this.resolveFunction = ok
      this.abortFunction = ko
      this.choose()
    })
  }
  // ---------------------------------------------------------------------
  //  MÉTHODES FONCTIONNELLES

  choose(callback){
    chrome.fileSystem.chooseEntry( {
        type: 'openFile',
        accepts: [
          { description: this.params.message, extensions: this.params.extensions}
        ],
        acceptsAllTypes: this.params.acceptAllTypes
      },
      this.onChoosed
    );
  }

  /** Méthode appelée quand on a choisi le fichier à ouvrir **/
  onChoosed(entry){
    this.retain(entry)
    this.readContent(entry)
  }

  readContent(entry){
    entry.file((file) => {
      var reader = new FileReader();
      reader.onerror = this.errorHandler;
      reader.onloadend = (e) => { this.onLoaded(e.target.result) };
      reader.readAsText(file); //Lecture du fichier
    })
  }
  // Méthode appelée avec le contenu du fichier, après lecture
  onLoaded(content){
    this.content = content
    this.resolveFunction(content) // ok de la promise
  }

  retain(entry){
    this.entry = entry
    this.retainedId = chrome.fileSystem.retainEntry(entry)
  }

  restore(retainedId){
    return new Promise((ok,ko)=>{
      this.resolveFunction = ok
      this.retainedId = retainedId
      chrome.fileSystem.restoreEntry(retainedId, this.readContent)
    })
  }


  errorHandler(err){
    console.error(err)
  }
}
