import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { RealtimePage } from '../pages/realtime/realtime';
import { AddModifyRealtimePage } from '../pages/add-modify-realtime/add-modify-realtime';
import { LinesService } from "../pages/services/lines-service";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = RealtimePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public lineService: LinesService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Visualiser', component: RealtimePage },
      { title: 'Ajouter', component: AddModifyRealtimePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.lineService.initDB();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
