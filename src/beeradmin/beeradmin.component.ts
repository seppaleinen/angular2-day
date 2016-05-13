import {Component} from "@angular/core";
import {Routes, ROUTER_DIRECTIVES} from "@angular/router";
import {BeerListComponent} from "../beerlist/beerlist.component";
import {BeerDetailsComponent} from "../beerdetails/beerdetails.component";


@Component({
  selector: 'my-beer-admin',
  directives: [ROUTER_DIRECTIVES],
  template: `<router-outlet></router-outlet>`
})
@Routes([
  {path: '/', component: BeerListComponent},
  {path: '/beer-details/:id', component: BeerDetailsComponent},
])
export class BeerAdminComponent {
}
