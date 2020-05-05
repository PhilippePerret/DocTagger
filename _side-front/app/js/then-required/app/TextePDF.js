'use strict';

/**
  Class TextePDF
  --------------
  Pour gérer l'export en PDF
**/
class TextePDF {

  // Instanciation à l'aide de l'instance Texte
  constructor(texte){
    this.texte = texte
  }

  export(){
    var pdf   = require("pdf-creator-node");
    var html  = this.html ;
    // var html = window.document.documentElement.outerHTML

    // Pour débug, on écrit le document HTML final
    fs.writeFile(this.pathHtml, html, err => {
      if (err) console.error(err)
      else {console.info("Témoin HTML enregistré")}
    })


    var options = {
      format: "A4",
      orientation: "portrait",
      // orientation: "landscape",
      border: "10mm",
      header: {
          // height: "45mm",
          // contents: '<div style="text-align: center;">Doc Tagger</div>'
      },
      "footer": {
        "height": "20mm",
        "contents": {
          first: 'Cover page',
          2: 'Second page', // Any page number is working. 1-based index
          default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
          last: 'Last Page'
        }
      }
    };
    var document = {
        html: html,
        data: {},
        path: this.path
    };

    pdf.create(document, options)
    .then(this.endCreate.bind(this))
    .catch(console.error);


  }
  endCreate(data){
    console.log("Fichier %s créé avec succès", data.filename)
    // execSync(`open "${data.filename}"`)
  }

  get html(){
    return this.header + DGet('#content').innerHTML + this.footer
  }

  // Retourne le path du document HTML témoin
  get pathHtml(){
    return path.join(this.texte.folder, `${this.texte.affixe}-comments.html`)
  }
  // Retourne le path du document pdf
  get path(){
    return path.join(this.texte.folder, `${this.texte.affixe}-comments.pdf`)
  }

  get css(){
    return '' //pour le moment
  }

  get header(){
    return `
<!DOCTYPE html>
<html lang="fr" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Doc Tagger</title>
  </head>
  ${this.css}
<style type="text/css">
#document-tools{display:none;}
body{
  width:19cm;
  display:grid;
  grid-template-columns: calc(60% - 22px) 20px calc(40% - 2px);
  grid-template-rows: auto;
}
#column-document {
  grid-column:1;
  grid-row:1;
  width:100%;
  position:relative;
  font-family:'${Texte.fontFamily}';
  font-size:${Texte.fontSize}pt;
  border:1px dashed green;
}
#column-comments {
  grid-column:3;
  grid-row:1;
  position:relative;
  font-family:'${this.comments.fontFamily}';
  font-size:${this.comments.fontSize};
  border:1px dashed blue;
}
#column-comments div.com {
  position:absolute;
}
</style>
<body>
    `
  }
  get footer(){
    return `
</body></html>
    `
  }

  get comments(){
    return {
        fontSize: '0.85em'
      , fontFamily: 'Avenir'
    }
  }
}
