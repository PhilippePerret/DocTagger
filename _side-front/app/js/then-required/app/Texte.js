'use strict';

let texte ;

class Texte {
  static init(){
    texte = new Texte('#document')
    texte.traite();
  }

  static async retrieveLastIfExists(){
    // On essaie de lire le fichier courant
    var textePath = Prefs.get('texte-path')
    if (textePath) { this.load(textePath) }
    else { this.chooseTexte() }
  }

  // Méthode pour choisir un texte
  static chooseTexte(){
    var path = chooseFile()
    // Vérifier que ce soit un fichier conforme
    // TODO
    if ( VALID_EXTENSIONS.includes(path.split('.').pop()) ) {
      if (!path) return
      Prefs.set('texte-path', path)
      this.load(path)
    } else {
      error(`Le fichier n'a pas une extension conforme (extensions possible : ${VALID_EXTENSIONS.join(', ')})`)
    }
  }

  // Chargement et préparation du texte +string+ (qui vient d'un fichier)
  static load(textePath){
    texte = new Texte('#document', textePath)
    texte.setContent(IO.loadSync(textePath))
    texte.traite()
    Comment.load(texte)
  }

  // ---------------------------------------------------------------------
  constructor(conteneur, path){
    this.container = DGet(conteneur)
    this.path = path
  }
  setContent(string){
    string = string.replace(/\r?\n/g,'<br>')
    this.obj.innerHTML = string
  }
  get obj(){
    return this._obj || (this._obj = document.querySelector('#document') )
  }
  get content(){
    return this._content || (this._content = this.container.innerHTML)
  }
  traite(){
    Mot.init()
    var imot = 0;
    var prepared_content = [];
    this.content.split(' ').forEach( mot => {
      prepared_content.push(`<m id="m${++imot}">${mot} </m>`)
    })
    this.container.innerHTML = prepared_content.join('')
    for(var i=1; i<=imot;++i){
      var mot = new Mot(Number(i))
      mot.observe()
    }
    console.log("Texte préparé.")

    // Affichage de ses commentaires
    Comment.displayAllComments();
  }
  get commentPath(){
    return this._commentsPath || (this._commentsPath = this.setCommentsPath())
  }
  setCommentsPath(){
    this.folder = path.dirname(this.path)
    this.affixe = path.basename(this.path, path.extname(this.path))
    return path.join(this.folder, `${this.affixe}.doctagger`)
  }

  VALID_EXTENSIONS = ['md','mmd','text','txt','markdown']
}
