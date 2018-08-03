import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  toggleCategories='';
  displayChanges(changes) {
      this.toggleCategories=changes;
  }

}
