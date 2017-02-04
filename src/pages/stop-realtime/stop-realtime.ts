import { Component } from '@angular/core';

import { NavController, Platform, NavParams } from 'ionic-angular';
import { KeolisAPI } from "../services/keolis-api";
import * as xml2js from "xml2js";

@Component({
  selector: 'page-stop-realtime',
  templateUrl: 'stop-realtime.html'
})
export class StopRealtimePage {

  public stop: any;
  public dateNow: any;
  public refs: any;
  public times: Array<any> = [];

  constructor(public platform: Platform,  public navParams: NavParams, public navCtrl: NavController,  public keolisApi: KeolisAPI) {
    this.stop = navParams.get("stop");
    this.platform.ready().then(() => {
      this.keolisApi.getStopsByLines(this.stop.ligne + ":" + this.stop.sens)
        .then(data => {
          let that = this;
          //console.log(data.headers);
          //console.log(data.status);
          if(data.status == 200) {
            xml2js.parseString(data.data, function (err, result) {
              for(var i = 0; i < result.xmldata.alss[0].als.length; i++) {
                if(result.xmldata.alss[0].als[i].arret[0] !== undefined && result.xmldata.alss[0].als[i].arret[0].nom[0] !== undefined) {
                  if(result.xmldata.alss[0].als[i].arret[0].nom[0] == that.stop.arret) {
                    that.refs = result.xmldata.alss[0].als[i].refs[0];
                  }
                }
              }


            })
          }
          this.keolisApi.getTimeByStop(this.refs)
            .then(data => {
              let that = this;
              let timesFromApi : Array<any>;
              //console.log(data.headers);
              //console.log(data.status);
              if(data.status == 200) {
                xml2js.parseString(data.data, function (err, result) {
                  timesFromApi = result.xmldata;
                  console.log(result.xmldata);
                  for(const horaire of timesFromApi['horaires'][0].horaire) {
                    if(horaire['passages'][0].passage !== undefined) {
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
        })
        .catch(error => {
          console.log(error);
        });
    });

  }

}
