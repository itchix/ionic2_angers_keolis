import { Component } from '@angular/core';

import { NavController, NavParams, Platform } from 'ionic-angular';
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
  public times: Array<any>;
  public showFind: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public keolisApi: KeolisAPI, public linesService: LinesService) {
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
  }

  onLineSelected(versSelected: string) {
    this.platform.ready().then(() => {
      this.keolisApi.getStopsByLines(versSelected)
        .then(data => {
          let that = this;
          //console.log(data.headers);
          //console.log(data.status);
          if(data.status == 200) {
            xml2js.parseString(data.data, function (err, result) {
              that.stops = result.xmldata.alss[0].als;
              that.couleur = result.xmldata.alss[0].als[0].ligne.couleur
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
    this.refs = this.stop.split(':')[1].trim();
    this.platform.ready().then(() => {
      this.keolisApi.getTimeByStop(this.refs)
        .then(data => {
          let that = this;
          //console.log(data.headers);
          //console.log(data.status);
          if(data.status == 200) {
            xml2js.parseString(data.data, function (err, result) {
              console.debug(result.xmldata);
              that.times = result.xmldata;
              that.showFind = true;
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
    this.linesService.saveStop(ligneId, sensId, arret, this.couleur);
  }

}
