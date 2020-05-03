class Mot {
  static init(){
    this.items = {}
    this.selections = []
  }
  static get(mot_id){
    return this.items[mot_id]
  }
  static add(mot){
    Object.assign(this.items, {[mot.id]: mot})
  }

  static mouseDownOn(mot){
    this.motOn = mot
    mot.toggleState()
    this.motOn.newState = Boolean(mot.isSelected)
  }
  static mouseOverOn(mot){
    if ( this.motOn ) { mot.setState(this.motOn.newState) }

  }
  static mouseUpOn(mot){
    this.motOff = mot
    if ( this.motOn && this.motOn.newState ) {
      FormComment.open()
    }
    this.motOn = null
  }

  static addToSelection(mot){
    this.selections.push(mot)
  }
  static removeFromSelection(mot){
    var newl = []
    this.selections.forEach(m => {
      if ( mot.id == m.id ) return
      newl.push(m)
    })
    this.selections = newl;
    newl = null;
  }

  static deselectAll(){
    this.selections.forEach(mot => {mot.setState(false)})
    FormComment.close()
  }

  // ---------------------------------------------------------------------
  //  INSTANCES
  // ---------------------------------------------------------------------
  constructor(id, mot){
    this.id = id
    this.constructor.add(this)
  }
  observe(){
    // this.obj.addEventListener('click', this.toggleState.bind(this))
    this.obj.addEventListener('mousedown', this.onMouseDown.bind(this))
    this.obj.addEventListener('mouseup', this.onMouseUp.bind(this))
    this.obj.addEventListener('mouseover', this.onMouseOver.bind(this))
  }

  onMouseDown(ev) {this.constructor.mouseDownOn(this)}
  onMouseUp(ev)   {this.constructor.mouseUpOn(this)}
  onMouseOver(ev) {this.constructor.mouseOverOn(this)}

  toggleState(){
    this.isSelected = !this.isSelected
    this.setState()
  }
  setState(value){
    if (undefined !== value) this.isSelected = Boolean(value)
    if ( this.isSelected ) {
      this.obj.classList.add('selected')
      this.constructor.addToSelection(this)
    } else {
      this.obj.classList.remove('selected')
      this.constructor.removeFromSelection(this)
    }
  }

  onClick(){
    this.toggleState()
  }

  /**
    Quand le mot fait partie d'un commentaire, on le colorise
  **/
  setColor(color){
    this.obj.style.backgroundColor = color
  }

  get top(){
    return this._top || (this._top = this.obj.offsetTop)
  }
  get obj(){
    return this._obj || (this._obj = DGet(`#${this.domId}`))
  }
  get domId(){
    return this._domid || (this._domid = `m${this.id}`)
  }
}
