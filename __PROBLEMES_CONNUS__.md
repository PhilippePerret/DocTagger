# PROBLÈMES CONNUS

* Il faut charger electron (`npm i electron --save`)
* Si on doit utiliser une base de données, et créer des tables, il faut débloquer le code propre dans `main.js`.
* Le `body` est un grid. Modifier le fichier `_side-front/system/css/ui.css` pour obtenir un body normal.
* `elecron-packager` n'est peut-être pas installé au moment de la compilation. Jouer `npm i electron-packager --save-dev`.
