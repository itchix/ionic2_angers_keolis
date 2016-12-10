import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { RealtimePage } from '../pages/realtime/realtime';
import { AddModifyRealtimePage } from '../pages/add-modify-realtime/add-modify-realtime';
import { LinesService } from "../pages/services/lines-service";
import { KeolisAPI } from "../pages/services/keolis-api";

@NgModule({
  declarations: [
    MyApp,
    RealtimePage,
    AddModifyRealtimePage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RealtimePage,
    AddModifyRealtimePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, LinesService, KeolisAPI]
})
export class AppModule {}
