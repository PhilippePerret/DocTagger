'use strict';
/** ---------------------------------------------------------------------
  *   Class TexteComments
  *   -------------------
  *   Gestion des commentaires d'un texte. Correspond à la propriété
  *   `comments` du texte.
*** --------------------------------------------------------------------- */
class TexteComments {
  constructor(texte){
    this.texte = texte ;
  }

  /**
    Si des commentaires existent, ils sont chargés et affichés
  **/
  displayIfExists(){
    if ( fs.existsSync(this.path) ) {
      console.log("Le fichier commentaire existe")
    } else {
      console.log("Le fichier commentaire n'existe pas.")
    }
  }

  // Chargement des commentaires du texte
  load(){

  }

  // Chemin d'accès au fichier des commentaires
  get path(){
    return this._path || (this._path = this.definePath())
  }

  /** ---------------------------------------------------------------------
    *   Méthodes privées
    *
  *** --------------------------------------------------------------------- */
  definePath(){
    return path.join(this.texte.folder, `${this.texte.affixe}.doctagger`)
  }

}
