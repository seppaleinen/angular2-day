import {Component} from "@angular/core";
import {Beer} from "./beerdetails/beer";

@Component({
  selector: 'my-app',
  template: `
<h2>Öllistan</h2>
<ol>
  <li *ngFor="let beer of beers"><a href="#">{{beer.name}}</a></li>
</ol>
`
})
export class AppComponent {
  beers:Beer[] = [
    new Beer('Duvel','Ljus belgare som passar bra en varm sommardag.'),
    new Beer('Pripps Blå','Eh?')
  ];

  constructor() {
  }
}