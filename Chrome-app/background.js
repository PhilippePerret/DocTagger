/**

  Trouver de l'aide sur https://developer.chrome.com/apps[/fileSystem]
**/
chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create('index.htm', {
    'id': "doctagger-window",
    'bounds': {
      'width': 1400,
      'height': 400
    }
  }, function(win){
    win.contentWindow.launchData = launchData;
  });
});

/**
  À faire avant de fermer la fenêtre (i.e. quitter l'application)
**/
chrome.runtime.onSuspend.addListener(function() {
  // Do some simple clean-up tasks.
});
