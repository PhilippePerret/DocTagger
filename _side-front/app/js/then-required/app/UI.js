class UI {
  static init(){
    this.divDocument          = DGet('#document')
    this.divComments          = DGet('#comments')

    this.ButtonOpen           = DGet('#btn-open')
    this.ButtonSave           = DGet('#btn-save')
    this.ButtonRefreshUI      = DGet('#btn-refresh-ui')
    this.FieldAuthor          = DGet('#comment-author-name')
    this.FieldAuthorDim       = DGet('#comment-author-dim')
    this.ButtonDeselectAllMots= DGet('#btn-deselect')
    this.ButtonSandbox        = DGet('#btn-sandbox')

    this.observe()
    this.refresh()
  }
  static observe(){
    [
      [this.ButtonOpen, 'click', Texte.chooseTexte.bind(Texte)],
      [this.ButtonRefreshUI, 'click', this.refresh.bind(this)],
      [this.ButtonDeselectAllMots, 'click', Mot.deselectAll.bind(Mot)],
      [this.ButtonSandbox, 'click', Sandbox.try.bind(Sandbox)]
    ].forEach( devent => {
      var [obj, typeE, method] = devent
      this.listen(obj,typeE,method)
    })
  }

  /**
    Quand on charge un texte, dès qu'on appelle ses commentaires (qu'ils
    existent ou non), on définit le click-listener du bouton save
  **/
  static setObserverBoutonSave(textecoms){
    this.listen(this.ButtonSave, 'click', textecoms.save.bind(textecoms))
  }

  static listen(obj, typeEvent, method){
    obj.addEventListener(typeEvent, method)
  }
  /**
    Méthode pour rafraichir l'UI, par exemple lorsque l'on redimensionne
    la fenêtre.
    Note : la méthode est aussi appelée au chargement
  **/
  static refresh(){
    // Définir la hauteur du texte/commentaire
    // TODO
    // Appliquer le dernier style choisi et le régler dans le menu
    // TODO
  }
}
