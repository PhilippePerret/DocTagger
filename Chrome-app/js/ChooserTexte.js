'use strict'
/**
  Class ChooserTexte
  ------------------

  Le but de ce module est de gérer tout ce qui concerne le choix d'un
  texte avec sa mémorisation.
  Utilisation des méthodes natives.

  Choisir un texte, c'est en fait choisir un dossier contenant ce texte,
  voir les fichiers qu'il contient. Si le dossier contient un fichier
  d'extension '.doctagger', il considère que le fichier portant le même
  affixe avec l'extension '.txt' ou '.md' est le fichier texte correspondant.
  L'application a tout pour travailler.
  Dans le cas contraire (pas de fichier '.doctagger'), si le dossier contient
  plusieurs fichier texte (.txt ou .md), ce chooser demande de choisir le
  texte qui correspond le mieux.
  Le Chooser mémorise le fichier pour une utilisation ultérieur.
**/
class ChooserTexte {
  /**
    Entrée principale
    -----------------
    Appelée par le bouton 'Ouvrir…' de l'interface
  **/
  static choose(){
    try {
      var chooser = new this()
      chooser.exec()
    } catch (e) {
      console.info("Je passe par le catch")
    }
  }

  static async retrieveLastTexte(){
    var chooser = new this()
    await chooser.restoreTexteEntry()
    await chooser.restoreCommentsEntry()
    return [chooser.texteEntry, chooser.commentsEntry]
  }

  /** ---------------------------------------------------------------------
    *
    *   INSTANCE
    *
  *** --------------------------------------------------------------------- */

  constructor(){}

  /**
    = main =
    Méthode principale procédant au choix du texte, quand l'utilisateur
    a cliqué le bouton "Ouvrir…"
  **/
  async exec(){
    try { await this.chooseFolder() } catch (e){return}
    try { await this.findTextEntry()} catch (e){return}
    await Comment.DBclear()
    // On peut charger le texte
    Texte.load(this.texteEntry, this.commentsEntry)
  }

  /**
    Méthode appelée pour choisir le dossier contenant le texte
    @async
    Elle peut être annulée.
    +return+    undefined
    +product+   Défini la propriété this.folder
  **/
  async chooseFolder(){
    this.folder = await window.chooseFileSystemEntries(this.PARAMS_CHOOSE_FOLDER);
  }

  retainTexteEntry(){
    console.log("-> retainTexteEntry")
    return new Promise((ok,ko)=>{
      this.retain(this.texteEntry, 'texte-entry', ok)
    })
  }

  restoreTexteEntry(){
    return new Promise((ok,ko)=>{
      this.restore('texte-entry', ok)
    })
  }

  retainCommentsEntry(){
    console.log("-> retainCommentsEntry")
    return new Promise((ok,ko)=>{
      this.retain(this.commentsEntry, 'comments-entry')
    })
  }

  restoreCommentsEntry(){
    return new Promise((ok,ko)=>{
      this.restore('comments-entry', ok)
    })
  }

  /**
    Méthode pour se souvenir du dossier au prochain chargement
  **/
  retain(entry, key, ok){
    const my = this;
    let db;
    let con = indexedDB.open("DocTagger")
    con.onerror = error
    con.onsuccess = e => {
      db = e.target.result
      let tr = db.transaction(['filesref'], 'readwrite')
      let rq = tr.objectStore('filesref').put(entry, key)
      rq.onsuccess = e => {
        console.log("Succès store")
        console.log("e.target.result", e.target.result)
        ok()
      }
      rq.onerror = error
    }
    con.onupgradeneeded = e => {
      db = e.target.result;
      console.log('Run onupgradeneeded');
      if (!db.objectStoreNames.contains("filesref") ) {
        db.createObjectStore("filesref", { keypath: "id"});
      }
    }
  }

