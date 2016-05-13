import {Component} from "@angular/core";
import {Routes, Router, ROUTER_DIRECTIVES} from "@angular/router";
import {BeerDetailsComponent} from "./beerdetails/beerdetails.component"
import {BeerListComponent} from "./beerlist/beerlist.component";
import {TopListComponent} from "./toplist/toplist.component";
import {BeerAdminComponent} from "./beeradmin/beeradmin.component";
import {BeerService} from "./beer/beer.service";
import {Location} from '@angular/common';
import {OnInit} from '@angular/core';


@Component({
  selector: 'my-app',
  providers: [BeerService],
  directives: [ROUTER_DIRECTIVES],
  template: `
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

export class AppComponent implements OnInit {
  constructor(private location: Location, private router: Router){}

  ngOnInit() {
    // Fudge för att hantera att router-default ej stöds än
    if (this.location.path() === '') {
      this.router.navigate(['/top-list'])
    }
  }
}