import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
@Injectable()
export class DataService{

  configUrl = 'assets/data.json';
  booksChanges = new Subject<any>();
  constructor(private http: HttpClient) { }
  getData(){
    return this.http.get(this.configUrl)
  }


}
