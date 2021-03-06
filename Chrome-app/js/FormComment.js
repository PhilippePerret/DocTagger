'use strict'
/** ---------------------------------------------------------------------
  Class FormComment

  Pour la gestion du formulaire de commentaire

*** --------------------------------------------------------------------- */
class FormComment {
  static open(){
    this.obj.classList.remove('closed')
    this.obj.classList.add('opened')
    this.textareaContent.focus()
    this.textareaContent.select()
  }
  static close(){
    this.obj.classList.add('closed')
    this.obj.classList.remove('opened')
    // On réinitialise tout pour éviter tout doublon
    this.textareaContent.value = ''
    this.hiddenId.value = ''
    Mot.deselectAll.call(Mot)
  }
  static init(){
    this.obj = DGet('#form-comment')
    this.prepare()
  }
  static prepare(){
    this.hiddenId = this.obj.querySelector('#comment-id')
    this.textareaContent = DGet('#comment-content')
    this.menuColors = this.obj.querySelector('#comment-color')
    this.menuTypes = this.obj.querySelector('#comment-type')
    this.menuTypes.innerHTML = ''
    for( var typ in COMMENT_TYPES) {
      var dtyp = COMMENT_TYPES[typ]
      var opt = document.createElement('OPTION')
      opt.value = dtyp.id
      opt.innerHTML = dtyp.name
      this.menuTypes.appendChild(opt)
    }
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
