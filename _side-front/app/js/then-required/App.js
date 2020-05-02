'use strict'
/** ---------------------------------------------------------------------
  *   Object App
  *   ----------
  *   L'application
  --------------
  version 0.5.0
  --------------

  # 0.5.0
      Ajout de la méthode App.absolutePath qui retourne un path absolu
      fonctionnant aussi bien en développement qu'en production (package)
*** --------------------------------------------------------------------- */
const App = {

  async init(){
    log.info("-> App.init")

    // Si on utilise Debug.js, on peut décommenter la ligne suivante
    // pour ne pas débugger ou débugger
    // X().stop() // ne pas débugguer
    // X().start() // débugguer

    /*/ Le code propre à l'application
    this.loading = true
    UI.init()
    UI.appInit()
    Prefs.load()
    if ( Prefs.get('load_last_on_start') && Prefs.get('path_texte') ) {
      PTexte.open(Prefs.get('path_texte'))
    } else {
      this.onReady()
    }
    this.loading = false
    //*/ // Fin du code propre

    log.info("<- App.init")
  }

  /**
    Méthode appelée après le chargement du texte courant (if any)
    ou l'initialisation de l'application (ci-dessus)
  **/
, onReady(){
    // TEST
    // new PReport().show()
  }

  /**
    Chargement du module d'affixe +moduleName+
  **/
, requireModule(moduleName){
    return require(path.join(this.modulesFolder,`${moduleName}.js`))
  }

  /**
    Retourne le path absolu, en développement ou en production, du
    path relatif +relativePath+

    +Params+::
      +relativePath+::[String] Chemin relatif
  **/
, absolutePath(relativePath){
    return path.normalize(path.join(app.getAppPath(),relativePath))
  }

  /**
    En cas d'erreur, on appelle toujours cette méthode.
    Par exemple :
      mafonctionasync()
        .then(autrefonction)
        .catch(App.onError)
  **/
, onError(err) {
    if (false == UI.errorAlreadySignaled){
      UI.flash("Une erreur est survenue (consulter la console)", {style:'warning', keep:true})
      UI.errorAlreadySignaled = true
    }
    console.error(err)
  }

, unBouton(){
    alert("Vous pouvez utiliser ce bouton pour lancer une opération.")
  }
}

Object.defineProperties(App,{
  ApplicationSupportFolder:{get(){
    if (undefined === this._appsupportfolder){
      this._appsupportfolder = app.getPath('userData')
    } return this._appsupportfolder
  }}

, modulesFolder:{get(){
    return this._modulesfolder || (this._modulesfolder = path.join(app.getAppPath(),'_side-front','js','modules'))
  }}
})