  /**
    Méthode pour récupérer le fichier de clé +key+ dans indexedDB
    C'est soit le texte original (key = 'texte-entry'), soit le fichier
    du commentaires ('comments-entry')
  **/
  restore(key, ok){
    const my = this;
    let db;
    let con = indexedDB.open("DocTagger")
    con.onerror = error
    con.onsuccess = e => {
      db = e.target.result
      let tr = db.transaction(['filesref'], 'readwrite')
      let rq = tr.objectStore('filesref').get(key)
      rq.onsuccess = e => {
        console.log("Succès store")
        console.log("e.target.result", e.target.result)
        if ( key == 'texte-entry') { my.texteEntry = e.target.result }
        else if ( key == 'comments-entry') { my.commentsEntry = e.target.result }
        else { console.error("Pas de clé connue, je ne sais pas quoi faire de ce retour")}
        ok()
      }
      rq.onerror = error
    }
    con.onupgradeneeded = e => {
      db = e.target.result;
      console.log('Run onupgradeneeded');
      if (!db.objectStoreNames.contains("filesref") ) {
        db.createObjectStore("filesref", { keypath: "id"});
      }
    }
  }

  async getEntries(){
    this._entries   = []
    this.candidats  = new Map()/*affixe: {:texte, :comments}*/
    var candidat;
    try {
      for await (const entry of this.folder.getEntries()) {
        if (entry.isDirectory) continue ;
        var lastp = entry.name.lastIndexOf('.')
        entry.affixe    = entry.name.substring(0, lastp);
        entry.extension = entry.name.substring(lastp+1, entry.name.length);

        var isComments  = entry.extension == '.doctagger'
        var isTexte     = this.EXTENSIONS_LIST.includes(entry.extension);

        // Si le fichier est soit un texte soit un commentaire, on crée un
        // candidat.
        if ( isComments || isTexte ){
          if ( ! this.candidats.has(entry.affixe) ){
            this.candidats.set(entry.affixe, {texte:null, comments:null})
          }
          candidat = this.candidats.get(entry.affixe)
          if ( isComments ) candidat.comments = entry
          else if (isTexte ) candidat.texte   = entry
        }
        // On ajoute l'entrée, on ne sait jamais, même si ce sont les
        // candidats qui vont être utiles.
        this._entries.push(entry)
      }
    } catch (e) {
      error(e)
    }
  }

  get entries(){ return this._entries }

  /**
    Méthode qui cherche le fichier texte dans le dossier
    S'il trouve un fichier .doctagger, il obtient tout ce qu'il faut.

    +Product+
      Cette méthode définit this.texteEntry et this.commentsEntry (s'il existe)
      Elle mémorise toujours le texteEntry pour un usage ultérieur.
  **/
  async findTextEntry(){
    // On relève toutes les entrées du dossier choisi
    await this.getEntries()

    // On boucle sur les candidats possible
    // Rappel : this.candidats est une Map
    // L'idéal, ce serait de trouver UN SEUL candidat qui définisse son
    // :texte et son :comments. Ça correspondrait au fichier texte et au fichier
    // commentaire.
    // Tous les cas :
    //    [1] Aucun candidat => erreur : pas de fichier texte dans le dossier
    //    [2] Un seul candidat avec un texte et un commentaire => On le prend
    //    [3] Plusieurs candidats avec texte et commentaire => il faut choisir
    //    [4] Un seul fichier texte (sans commentaires) => On le prend
    //    [5] Plusieurs fichiers texte (sans comments) => Il faut choisir
    // Note : le problème ici, c'est qu'on ne peut pas choisir un autre texte
    // s'il y a déjà un texte commenté. Peut-être faut-il prendre l'option de
    // présenter systématiquement la liste dès qu'il y a plusieurs textes et
    // de mettre en avant les candidats "complets".

    if (this.candidats.size == 0) { //[1]
      raise(`Aucun fichier texte dans ce dossier (les extensions possibles sont : ${this.EXTENSIONS_LIST.join(', ')}).`)
    }

    var candidatsComplets = []
    var candidatsTextesSeuls   = []
    this.candidats.forEach(candidat => {
      if ( candidat.texte && candidat.comments ) candidatsComplets.push(candidat)
      else if ( candidat.texte ) candidatsTextesSeuls.push(candidat)
      else {/* on ne tient pas compte des "commentaires perdus" */}
    })

    const NoTextesSeuls = candidatsTextesSeuls.length == 0

    var texteEntry, commentsEntry ;

    if (candidatsComplets.length == 1 && NoTextesSeuls) { //[2]
      texteEntry     = candidatsComplets[0].texte
      commentsEntry  = candidatsComplets[0].comments
    } else if (candidatsComplets.length > 1 && NoTextesSeuls) { // [3]
      var idx = await this.chooseFileIndexInList(candidatsComplets)
      texteEntry     = candidatsComplets[idx].texte
      commentsEntry  = candidatsComplets[idx].comments
    } else if ( candidatsTextesSeuls.length == 1) { // [4]
      texteEntry     = candidatsTextesSeuls[0].texte
      commentsEntry  = undefined
    } else if ( candidatsTextesSeuls.length > 1) { // [5]
      var idx = await this.chooseFileIndexInList(candidatsTextesSeuls)
      texteEntry     = candidatsTextesSeuls[idx].texte
      commentsEntry  = undefined
    } else { console.error("On ne devrait jamais arriver ici.") }


    // Pour obtenir réellement le fichier, on doit utiliser la méthode
    // asynchrone `getFile` sur le file handler
    this.texteEntry = await texteEntry.getFile()
    if (this.commentsEntry) {this.commentsEntry = await commentsEntry.getFile()}

    console.log("texteEntry", this.texteEntry)
    console.log("commentsEntry", this.commentsEntry)

    if ( !this.commentsEntry ){ // Le fichier n'existe pas, on le créé
      await this.createCommentsFile(texteEntry)
    }

    await this.retainTexteEntry()
    await this.retainCommentsEntry()

  }

