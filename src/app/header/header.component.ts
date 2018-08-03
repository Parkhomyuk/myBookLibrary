import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {DataService} from "../data-service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  subscribtion: Subscription;
  subscribtionCat: Subscription;
  countBook: Number=0;
  countCategories: Number=0;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.subscribtion=this.dataService.countBookChanged.subscribe(data=>{ this.countBook=data});
    this.subscribtionCat=this.dataService.countCategoriesChanged.subscribe(data=>{ this.countCategories=data});
    this.countBook=this.dataService.getCountBooks();
    this.countCategories=this.dataService.getCountCategories();
  }
  ngOnDestroy(){
    this.subscribtion.unsubscribe();
    this.subscribtionCat.unsubscribe();
  }

}
