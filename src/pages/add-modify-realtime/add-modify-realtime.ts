import { Component } from '@angular/core';

import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { LinesService } from "../services/lines-service";
import { KeolisAPI } from "../services/keolis-api";
import * as xml2js from "xml2js";

@Component({
  selector: 'page-add-modify-realtime',
  templateUrl: 'add-modify-realtime.html'
})
export class AddModifyRealtimePage {

  public lines: Array<any>;
  public stops : Array<any>;
  public vers: string;
  public stop: any;
  public couleur: string;
  public refs: string;
  public times: Array<any> = [];
  public showFind: boolean = false;
  public showArret: boolean = false;
  public dateNow: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public platform: Platform, public keolisApi: KeolisAPI, public linesService: LinesService) {
    let that = this;
    this.platform.ready().then(() => {
      this.keolisApi.getLines()
        .then(data => {
          let that = this;
          //console.log(data.headers);
          //console.log(data.status);
          if(data.status == 200) {
            xml2js.parseString(data.data, function (err, result) {
              that.lines = result.xmldata.alss[0].als;
            })
          }
        })
        .catch(error => {
          console.log(error);
        });
    });
    setInterval(function(){
      let date = new Date();
      that.dateNow = date.toLocaleTimeString();
    }, 1000);
  }

  onLineSelected(versSelected: string) {
    this.platform.ready().then(() => {
      this.keolisApi.getStopsByLines(versSelected)
        .then(data => {
          this.showArret = true;
          let that = this;
          //console.log(data.headers);
          //console.log(data.status);
          if(data.status == 200) {
            xml2js.parseString(data.data, function (err, result) {
              that.stops = result.xmldata.alss[0].als;
            })
          }
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

  onStopSelected(stopSelected: any) {
    this.stop = stopSelected;
  }

  find() {
    this.times = [];
    this.refs = this.stop.split(':')[1].trim();
    let timesFromApi : Array<any>;
    this.platform.ready().then(() => {
      this.keolisApi.getTimeByStop(this.refs)
        .then(data => {
          let that = this;
          //console.log(data.headers);
          //console.log(data.status);
          if(data.status == 200) {
            xml2js.parseString(data.data, function (err, result) {
              timesFromApi = result.xmldata;
              that.showFind = true;
              for(const horaire of timesFromApi['horaires'][0].horaire) {
                if(horaire['passages'][0].passage !== undefined) {
                  that.couleur = horaire['description'][0].couleur[0];
                  for(const time of horaire['passages'][0].passage) {
                    that.times.push(time);
                  }
                }
              }
              // Ascending sort
              that.times = that.times.sort((n1,n2) => {
                let hours1 = n1.duree[0].split(':')[0].trim();
                let hours2 = n2.duree[0].split(':')[0].trim();
                let minutes1 = n1.duree[0].split(':')[1].trim();
                let minutes2 = n2.duree[0].split(':')[1].trim();
                let date1 = new Date();
                date1.setHours(hours1);
                date1.setMinutes(minutes1);
                let date2 = new Date();
                date2.setHours(hours2);
                date2.setMinutes(minutes2);
                return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
              });
            })
          }
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

  save() {
    let ligneId = this.vers.split(':')[0].trim();
    let sensId = this.vers.split(':')[1].trim();
    let arret = this.stop.split(':')[0].trim();
    this.showAlert(ligneId, sensId, arret);
  }

  showAlert(ligneId, sensId, arret) {
    let alert = this.alertCtrl.create({
      title: 'Enregistrement',
      subTitle: 'Mettre en favoris la selection?',
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            //
          }
        },
        {
          text: 'Sauvegarder',
          handler: data => {
            this.linesService.saveStop(ligneId, sensId, arret, this.couleur);
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

}
