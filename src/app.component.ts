import {Component} from "@angular/core";
import {Beer} from "./beerdetails/beer";
import {BeerDetailsComponent} from "./beerdetails/beerdetails.component"

@Component({
  selector: 'my-app',
  directives: [BeerDetailsComponent],
  template: `
<h2>Öllistan</h2>
<ol>
  <li *ngFor="let beer of beers" [class.selected]="isSelected(beer)">
    <a href="#" (click)="select(beer)">{{beer.name}}</a> <a class="danger" href="#" (click)="remove(beer)">[ta bort]</a>
  </li>
</ol>
<button type="button" (click)="addBeer()">Lägg till ölsort</button>

<hr>

<my-beer-details *ngIf="selectedBeer" [beer]="selectedBeer"></my-beer-details>
`
})
export class AppComponent {
  beers:Beer[] = [
    new Beer('Duvel','Ljus belgare som passar bra en varm sommardag.'),
    new Beer('Pripps Blå','Eh?')
  ];

  selectedBeer: Beer;

  constructor() {
  }

  addBeer() {
    var newBeer = new Beer('Ange namn', 'Ange beskrivning');
    this.beers.push(newBeer);
    this.selectedBeer = newBeer;
  }

  remove(beerToRemove) {
    this.beers = this.beers.filter(b=>!(b === beerToRemove));
  }

  select(beerToSelect) {
    this.selectedBeer = beerToSelect;
  }

  isSelected(beer) {
    return beer === this.selectedBeer;
  }
}