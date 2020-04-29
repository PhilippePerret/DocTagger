class UI {
  static init(){
    this.ButtonOpen = document.querySelector('#btn-open')
    this.observe()
  }
  static observe(){
    this.ButtonOpen.addEventListener('click',Texte.chooseFileAndOpen.bind(Texte))
  }
}
