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
  }
  static close(){
    this.obj.classList.add('closed')
    this.obj.classList.remove('opened')
    this.reset()
  }
  static init(){
    this.obj = DGet('#form-comment')
    this.prepare()
  }
  static prepare(){
    this.hiddenId = this.obj.querySelector('#comment-id')
    this.textareaContent = DGet('#comment-content')
    this.divColors = this.obj.querySelector('#comment-color')
    this.colorSelector = ColorSelector.createIn(this.divColors)

    this.menuTypes = this.obj.querySelector('#comment-type')
    UI.peupleMenu(this.menuTypes, COMMENT_TYPES)
    this.menuIntensity = this.obj.querySelector('#comment-intensity')
    this.btnSave = DGet('#btn-save-comment')
    this.btnSave.addEventListener('click', this.onClickSave.bind(this))
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
      , color: this.menuColors.value
      , author: UI.FieldAuthorDim.value // hors du formulaire
    }
  }
}
