'use strict';

let texte ;

class Texte {
  static init(){
    texte = new Texte('#document')
    texte.traite();
  }

  static async retrieveLastIfExists(){
    // On essaie de lire le fichier courant
    var [texteFile, commentsFile] = await ChooserTexte.retrieveLastTexte()
    // console.log("texteFile: ", texteFile)
    // console.log("commentsFile: ", commentsFile)
    if ( texteFile ) {
      this.load(texteFile, commentsFile)
    } else {
      // Si aucun texte courant, on indique l'aide pour choisir un
      // texte à commenter.
      UI.divDocument.innerHTML = "<H3>Aide pour Doc-Tagger [à développer]</H3>"
    }
  }

  static load(texteFile, commentsFile){
    // On écrit le texte dans la page
    const reader = new FileReader();
    reader.onload = e => {
      console.log("e.target.result (dans load)", e.target.result)
      this.defineTexte(e.target.result)
      if (commentsFile) { Comment.load(commentsFile) }
    }
    // reader.readAsArrayBuffer(texteFile/* peut-être .file() */);
    reader.readAsText(texteFile/* peut-être .file() */);
  }

  // Chargement et préparation du texte +string+ (qui vient d'un fichier)
  static defineTexte(string){
    texte = new Texte('#document')
    texte.setContent(string)
    texte.traite()
  }

  // ---------------------------------------------------------------------
  constructor(conteneur){
    this.container = DGet(conteneur)
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
}
