import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatButtonModule} from '@angular/material/button';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ItemPopupComponent } from './item-popup/item-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
// import { MatOption } from '@angular/material/option';
import {MatSelectModule} from '@angular/material/select';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import { CommonModule } from '@angular/common';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { CurrenyCustomPipe } from './curreny-custom.pipe';
import {MatIconModule} from '@angular/material/icon';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    ItemPopupComponent,
    CurrenyCustomPipe
  ],
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatGridListModule,
    MatInputModule,
    MatDividerModule,
    BrowserModule,
    FormsModule,
    MatListModule,
    MatTableModule,
    MatCardModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatNativeDateModule,
    MatDatepickerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
