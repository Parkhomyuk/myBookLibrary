import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {DataService} from "../data-service";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {
   categories:any;
   books:any;
   booksL:any;
   sub= new Subscription();
  @Output() onChanged = new EventEmitter<string>();
  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.sub=this.dataService.BooksChanged.subscribe(data=>{ this.books=data;
      let categories=[]
      for(let i=0;i<this.books.length;i++){
        categories=categories.concat(this.books[i].categories)
      }
      categories.sort()
      this.categories= Array.from(new Set(categories));

    });

  }

  onOpenMenuSidebar(cat:string){
      this.onChanged.emit(cat);

  }

}
