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
  public times: Array<any>;

  constructor(public platform: Platform,  public navParams: NavParams, public navCtrl: NavController,  public keolisApi: KeolisAPI) {
    this.stop = navParams.get("stop");
    this.platform.ready().then(() => {
      this.keolisApi.getStopsByLines(this.stop.ligne)
        .then(data => {
          let that = this;
          //console.log(data.headers);
          //console.log(data.status);
          if(data.status == 200) {
            xml2js.parseString(data.data, function (err, result) {
              that.refs = result.xmldata.alss[0].als.refs[0];
            })
          }
          this.keolisApi.getTimeByStop(this.refs)
            .then(data => {
              let that = this;
              //console.log(data.headers);
              //console.log(data.status);
              if(data.status == 200) {
                xml2js.parseString(data.data, function (err, result) {
                  that.times = result.xmldata;
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
