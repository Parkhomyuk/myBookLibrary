import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import {Subscription} from "rxjs";
import {DataService} from "../data-service";
import {Book} from "../model/book";
import {FormGroup, FormControl,FormArray, Validators} from "@angular/forms";




@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit  {

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
  public addBookToggle:boolean=false;
  public viewPopup:string;
  bookForm: FormGroup;
  public currentBookEdit: Book;
  // pagination variables
  public selectedCategory = null;
  public booksPerPage = 24;
  public selectedPage = 1;
  //manage ngClass & ngStyle
  public toggleBack:any={'static':'static','displayDetails':false,'display':false, 'deletePopUp':'none'};
  constructor(private dataService: DataService) { }

  ngOnInit() {

      this.getBooks();
      this.bookCurrent= new Book();
      this.initForm();

  }
  getBooks(){
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
    this.currentBookEdit=book;
    console.log(this.currentBookEdit)
    this.initForm();
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
  onSortByTitle(param:string){
    let bookStart=this.booksAll;

    console.log(bookStart.sort(this.compare));
    if(param=='az'){

      this.booksAll=bookStart.sort(this.compare);
    }else{

      this.booksAll=bookStart.sort(this.compareRevers);
    }
    this.books=this.booksAll.slice(this.selectedPage-1,this.booksPerPage);
  }
  backByDefoult(){
    this.getBooks();
  }
  compare(a,b) {
  if (a.title < b.title)
    return -1;
  if (a.title > b.title)
    return 1;
  return 0;
}
  compareRevers(a,b) {
    if (a.title > b.title)
      return -1;
    if (a.title < b.title)
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

  //Forms model
  private initForm(){
    let title='';
    let _id=null;
    let isbn=null;
    let pageCount=null;
    let status=null;
    let thumbnailUrl=null;
    let longDescription=null;
    let publishedDate=null;
    let bookAuthors= new FormArray([]);
    let bookCategories= new FormArray([]);
    if(this.currentBookEdit!=undefined){
      title=this.currentBookEdit.title;
      _id=this.currentBookEdit._id;
      isbn=this.currentBookEdit.isbn;
      pageCount=this.currentBookEdit.pageCount;
      status=this.currentBookEdit.status;
      thumbnailUrl=this.currentBookEdit.thumbnailUrl;
      longDescription=this.currentBookEdit.longDescription;
      publishedDate=this.currentBookEdit.publishedDate['$date'];
      if(this.currentBookEdit['authors']){
        for(let author of this.currentBookEdit.authors){

          bookAuthors.push(new FormGroup({
              'nameAuthor': new FormControl(author,  Validators.pattern(/^[A-Z]/))
            }))
        }
      }
      if(this.currentBookEdit['categories']){
        for(let category of this.currentBookEdit.categories){

          //noinspection TypeScriptValidateTypes
          bookCategories.push(new FormGroup({
            'nameCategory': new FormControl(category,  Validators.required)
          }))
        }
      }

    }
    //noinspection TypeScriptValidateTypes
    this.bookForm= new FormGroup({
      'title': new FormControl(title,[Validators.required, Validators.pattern(/^[A-Z]/)] ),
      '_id': new FormControl(_id,[Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      'isbn': new FormControl(isbn,Validators.required),
      'pageCount': new FormControl(pageCount,Validators.required ),
      'status': new FormControl(status, Validators.required ),
      'thumbnailUrl': new FormControl(thumbnailUrl,Validators.required ),
      'longDescription': new FormControl(longDescription, Validators.required ),
      'publishedDate': new FormControl(publishedDate, [Validators.required]),
      'authors': bookAuthors,
      'categories': bookCategories,
    })
  }
  onAddAuthor(){
    //noinspection TypeScriptUnresolvedFunction,TypeScriptValidateTypes
    (<FormArray>this.bookForm.get('authors')).push(

        new FormGroup({
        'nameAuthor': new FormControl(null,Validators.required ) })

    )
  }
  onAddCategory(){
    //noinspection TypeScriptUnresolvedFunction,TypeScriptValidateTypes
    (<FormArray>this.bookForm.get('categories')).push(

      new FormGroup({
        'nameCategory': new FormControl(null,Validators.required ) })

    )
  }
  onDeleteAuthor(index:number){
    //noinspection TypeScriptUnresolvedFunction
    (<FormArray>this.bookForm.get('authors')).removeAt(index)
  }
  onDeleteCategory(index:number){
    //noinspection TypeScriptUnresolvedFunction
    (<FormArray>this.bookForm.get('categories')).removeAt(index)
  }
  onSubmit(){
    console.log(this.bookForm.value)
    let authors=[];
    let categories=[];
    for(let j=0;j<this.bookForm.value['authors'].length;j++){
      authors.push(this.bookForm.value['authors'][j].nameAuthor)
    }
    this.bookForm.value['authors']=authors;
    for(let j=0;j<this.bookForm.value['categories'].length;j++){
      categories.push(this.bookForm.value['categories'][j].nameCategory)
    }
    this.bookForm.value['categories']=categories;
    for(let i=0;i<this.books.length;i++){
      if(this.bookForm.value._id==this.books[i]['_id']){
        this.books[i]=this.bookForm.value;
        this.booksAll[i]=this.bookForm.value;

      }
    }
    this.onCloseToggle();
  }
  onAddNewBook(book){
    let authors=[];
    let categories=[];
    for(let j=0;j<book['authors'].length;j++){
      authors.push(book['authors'][j].nameAuthor)
    }
    book['authors']=authors;
    for(let j=0;j<book['categories'].length;j++){
      categories.push(book['categories'][j].nameCategory)
    }
    book['categories']=categories;
    let newAd=this.booksAll[this.booksAll.length-1]['_id']+1;
    book['_id']=newAd;
    this.booksAll.push(book);
    this.addBookToggle=false;
  }
  onShowAddnewBook(){
    this.addBookToggle=true;
  }
  onChangedT(tog:any){
    this.addBookToggle=tog;

  }


}
