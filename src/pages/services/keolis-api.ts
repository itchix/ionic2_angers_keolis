import { Injectable } from '@angular/core';
import { HTTP } from 'ionic-native';

@Injectable()
export class KeolisAPI {

  static get parameters(){
    return []
  }

  constructor() {

  }

  getLines() {
    return HTTP.get('http://timeo3.keolis.com/relais/497.php', {
      xml: 1
    }, {});
  }

  getStopsByLines(versSelected: string) {
    let ligneId = versSelected.split(':')[0].trim();
    let sensId = versSelected.split(':')[1].trim();

    return HTTP.get("http://timeo3.keolis.com/relais/497.php", {
      xml: 1,
      ligne: ligneId,
      sens: sensId
    }, {});
  }

  getTimeByStop(refs: string) {
    if(refs.indexOf('|') > -1) {
      let refsSplitted =  refs.split('|');
      refs = refsSplitted.join(';');
    }

    return HTTP.get("http://timeo3.keolis.com/relais/497.php", {
      xml: 3,
      refs: refs,
      ran: 1
    }, {});
  }

}
