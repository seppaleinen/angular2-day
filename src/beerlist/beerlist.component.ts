import {Component} from "@angular/core";
import {Router, ROUTER_DIRECTIVES} from "@angular/router";
import {BeerDetailsComponent} from "../beerdetails/beerdetails.component";
import {Beer} from "../beer/beer";
import {BeerService} from "../beer/beer.service";

@Component({
  selector: 'my-beer-list',
  directives: [BeerDetailsComponent, ROUTER_DIRECTIVES],
  template: `
<h2>Öllistan</h2>
<ol>
  <li *ngFor="let beer of beers"><span class="badge">{{beer.points}}</span>
    <a (click)="select(beer)">{{beer.name}}</a> <a class="danger" href="#" (click)="remove(beer)">[ta bort]</a>
  </li>
</ol>
<button type="button" (click)="addBeer()">Lägg till ölsort</button>
`
})
export class BeerListComponent {
  private router: Router;
  private beerService: BeerService;
  private beers: Beer[];

  constructor(router: Router, beerService: BeerService) {
    this.router = router;
    this.beerService = beerService;
    this.setBeers(beerService.getBeers());
  }

  addBeer() {
    let newBeer = new Beer('Ange namn', 'Ange beskrivning');
    this.beerService.addBeer(newBeer);
    this.select(newBeer);
  }

  remove(beerToRemove) {
    this.beerService.removeBeer(beerToRemove);
  }

  select(beerToSelect) {
    this.router.navigate(['/beer-details', beerToSelect.id]);
  }

  private setBeers(beers:Beer[]) {
    this.beers = beers.sort((b1, b2) => b2.points - b1.points);
  }
}

