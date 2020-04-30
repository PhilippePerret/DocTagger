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

  // // Récupérer le dernier fichier texte ouvert, si possible
  // chrome.storage.local.get(['current_texte'], (result) => {
  //   // S'il y avait un texte précédemment enregistré, on le recharge
  //   // TODO Il faudrait voir d'abord si c'est possible (chrome.filesysteme.isRestorable?)
  //   if (result.current_texte){
  //     chrome.fileSystem.isRestorable(result.current_texte, (isRestorable) => {
  //       rfile = new ChromeReadFile()
  //       rfile.restore(result.current_texte)
  //       .then(Texte.defineTexte.bind(Texte))
  //       .catch((err)=>{console.error(err)})
  //     })
  //   }
  // })
  //
  // loadInitialFile()

  // TODO Après, il faudra le mettre après la lecture du texte
  Comment.displayAllComments();

});
