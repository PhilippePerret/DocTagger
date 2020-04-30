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
  // loadInitialFile(launchData)

  // Récupérer le dernier fichier texte ouvert, si possible
  chrome.storage.local.get(['current_texte'], (result) => {
    if (result.current_texte){
      console.log("Il y a un fichier mémorisé")
    } else {
      console.log("Aucun fichier texte n'est mémorisé.")
    }
  })


  // loadInitialFile()
});
