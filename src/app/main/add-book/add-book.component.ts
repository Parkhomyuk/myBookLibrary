import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import {Subscription} from "rxjs";
import {FormGroup, FormControl,FormArray, Validators} from "@angular/forms";
import {Book} from "../../model/book";
import {DataService} from "../../data-service";
import {OnChanges,SimpleChanges} from "@angular/core";

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.sass']
})
export class AddBookComponent implements OnInit, OnChanges {

    @Output() toggle:boolean=false;
    currentBook:Book;
    bookForm: FormGroup;


  @Output() onNewBook = new EventEmitter<Book>();
  @Output() onChangedToggle = new EventEmitter<boolean>();
  @Input() prop:any;
  ngOnChanges(changes:SimpleChanges):void {

    //noinspection TypeScriptUnresolvedVariable
    if(changes.prop.currentValue=='open'){
      this.toggle=true;
    }else{
      this.toggle=false;
    }

  }
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.initForm();
  }
  onCloseToggle(){
    this.toggle=false;
    this.onChangedToggle.emit(false);
    this.initForm();
  }
  private initForm(){
    let title='';

    let isbn=null;
    let pageCount=null;
    let status=null;
    let thumbnailUrl=null;
    let longDescription=null;
    let publishedDate=null;
    let bookAuthors= new FormArray([]);
    let bookCategories= new FormArray([]);

    //noinspection TypeScriptValidateTypes
    this.bookForm= new FormGroup({
      'title': new FormControl(title,[Validators.required, Validators.pattern(/^[A-Z]/)] ),

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
    console.log(this.bookForm.value);
     this.currentBook=this.bookForm.value;
    this.onNewBook.emit(this.currentBook);
    this.onCloseToggle();
    this.initForm();
    return this.currentBook;
  }

}
