import { Component, OnInit, Input } from '@angular/core';
import {Subscription} from "rxjs";
import {DataService} from "../data-service";
import {Book} from "../model/book";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {
  public mainTitle='All Books'
  public books:any=[];
  public booksAll:any=[];
  public booksReserve:any=[];
  public categories:any=[];
  public bookCurrent:Book;
  public bookDelete:Book= new Book();
//manage through sidebar
  @Input() toggleCategoriesMenu:string;
//manage popUp
  public viewPopup:string;
  // pagination variables
  public selectedCategory = null;
  public booksPerPage = 24;
  public selectedPage = 1;
  //manage ngClass & ngStyle
  public toggleBack:any={'static':'static','displayDetails':false,'display':false, 'deletePopUp':'none'};
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getData().subscribe((books)=>{
        let pageIndex = (this.selectedPage - 1) * this.booksPerPage;
      this.booksAll=books['books'].filter((book)=>{
        if(this.selectedCategory==null){return book}
        else{
          for(let i=0; i<book.categories.length;i++){
            if(book.categories[i]==this.selectedCategory){
              return book;
            }
          }
        }
      })
      this.booksReserve=this.booksAll;
      this.toggleCategoriesMenu='none'
      this.getCategoriesBooks();
      this.books=this.booksAll.slice(pageIndex,this.booksPerPage);
      this.dataService.BooksChanged.next(this.dataService.booksAllChanges=this.booksAll)
      this.dataService.countBookChanged.next(this.dataService.countOfBook=this.booksAll.length);
      this.dataService.countCategoriesChanged.next(this.dataService.countOfCategories=this.categories.length);

    },
    error => console.log('oops', error)
    )
      this.bookCurrent= new Book();

  }

  onDetailsBook(book){
    this.bookCurrent=book;
    this.viewPopup='viewBook'
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
          this.books.splice(i,1);
          this.booksAll.splice(i,1);
      }
    }
    this.getCategoriesBooks();
    this.dataService.countBookChanged.next(this.dataService.countOfBook=this.booksAll.length);
    this.dataService.countCategoriesChanged.next(this.dataService.countOfCategories=this.categories.length);
    this.dataService.BooksChanged.next(this.dataService.booksAllChanges=this.booksAll);
  }
  onEditBook(book){
    this.viewPopup='editBook';
    this.toggleBack={'static':'fixed','display':true,'displayDetails':true,'deletePopUp':'none'}
    console.log(book)
  }

  getCategoriesBooks(){
      let categories=[]
      for(let i=0;i<this.booksAll.length;i++){

        categories=categories.concat(this.booksAll[i].categories)
      }
      categories.sort()

      this.categories= Array.from(new Set(categories));
  }

  onSelectCategory(category: string=null){
    this.mainTitle=category;
    this.selectedCategory=category;
    this.booksAll=this.booksReserve;
    let booksStart=this.booksAll;

    booksStart=booksStart.filter((book)=>{
      if(this.selectedCategory==null){return book}
      else{
        for(let i=0; i<book.categories.length;i++){
          if(book.categories[i]==this.selectedCategory){
            return book;
          }
        }
      };
    });
    this.booksAll=booksStart;
    this.selectedPage=1;
    this.books=this.booksAll.slice(this.selectedPage-1,this.booksPerPage);

  }
  onSortByTitle(){
    let bookStart=this.booksAll;
    console.log(bookStart.sort(this.compare));
    this.books=bookStart.sort(this.compare);
  }
  compare(a,b) {
  if (a.title < b.title)
    return -1;
  if (a.title > b.title)
    return 1;
  return 0;
}

  resetFilters(){
    this.mainTitle='All Books';
    this.booksAll=this.booksReserve;
    this.books=this.booksAll.slice(0,this.booksPerPage);
  }

  onDeleteCancel(){
    this.toggleBack={'static':'static','display':false,'displayDetails':false,'deletePopUp':'none'}
  }
  get pageNumbers(): number[] {
    return Array(Math.ceil(this.booksAll.length / this.booksPerPage))
      .fill(0).map((x, i) => i + 1);
  }
  changePage(newPage: number) {
    this.selectedPage = newPage;
    let pageIndex = (this.selectedPage - 1) * this.booksPerPage;
    this.books=this.booksAll.slice(pageIndex,this.booksPerPage+pageIndex);
  }

}
