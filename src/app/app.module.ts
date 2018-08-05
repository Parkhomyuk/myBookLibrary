import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MainComponent } from './main/main.component';
import {DataService} from "./data-service";
import {HttpClientModule} from "@angular/common/http";
import {Book} from "./model/book";
import { ShortPipe } from './pipes/short.pipe';
import { CorrecttitlePipe } from './pipes/correcttitle.pipe';
import { AddBookComponent } from './main/add-book/add-book.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    MainComponent,
    ShortPipe,
    CorrecttitlePipe,
    AddBookComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
