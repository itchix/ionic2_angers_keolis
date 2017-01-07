import { Component } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import { AddModifyRealtimePage } from "../add-modify-realtime/add-modify-realtime";
import { LinesService } from "../services/lines-service";

@Component({
  selector: 'page-realtime',
  templateUrl: 'realtime.html'
})
export class RealtimePage {

  public stops: Array<any> = [];
  public dateNow: any;

  constructor(public platform: Platform, public navCtrl: NavController, public lineService: LinesService) {
    let that = this;
    setInterval(function(){
      let date = new Date();
      that.dateNow = date.toLocaleTimeString();
    }, 1000);
  }

  updateListFavoris() {
    let that = this;
    this.platform.ready().then(() => {
      setTimeout(function () {
          that.lineService.getStops().then((data) => {
            for (let i = 0; i < data.rows.length; i++) {
              let item = data.rows.item(i);
              console.log(item);
              that.stops.push({
                'ligne': item.ligne,
                'sens': item.sens,
                'arret': item.arret
              });
            }
          }, (err) => {
            console.error('Unable to execute sql: ', err);
          });
        },
        500
      );
    });
  }

  addRealtime() {
    this.navCtrl.push(AddModifyRealtimePage);
  }

  ionViewDidEnter() {
    this.stops = [];
    this.updateListFavoris();
  }

}
