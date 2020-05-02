/**
  Sandbox
**/
class Sandbox {

  /**
    Pour choisir un fichier et retourner un objet contenant :
    var fileObject = {
      handler:  FileSystemFileHandle,
      file:     File,
    }
    Pour obtenir le contenu :
      fileObject.file.text()
  **/
  static async chooseAndRead(){
    const handler = await window.chooseFileSystemEntries();
    console.log(handler)
    const file = await handler.getFile();
    console.log("file:",file)
    const contents = await file.text();
    console.log("contents:", contents)
    return {handler: handler, file: file}
  }

  static write(entry){
    console.log("-> write")
    entry.createWriter(function(writer){
      console.log("writer:",writer)
      writer.onwriteend = e => {console.log("écriture achevée")}
      writer.onerror = e => {console.error("Une erreur est survenue", e)}
      var blob = new Blob(['Lorem Ipsum'], {type: 'text/plain'});
      writer.write(blob)
    }, error)
  }

  static async chooseAndWrite(content){

    const handler = await this.getWritableFile()
    console.log("handler:",handler)
    const file = await handler.getFile()
    console.log("file:",file)
    // Ni l'un ni l'autre de ces deux solutions ne fonctionne (file et handler
    // ne connaissent pas la méthode createWritable)
    // const writer = await handler.createWritable();
    // const writer = await file.createWritable();
    // console.log("writer:", writer)

    // file.createWriter() // NON

    const writer = await handler.createWriter()
    console.log("writer:", writer)
    await writer.write(new Blob(["Coucou c'est nous"]), {type:'text:/plain'})
    await writer.close()

    // const folder = await this.getFolder()
    // console.log("folder:", folder)
    // const entry = await folder.getFile('monessai.txt', {create:true})
    // console.log("entry:", entry)

    // const handler = await this.getNewFileHandle();
    // console.log(handler)
    // const file = await handler.getFile()
    // console.log("file:",file)
    // this.write(handler)

    // handler.root.getFile('autre-essai.txt',{create:true}, this.write.bind.this, error)

    // Ne fonctionne pas
    // const writer  = await handler.createWritable()
    // await writer.write("Un nouveau texte pour voir.")
    // await writer.close()
  }

  static async getFolder(){
    const opts = {
      type: 'open-directory',
      accepts: [{
        description: 'Text file',
        extensions: ['txt'],
        mimeTypes: ['text/plain'],
      }],
    };
    const handle = await window.chooseFileSystemEntries(opts);
    return handle;
  }

  static async getWritableFile() {
    const opts = {
      type: 'save-file',
      accepts: [{
        description: 'Text file',
        extensions: ['txt'],
        mimeTypes: ['text/plain'],
      }],
    };
    const handle = await window.chooseFileSystemEntries(opts);
    return handle;
  }

  static try(){
    console.clear();

    this.chooseAndWrite().then(()=>{
      console.log("ok")
    }).catch(error)
    // this.chooseAndRead().then(()=>{
    //   console.log("ok")
    // }).catch(error)
  }
}
