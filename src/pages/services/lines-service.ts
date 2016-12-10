import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';

@Injectable()
export class LinesService {

  public db: SQLite;

  static get parameters(){
    return []
  }

  constructor() {

  }

  initDB() {
    this.db = new SQLite();
    this.db.openDatabase({
      name: 'dataAngersBusTram.db',
      location: 'default' // the location field is required
    }).then(() => {
      this.db.executeSql('CREATE TABLE IF NOT EXISTS realtime(id INTEGER PRIMARY KEY AUTOINCREMENT, ligne VARCHAR(32), sens VARCHAR(32), arret VARCHAR(32), couleur VARCHAR(32))', {}).then(() => {

      }, (err) => {
        console.error('Unable to execute sql: ', err);
      });
    }, (err) => {
      console.error('Unable to open database: ', err);
    });
  }

  getStops() {
    return this.db.executeSql('SELECT ligne, sens, arret, couleur FROM realtime', {});
  }

  saveStop(ligne: string, sens: string, arret: string, couleur: string) {
    this.db.executeSql("INSERT INTO realtime (ligne, sens, arret, couleur) VALUES (?, ?, ?, ?)", [ligne, sens, arret, couleur]);
  }

}
