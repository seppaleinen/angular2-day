Labb 5, Deklarativa routes och relativ routing
==============================================
Det vi gjorde tidigare var imperativ routing, dvs vi anropar routern
i komponenten. Vi kan även utföra routingen direkt i HTML-mallen.

En annan viktig egenskap är att routern stödjer sub-routing, dvs 
att man kan skapa en egen router för en delkomponent vilken hanterar
routing inom lokalt.

För att känna på det här ska vi dela in huvudvyn i två flikar
- topplistevy, här visar vi topp-3
- administration, här kan vi administrera ölsorterna (dvs samma innehåll
  vi tidigare har haft i _AppComponent_)

AppComponent
------------
Vi stuvar om i _AppComponent_ igen:
```typescript
:
import {Location} from '@angular/common';
:
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
export class AppComponent implements OnInit {
  constructor(private location: Location, private router: Router){}

  ngOnInit() {
    // Fudge för att hantera att router-default ej stöds än
    if (this.location.path() === '') {
      this.router.navigate(['/top-list'])
    }
  }
}
:
```

Nu har vi bara en navigeringsrad som  leder till två subkomponenter.

TopListComponent
----------------
Vi lägger till topplistekomponenten, _./src/toplist/toplist.component.ts_
```typescript
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
```

BeerAdminComponent
------------------
Och skapar _./src/beeradmin/beeradmin.component.ts_
```typescript
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
```

Beeradmin skapar en underrouter som kommer att routa relativt sin 
överordnade router, dvs lägga till ...

Fixa till _BeerListComponent_ och _BeerDetailsComponent_
--------------------------------------------------------
Sen måste vi uppdatera navigeringar i underkomponenter eftersom de nu
ligger under en annan router.

_BeerListComponent_
```typescript
:
    <a (click)="select(beer)">{{beer.name}}</a> <a class="danger remove" (click)="remove(beer)">[ta bort]</a>
:
  select(beerToSelect) {
    this.router.navigate(['/beer-admin/beer-details', beerToSelect.id]);
  }
:
```

_BeerDetailsComponent_
```typescript
:
  close() {
    this.router.navigate(['/beer-admin']);
  }
:
```

Sen lite styling på det:
```css
:
a.remove:hover {
    background-color: red;
    color: white;
    cursor: hand;
}

a.badge:hover {
    cursor: hand;
}

a.badge:active {
    background-color: #ff0430;
}

nav a {
    padding: 5px 10px;
    text-decoration: none;
    margin-top: 10px;
    display: inline-block;
    background-color: #7f7f7f;
}
nav a:visited, a:link {
    color: #2c2c2c;
}
nav a:hover {
    color: #101010;
    background-color: #CFD8DC;
}
nav a.router-link-active {
    color: #101010;
    background-color: #c4c4c4;
}
:
```

Tja, nu ser det väl rätt OK ut?


Vad har vi lärt oss?
--------------------



I


