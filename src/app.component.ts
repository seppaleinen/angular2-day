import {Component} from "@angular/core";
import {Routes, ROUTER_DIRECTIVES} from "@angular/router";
import {BeerService} from "./beer/beer.service";
import {BeerAdminComponent} from "./beeradmin/beeradmin.component";
import {TopListComponent} from "./toplist/toplist.component";

@Component({
  selector: 'my-app',
  providers: [BeerService],
  directives: [ROUTER_DIRECTIVES],
  template:
`
<nav>
  <a [routerLink]="['/top-list']">Topplista</a>
  <a [routerLink]="['/beer-admin']">Administration</a>
</nav>
<hr>
<router-outlet></router-outlet>
`
})
@Routes([
  {path: '/top-list', component: TopListComponent},
  {path: '/beer-admin', component: BeerAdminComponent},
])
export class AppComponent {
}