
// const lastPath = chrome.storage.local.get("last-path")
// console.log("lastPath", lastPath)

function errorHandler(err){
  console.error(err)
}
function onChoosedFileToOpen(ret, callback){
  console.log("-> onChoosedFileToOpen: ", ret)

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

/**
  Méthode appelée pour restaurer le fichier précédent
**/
function loadInitialFile(launchData) {
  console.log("-> loadInitialFile (launchData =)", launchData)
  if (launchData && launchData.items && launchData.items[0]) {
    // Méthode originale:
    // loadFileEntry(launchData.items[0].entry);

    onChoosedFileToOpen(launchData.items[0].entry, Texte.defineTexte.bind(Texte))
  }
  else {
    // see if the app retained access to an earlier file or directory
    chrome.storage.local.get('chosenFile', function(items) {
      if (items.chosenFile) {
        // if an entry was retained earlier, see if it can be restored
        chrome.fileSystem.isRestorable(items.chosenFile, function(bIsRestorable) {
          // the entry is still there, load the content
          console.info("Restoring " + items.chosenFile);
          chrome.fileSystem.restoreEntry(items.chosenFile, function(chosenEntry) {
            if (chosenEntry) {
              // Code original:
              // chosenEntry.isFile ? loadFileEntry(chosenEntry) : loadDirEntry(chosenEntry);

              if ( chosenEntry.isFile ) {
                onChoosedFileToOpen(launchData.items[0].entry, Texte.defineTexte.bind(Texte))
              } else {
                console.log("Je ne sais pas traiter les dossiers")
              }

            }
          });
        });
      }
    });
  }
}
