'use strict';
/** ---------------------------------------------------------------------
  *   Class TexteComments
  *   -------------------
  *   Gestion des commentaires d'un texte. Correspond à la propriété
  *   `comments` du texte.
*** --------------------------------------------------------------------- */
class TexteComments {
  constructor(texte){
    this.texte = texte ;
    // On règle l'observateur du bouton Save
    UI.setObserverBoutonSave(this)
  }

  /**
    Si des commentaires existent, ils sont chargés et affichés
  **/
  displayIfExists(){
    if ( fs.existsSync(this.path) ) {
      this.loadAndDisplay()
    } else {
      console.log("Le fichier commentaires n'existe pas.")
    }
  }

  // Chargement des commentaires du texte
  async loadAndDisplay(){
    Comment.reset()
    await Comment.DBclear()
    await this.load()
    console.log("comments récupérés :", this.data.comments)
    var allcomments = this.data.comments.map(dcomment => new Comment(dcomment))
    await Comment.storeAll(allcomments)
  }

  async load(){
    const my = this ;
    return new Promise((ok,ko)=>{
      fs.readFile(this.path, 'utf8', (err, data) => {
        if (err) ko(err)
        else { my.data = JSON.parse(data) ; ok() }
      })
    })
  }

  // Sauvegarde dans le fichier des commentaires du texte
  // @async
  save(){
    console.log('-> save')
    this.defineData()
    .then(this.doSave.bind(this))
    .then(this.endSave.bind(this))
    .catch(error)
  }
  doSave(){
    return new Promise((ok,ko) => {
      const iofile = new IOFile(this)
      iofile.save.call(iofile, {no_waiting_msg:true, after:ok})
    })
  }
  endSave(){
    console.info("Commentaires sauvés avec succès.", this.data)
  }

  // Les données, mais en version string
  get data() { return this._data }
  set data(v){ this._data = v}

  // Chemin d'accès au fichier des commentaires
  get path(){
    return this._path || (this._path = this.definePath())
  }

  /** ---------------------------------------------------------------------
    *   Méthodes privées
    *
  *** --------------------------------------------------------------------- */
  definePath(){
    return path.join(this.texte.folder, `${this.texte.affixe}.doctagger`)
  }

  /**
    Définit les données à enregistrer dans le fichier
  **/
  async defineData(){
    const allcomments = await Comment.DBgetAll()
    this._data = JSON.stringify({
        textPath: this.texte.path
      , appVersion: App.version
      , appName: App.productName
      , lastCommenter: UI.FieldAuthor.value
      , date: now()
      , comments: allcomments
    })
  }
}
