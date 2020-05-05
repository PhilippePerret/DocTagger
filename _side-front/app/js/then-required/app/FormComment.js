'use strict'
/** ---------------------------------------------------------------------
  Class FormComment

  Pour la gestion du formulaire de commentaire

*** --------------------------------------------------------------------- */
class FormComment {
  /**
    Resetter le formulaire
    Ça consiste à le vider complètement pour éviter les doublons.
  **/
  static reset(){
    this.textareaContent.value = ''
    this.hiddenId.value = ''
  }
  static open(){
    this.obj.classList.remove('closed')
    this.obj.classList.add('opened')
    this.textareaContent.focus()
    this.textareaContent.select()
    this.oldOnkeypress = window.onkeydown
    window.onkeydown = this.onKeyPress.bind(this)
  }
  static close(){
    this.obj.classList.add('closed')
    this.obj.classList.remove('opened')
    this.reset()
    // Remettre les anciens observateur
    window.onkeydown = this.oldOnkeypress
  }
  static init(){
    this.obj = DGet('#form-comment')
    this.prepare()
  }
  static prepare(){
    this.hiddenId = this.obj.querySelector('#comment-id')
    this.textareaContent = DGet('#comment-content')
    this.divColors = this.obj.querySelector('#comment-color')
    this.colorSelector = ColorSelector.createIn(this.divColors, 'form-color')

    this.menuTypes = this.obj.querySelector('#comment-type')
    UI.peupleMenu(this.menuTypes, COMMENT_TYPES)
    this.menuIntensity = this.obj.querySelector('#comment-intensity')
    this.btnSave = DGet('#btn-save-comment')
    this.btnSave.addEventListener('click', this.onClickSave.bind(this))
  }

  static onKeyPress(e){
    // console.log("-> onKeyPress", e)
    if ( e.metaKey ) {
      if ( e.key == 't'){
        this.focusOnType()
      } else if (e.key == 'k') {
        this.colorSelector.open()
      } else if (e.key == 'i') {
        this.focusOnIntensity()
      }
      return stopEvent(e)
    }
  }

  static onClickSave(ev){
    if ( Mot.selections.length == 0) {
      return error("Il faut sélectionner le texte à commenter !")
    }
    const comment = new Comment(this.getData(), Mot.selections)
    comment.save()
    this.close()
    Mot.deselectAll.call(Mot)
  }

  /**
    Retourne les données du formulaire
  **/
  static getData(){
    return {
        id: this.hiddenId.value
      , type: this.menuTypes.value
      , content: this.textareaContent.value
      , intensity: this.menuIntensity.value
      , colorId: this.colorSelector.value
      , author: UI.FieldAuthorDim.value // hors du formulaire
    }
  }

  static focusOnType(){
    this.menuTypes.focus()
  }
  static focusOnIntensity(){
    this.menuIntensity.focus()
  }

}