  createCommentsFile(texteEntry){
    const my = this
    return new Promise((ok,ko)=>{
      this.folder.getFile(`${texteEntry.affixe}.doctagger`, {create:true}, entry => {
        my.commentsEntry = entry ;
        entry.createWriter(function(fileWriter) {
          fileWriter.onwriteend = function(e) {
            console.info('Création comments ok')
            ok()
          };
          fileWriter.onerror = console.error
          var alldata = {
            author: {patronyme: UI.FieldAuthor.value, diminutif: UI.FieldAuthorDim.value},
            comments: [],
            date: null // la régler plus tard
          }
          fileWriter.write(new Blob([JSON.stringify(alldata)], {type: 'text/plain'}));
        }, console.error)
      })// fin <folder>.getFile
    })//fin Promise
  }
  /** ---------------------------------------------------------------------
    *   MÉTHODES FONCTIONNELLE
    *
  *** --------------------------------------------------------------------- */
  chooseFileIndexInList(liste){
    return new Promise((ok,ko) => {
      // On affiche la liste et on attend que l'utilisateur choisisse un
      // item
      UI.divComments.innerHTML = ''
      var div = document.createElement('FIELDSET')
      div.id = 'div-ul'
      div.style = "display:inline-block;"
      UI.divComments.appendChild(div)
      var mes = document.createElement('LEGEND')
      mes.innerHTML = "Fichier à ouvrir :"
      div.appendChild(mes)
      var ul = document.createElement('UL')
      ul.id = 'affixes-ul'
      ul.style = "list-style:none;"
      div.appendChild(ul)
      for ( var idx in liste ) {
        var candidat = liste[idx]
        // console.log("Candidat:", candidat)
        var lien = document.createElement('LI')
        lien.type = 'button';
        lien.innerHTML = candidat.texte.name;
        lien.setAttribute('data-idx', idx);
        lien.addEventListener('click', e => {
          DGet('#div-ul').remove()
          ok(Number(e.target.getAttribute('data-idx')))
        })
        ul.appendChild(lien)
      }
    })
  }
  /** ---------------------------------------------------------------------
    *   CONSTANTES
    *
  *** --------------------------------------------------------------------- */
  // Paramètres (argument) pour choisir le dossier principal
  PARAMS_CHOOSE_FOLDER = {
      type: 'openDirectory'
    , accepts: [
        {description: "Dossier contenant le texte :"}
      ]
  }

  EXTENSIONS_LIST = ['txt','text','md','mmd','markdown']

}
