'use strict';

let texte ;

class Texte {
  static init(){
    texte = new Texte('#document')
    texte.traite();
    // On observe les boutons
    DGet('#btn-deselect').addEventListener('click', Mot.deselectAll.bind(Mot))
  }

  /**
    Méthode appelée par le bouton "Ouvrir le texte…" pour choisir un texte et l'ouvrir
  **/
  static chooseFileAndOpen(callback){
    const cfile = new ChromeReadFile({message:"Fichier texte :", extensions:['txt','md']})
    cfile.read()
    .then(this.defineTexte.bind(this))
    .catch(err => console.error(err))
  }
  /**
    Méthode appelée par le bouton "Ouvrir Texte et Commentaires…"
  **/
  static async chooseFileAndCommentsToOpen() {
    const cfile = new ChromeReadFile({message:"Fichier texte :", extensions:['txt','md']})
    var content = await cfile.read()
    this.defineTexte(content)
    const cfileComs = new ChromeReadFile({message:"Fichier commentaires", extensions:['txtcoms']})
    var coms = await cfile.read()
    Comment.displayComments(coms)
  }

  // Chargement et préparation du texte +string+ (qui vient d'un fichier)
  static defineTexte(string){
    texte = new Texte('#document')
    texte.setContent(string)
    texte.traite()
  }
  static openFileChoosed(ret){
    console.log("-> openFileChoosed")
    onChoosedFileToOpen(ret, this.defineTexte.bind(this))
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
  }
}
