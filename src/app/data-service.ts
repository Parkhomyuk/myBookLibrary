import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "../../node_modules/rxjs/internal/BehaviorSubject";
import {Book} from "./model/book";

@Injectable()
export class DataService{
  countBookChanged = new Subject<Number>();
  countCategoriesChanged = new Subject<Number>();
  BooksChanged = new Subject<any>();
  countOfBook:number;
  countOfCategories:number;
  toggleOfAddBook:string;
  toggleAddBook= new Subject<any>();
  booksAllChanges:any=[];
  configUrl = 'assets/data.json';

  books:any=[];

  categories:any=[];
  countBooks: number=0;
  countCategories: number=0;
  sideBarManage:any={'categories':'open'};

  constructor(private http: HttpClient) {
    this.getData().subscribe((data)=>{
      this.countBooks=data['books'].length;
      this.books=data['books'];
    })
  }

  getData(){
    return this.http.get(this.configUrl);
  }
  getCategories(){
     return this.getData().subscribe((data)=>{
       let categories=[];
       let books=data['books'];
       for(let i=0;i<this.books.length;i++){
         categories=categories.concat(this.books[i].categories)
       }
       categories.sort()
       this.categories= Array.from(new Set(categories));
     })
  }
  getBooksChanges(){
    return this.BooksChanged.next(this.booksAllChanges)
  }
  getBookCountChanged(){
    return this.countBookChanged.next(this.countOfBook)
  }
  getCategoriesCountChanged(){
    return this.countCategoriesChanged.next(this.countOfCategories)
  }
  getOfAddBookChanges(){
    return this.toggleAddBook.next(this.toggleOfAddBook)
  }
  getBooks(){
    return this.books;
  }
  getCountBooks(){
    return this.countBooks;
  }
  getCountCategories(){
    return this.countCategories;
  }
  getAddBookChanges(){
    return this.toggleAddBook;
  }

}
