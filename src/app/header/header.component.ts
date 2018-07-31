import { Component, OnInit } from '@angular/core';
import {DataService} from "../data-service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  countBook: number=0;
  countCategories: number=0;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getData().subscribe((books)=>{
      this.countBook=books['books'].length;
      let categories=[]
      for(let i=0;i<books['books'].length;i++){
        categories=categories.concat(books['books'][i].categories)
      }
      categories.sort()
      this.countCategories= new Set(categories).size;

    })
  }

}
