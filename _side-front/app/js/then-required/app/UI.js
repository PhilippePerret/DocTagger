class UI {

  static peupleMenu(menu, values){
    menu.innerHTML = ''
    for(var k in values){
      var dvalue = values[k]
      var opt = document.createElement('OPTION')
      opt.innerHTML = dvalue.name
      opt.value = k
      menu.appendChild(opt)
    }
  }

  static init(){
    // Pour retenir les listeners, par objet
    this.Listener= new Map()

    this.divDocument          = DGet('#document')
    this.divComments          = DGet('#comments')

    this.ButtonOpen           = DGet('#btn-open')
    this.ButtonSave           = DGet('#btn-save')
    this.ButtonRefreshUI      = DGet('#btn-refresh-ui')
    this.FieldAuthor          = DGet('#comment-author-name')
    this.FieldAuthorDim       = DGet('#comment-author-dim')
    this.ButtonDeselectAllMots= DGet('#btn-deselect')
    this.ButtonSandbox        = DGet('#btn-sandbox')
    this.ButtonExportPDF      = DGet('#btn-export-pdf')

    this.ButtonTextePlus      = DGet('#btn-texte-plus')
    this.ButtonTexteMoins     = DGet('#btn-texte-moins')

    this.observe()
    this.refresh()
  }
  static observe(){
    [
      [this.ButtonOpen, 'click', Texte.chooseTexte.bind(Texte)],
      [this.ButtonRefreshUI, 'click', this.refresh.bind(this)],
      [this.ButtonDeselectAllMots, 'click', Mot.deselectAll.bind(Mot)],
      [this.ButtonSandbox, 'click', Sandbox.try.bind(Sandbox)]
      , [this.ButtonTextePlus,'click', Texte.sizeUp.bind(Texte)]
      , [this.ButtonTexteMoins,'click', Texte.sizeDown.bind(Texte)]
      , [this.ButtonExportPDF, 'click', Texte.buttonRequiresTexte.bind(Texte)]
    ].forEach( devent => {
      var [obj, typeE, method] = devent
      this.listen(obj,typeE,method)
    })
  }

  /**
    On prépare l'interface pour le texte chargé
  **/
  static prepareForTexte(texte){
    this.unlisten(this.ButtonExportPDF, 'click')
    this.listen(this.ButtonExportPDF, 'click', texte.exportPDF.bind(texte))
  }
  /**
    Quand on charge un texte, dès qu'on appelle ses commentaires (qu'ils
    existent ou non), on définit le click-listener du bouton save
  **/
  static setObserverBoutonSave(textecoms){
    this.listen(this.ButtonSave, 'click', textecoms.save.bind(textecoms))
  }

  static listen(obj, typeEvent, method){
    this.Listener.set(obj, {[typeEvent]: method})
    obj.addEventListener(typeEvent, method)
  }
  static unlisten(obj, typeEvent){
    var method = this.Listener.get(obj)[typeEvent]
    obj.removeEventListener(typeEvent, method)
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
