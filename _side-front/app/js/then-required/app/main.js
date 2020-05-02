function DGet(selector){
  return document.querySelector(selector)
}
function DGetInner(selector){
  return DGet(selector).innerHTML
}

function error(msg){
  console.error(msg) // TODO Faire une fenêtre
  raise()
}

function raise(msg){
  if ( msg ) throw new Error(msg)
  else throw null
}

function useAsyncFS(fs){
  console.log("fs:", fs)
}

window.addEventListener("DOMContentLoaded", async (event) => {
  UI.init()
  Texte.init()
  FormComment.init()
  Comment.init()

  // Pour récupérer et afficher le dernier texte s'il existe
  await Texte.retrieveLastIfExists()

});
