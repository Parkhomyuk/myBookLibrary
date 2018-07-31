import { Component, OnInit } from '@angular/core';
import {DataService} from "../data-service";
import {Book} from "../model/book";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {
  books:any=[];
  booksAll:any=[];
  bookCurrent:Book;
  bookDelete:Book= new Book();
  toggleBack:any={'static':'static','displayDetails':false,'display':false, 'deletePopUp':'none'};
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getData().subscribe((books)=>{this.books=books['books'].slice(0,24); this.booksAll=books['books'];console.log(this.books)})
    this.bookCurrent= new Book();
  }
  onDetailsBook(book){
    this.bookCurrent=book;
    this.toggleBack={'static':'fixed','display':true,'displayDetails':true,'deletePopUp':'none'}
    console.log(this.bookCurrent)
  }
  onCloseToggle(){
    this.toggleBack={'static':'static','display':false};
    this.toggleBack={};

  }
  onDeleteWarning(id:number){
    this.toggleBack={'static':'fixed','display':true,'displayDetails':false,'deletePopUp':'block'}
    this.booksAll.some((element,index, array)=>{ this.bookDelete=element; console.log(element);return element['_id']==id});

  }
  onDeleteBook(id:number){
    this.toggleBack={'static':'static','display':false,'displayDetails':false,'deletePopUp':'none'}
     for(let i=0;i<this.books.length;i++){
      if(this.books[i]._id==id){
          this.books.splice(i,1)
      }
    }

  }
  onDeleteCansel(){
    this.toggleBack={'static':'static','display':false,'displayDetails':false,'deletePopUp':'none'}
  }

}
