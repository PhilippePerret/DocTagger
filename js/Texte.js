
class Texte {
  static init(){
    const texte = new Texte('#document')
    texte.traite();
    // On observe les boutons
    DGet('#btn-deselect').addEventListener('click', Mot.deselectAll.bind(Mot))
  }

  // ---------------------------------------------------------------------
  constructor(conteneur){
    this.container = DGet(conteneur)
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
