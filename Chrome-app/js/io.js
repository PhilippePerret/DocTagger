
// const lastPath = chrome.storage.local.get("last-path")
// console.log("lastPath", lastPath)

function onChoosedFile(ret){
  console.log("Retour: ",ret)
}
function errorHandler(err){
  console.error(err)
}
function onChoosedFileToOpen(ret, callback){
  console.log("onChoosedFileToOpen: ", ret)

  const file = ret.file(function(file){
    var reader = new FileReader();
    reader.onerror = errorHandler;
    reader.onloadend = function(e) {
      console.log("TEXTE:",e.target.result);
      callback(e.target.result)
    };
    // On demande la lecture du fichier
    reader.readAsText(file);

  })

}



function chooseFile(callback){
  chrome.fileSystem.chooseEntry( {
      type: 'saveFile',
      suggestedName: 'comments.txt',
      accepts: [ { description: 'Text files (*.txt)',
                   extensions: ['txt']} ],
      acceptsAllTypes: true
    }, callback);
}
function chooseFileToOpen(callback){
  chrome.fileSystem.chooseEntry( {
      type: 'openFile',
      accepts: [ { description: 'Fichier texte (*.txt)',
                   extensions: ['txt']} ],
      acceptsAllTypes: true
    }, callback);
}
