import { Component } from '@angular/core';
import { HttpModule } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@NgModule({
    imports: [ HttpModule ]
})

export class AppComponent {
  title = 'app';
}
