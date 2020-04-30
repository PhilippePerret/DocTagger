class UI {
  static init(){
    this.ButtonOpen = document.querySelector('#btn-open')
    this.ButtonOpenTextNComs = document.querySelector('#btn-open-coms')
    this.ButtonSave = document.querySelector('#btn-save')
    this.ButtonRefreshUI = document.querySelector('#btn-refresh-ui')
    this.observe()
    this.refresh()
  }
  static observe(){
    this.ButtonOpen.addEventListener('click',Texte.chooseFileAndOpen.bind(Texte))
    this.ButtonOpenTextNComs.addEventListener('click', Texte.chooseFileAndCommentsToOpen.bind(Texte))
    this.ButtonRefreshUI.addEventListener('click', this.refresh.bind(this))
    this.ButtonSave.addEventListener('click', Comment.saveAll.bind(Comment))
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
