function DGet(selector){
  return document.querySelector(selector)
}
function DGetInner(selector){
  return DGet(selector).innerHTML
}

window.addEventListener("DOMContentLoaded", (event) => {
  Texte.init()
});
