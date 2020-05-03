'use strict';
/** ---------------------------------------------------------------------
  *   Class ColorSelector
  *   Pour faire un sélecteur de couleur
  *
*** --------------------------------------------------------------------- */
class ColorSelector  {

  static createIn(container, id){
    var colsel = new this(id)
    colsel.build()
    container.appendChild(colsel.obj)
    return colsel
  }

  static add(colselector){
    this.items = this.items || {}
    Object.assign(this.items, {[colselector.id]: colselector})
  }

  static get(sel_id){
    return this.items[sel_id]
  }

  static get COLORS(){
    if (undefined === this._colors){
      this._colors = {
          1:{id:1, name:'red',        value:'#f97979'}
        , 2:{id:2, name:'myrtille',   value:'#9ea5fb'}
        , 3:{id:3, name:'cacadoie',   value:'#dbe429'}
        , 4:{id:4, name:'mauve',      value:'#f793dd'}
        , 5:{id:5, name:'bleu clair', value:'#98f5ff'}
        , 6:{id:6, name:'vert',       value:'#bbf96e'}
        , 7:{id:7, name:'orange',     value:'#fdc391'}
      }
    } return this._colors
  }

  /**
    INSTANCE ColorSelector

    On récupère la valeur de la couleur par <ColorSelector>#colorId
  **/
  constructor(id){
    this.id = id
    this.constructor.add(this)
  }

  close(){
    console.log("-> close")
    this.obj.classList.remove('opened')
  }
  open(){
    this.obj.classList.add('opened')
  }

  build(){
    var cont = document.createElement('DIV')
    cont.id = `color-selector-${this.id}`
    cont.className = 'color-selector'
    UI.listen(cont,'click', this.open.bind(this))
    this.obj = cont

    // Pour mettre la couleur sélectionné
    var dsel = document.createElement('DIV')
    cont.appendChild(dsel)
    dsel.className = 'div-selected'
    var spansel = document.createElement('SPAN')
    spansel.className = 'colorbox'
    dsel.appendChild(spansel)

    // Pour les div de couleurs
    var divcols = document.createElement('DIV')
    divcols.className = 'div-colors'
    cont.appendChild(divcols)

    for(var colorId in this.constructor.COLORS){
      var cdiv = document.createElement('SPAN')
      cdiv.className = 'colorbox'
      cdiv.style = `background-color:${this.constructor.COLORS[colorId].value};`
      cdiv.setAttribute('data-color', colorId)
      divcols.appendChild(cdiv)
      UI.listen(cdiv,'click',this.onChooseColor.bind(this))
    }

    this.setColorTemoin(1)

  }

  onChooseColor(e){
    var targ = e.target
    var colorId = Number(targ.getAttribute('data-color'))
    this.setColorTemoin(colorId)
    this.close()
    return stopEvent(e)
  }

  setColorTemoin(colorId){
    this.value    = colorId
    this.colorId  = colorId
    this.spanTemoin.style = `background-color:${this.constructor.COLORS[colorId].value};`
  }

  get spanTemoin(){
    return this.obj.querySelector('.div-selected span.colorbox')
  }

}
