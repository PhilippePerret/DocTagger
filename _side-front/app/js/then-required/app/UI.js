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
      [this.ButtonOpen, 'click', ChooserTexte.choose.bind(ChooserTexte)],
      [this.ButtonRefreshUI, 'click', this.refresh.bind(this)],
      [this.ButtonSave, 'click', Comment.saveAll.bind(Comment)],
      [this.ButtonDeselectAllMots, 'click', Mot.deselectAll.bind(Mot)],
      [this.ButtonSandbox, 'click', Sandbox.try.bind(Sandbox)]
    ].forEach( devent => {
      var [obj, typeE, method] = devent
      obj.addEventListener(typeE, method)
    })
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
