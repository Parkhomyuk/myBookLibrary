export class Book {
  public _id :number;
  public title :string;
  public isbn :number= null;
  public pageCount :number;
  public publishedDate :  Date;
  public thumbnailUrl : string;
  public shortDescription : string;
  public longDescription : string;
  public status : string;
  public authors :any;
  public categories :any;
  constructor(id: number=null, title: string='', isbn: number=null, pageCount: number=null,publishedDate :  Date=new Date() ,
              thumbnailUrl: string='', shortDescription : string='', longDescription : string='', status : string='', authors :any=[], categories :any=[] ) {

    this._id = id;
    this.title = title;
    this.isbn = isbn;
    this.pageCount = pageCount;
    this.publishedDate = publishedDate;
    this.thumbnailUrl = thumbnailUrl;
    this.shortDescription = shortDescription;
    this.longDescription = longDescription;
    this.status = status;
    this.authors = authors;
    this.categories = categories;
  }
}
