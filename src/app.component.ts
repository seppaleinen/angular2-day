import {Component} from "@angular/core";
import {Routes, Router, ROUTER_DIRECTIVES} from "@angular/router";
import {BeerDetailsComponent} from "./beerdetails/beerdetails.component"
import {BeerListComponent} from "./beerlist/beerlist.component";
import {BeerService} from "./beer/beer.service";

@Component({
  selector: 'my-app',
  providers: [BeerService],
  directives: [ROUTER_DIRECTIVES],
  template: `<router-outlet></router-outlet>`
})
@Routes([
  {path: '/', component: BeerListComponent},
  {path: 'beer-details/:id', component: BeerDetailsComponent},
])
export class AppComponent {

  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }

}