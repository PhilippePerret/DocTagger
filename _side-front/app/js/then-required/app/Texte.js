'use strict';

let texte ;

class Texte {

  static init(){
    this.VALID_EXTENSIONS = ['md','mmd','text','txt','markdown']
    this.fontSize = 13
  }

  /**
    Méthode qui, au démarrage, essaie de recharger le dernier texte
    (avec ses commentaires)
  **/
  static async retrieveLastIfExists(){
    // On essaie de lire le fichier courant
    var textePath = Prefs.get('texte-path')
    if (textePath) { this.load(textePath) }
    else { this.chooseTexte() }
  }

  /**
    Méthode qui permet d'ouvrir un nouveau texte, éventuellement avec
    ses commentaires.
  **/
  static chooseTexte(){
    var path = chooseFile()
    if (!path) return
    if ( this.VALID_EXTENSIONS.includes(path.split('.').pop()) ) {
      Prefs.set('texte-path', path)
      this.load(path)
    } else {
      error(`Le fichier ne possède pas une extension conforme (extensions possibles : ${this.VALID_EXTENSIONS.join(', ')})`)
    }
  }

  /**
    Chargement et préparation du texte du chemin d'accès +textePath+
    Si les commentaires existent, ils sont préparés aussi.
  **/
  static load(textePath){
    texte = new Texte('#document', textePath)
    texte.setContent(IO.loadSync(textePath))
    texte.traite()
    UI.prepareForTexte(texte)
  }

  // Pour augmenter la taille du texte
  static sizeUp(){
    this.fontSize = this.fontSize + 0.2 ;
    this.applyFontSize()
    // La mémoriser pour la prochaine fois
    // TODO
  }
  static sizeDown(){
    this.fontSize = this.fontSize - 0.2 ;
    this.applyFontSize()
    // La mémoriser pour la prochaine fois
    // TODO
  }

  // TODO pouvoir changer
  static get fontFamily(){
    return 'Avenir'
  }

  /**
    Méthode appelée quand on clique sur un bouton qui nécessite un
    texte chargé et qu'il n'y en a pas.
  **/
  static buttonRequiresTexte(){
    console.warn("Il faut charer un texte pour pouvoir utiliser cette fonction.")
  }

  static applyFontSize(){
    UI.divDocument.style.fontSize = `${this.fontSize}pt`
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

  /**
    Affichage du texte, préparation et affichage de ses commentaires
  **/
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
    console.info("--- Texte préparé. ---")
    this.comments.displayIfExists()
  }

  exportPDF(){
    this.pdfExporter.export()
  }

  get pdfExporter(){
    return this._pdfexporter || (this._pdfexporter = new TextePDF(this))
  }

  get comments(){
    return this._comments || (this._comments = new TexteComments(this))
  }

  get folder(){
    return this._folder || (this._folder = path.dirname(this.path))
  }
  get affixe(){
    return this._affixe || (this._affixe = path.basename(this.path, path.extname(this.path)))
  }

}
