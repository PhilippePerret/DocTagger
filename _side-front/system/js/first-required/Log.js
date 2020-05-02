/**
  Class Log
  ---------
  Gestion de la sortie en console

  version 1.0.0

**/


class Log {

  info(msg){
    this.log(msg, 'info')
  }
  warn(msg){
    this.log(msg, 'warn')
  }
  erro(msg){
    this.log(msg, 'error')
  }

  log(msg, type){
    console.log('%c'+msg, this.styleByType(type))
  }

  styleByType(type){
    switch(type){
      case 'info': return 'color:blue;';
      case 'warn': return 'color:orange;';
      case 'error': return 'color:red;font-weigth:bold;'
    }
  }
}

const log = new Log()
