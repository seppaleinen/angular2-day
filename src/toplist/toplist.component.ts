import {Component} from "@angular/core";
import {BeerService} from "../beer/beer.service";
import {Beer} from "../beer/beer";


@Component({
  selector: 'my-home',
  template:
    `
<ol>
  <div *ngFor="let beer of topBeers()">
    <span class="badge">{{beer.points}}</span> {{beer.name}}  
  </div>
</ol>
`
})
export class TopListComponent {
  constructor(private beerService:BeerService) {}

  topBeers():Beer[] {
    return this.beerService.getBeers()
      .sort((b1,b2) => b2.points - b1.points)
      .slice(0, 3);
  }
}