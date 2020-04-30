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
    Méthode appelée par le bouton "Ouvrir…" pour choisir un texte et l'ouvrir
  **/
  static async chooseFileAndOpen(){
    const cfile = new ChromeReadFile({message:"Fichier texte :", extensions:['txt','md']})
    const content = await cfile.read()
    this.defineTexte(content)
    // On peut mémoriser dans le local storage la variable pour le charger
    // plus tard.
    chrome.storage.local.set({'current_texte': cfile.retainedId}, ()=>{
      console.log("Fichier texte mémorisé pour chargement ultérieur.")
    })
    // await
    // let fileHandle;
    // chooseFileToOpen(this.openFileChoosed.bind(this)) // dans io.js pour le moment
  }
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
