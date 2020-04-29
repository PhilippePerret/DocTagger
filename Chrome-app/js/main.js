function DGet(selector){
  return document.querySelector(selector)
}
function DGetInner(selector){
  return DGet(selector).innerHTML
}

function error(msg){
  console.error(msg) // TODO Faire une fenêtre
}

window.addEventListener("DOMContentLoaded", (event) => {
  UI.init()
  Texte.init()
  FormComment.init()
  Comment.init()
});
