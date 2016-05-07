import {Component} from "@angular/core";
import { OnActivate, Router, RouteSegment, RouteTree} from '@angular/router';
import {Beer} from "../beer/beer";
import {BeerService} from "../beer/beer.service";

@Component({
  selector: 'my-beer-details',
  template: `
<h2>Ölsort: {{beer.name}}</h2>
<p>ID: {{beer.id}}</p>
<p>Poäng: <span class="badge">{{beer.points}}</span></p>
<dl>
  <dt>Beskrivning</dt>
  <dd>{{beer.description}}</dd>
</dl>

<hr>
Ange ölsort: <input type="text" [(ngModel)]="beer.name"><br><br>
Karaktär: <input type="text" [(ngModel)]="beer.description"><br><br>
<button type="button" (click)="like()">Yep, den är smarrig!</button>
<hr>
<button type="button" (click)="close()">Stäng</button>
`
})
export class BeerDetailsComponent implements OnActivate {
  beer: Beer;

  constructor(private router: Router, private beerService:BeerService) {
  }

  routerOnActivate(curr:RouteSegment, prev?:RouteSegment, currTree?:RouteTree, prevTree?:RouteTree) {
    let id = +curr.getParam('id'); // Se till att det blir ett number
    this.beer = this.beerService.getBeerById(id);
  }

  like() {
    this.beer.points++;
  }

  close() {
    this.router.navigate(['/beer-admin']);
  }
}

