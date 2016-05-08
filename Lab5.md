Labb 5, Deklarativa routes och relativ routing
==============================================
Det vi gjorde tidigare var imperativ routing, dvs vi anropar routern
i komponenten. Vi kan även utföra routingen direkt i HTML-mallen.

En annan viktig egenskap är att routern stödjer sub-routing, dvs 
att man kan skapa en egen router för en delkomponent vilken hanterar
routing lokalt inom den delkomponenten med relativa URL:er.

För att känna på det här ska vi dela in huvudvyn i två flikar
- topplistevy, här visar vi topp-3 för ölsorterna
- administration, här kan vi administrera ölsorterna (dvs samma innehåll
  vi tidigare har haft i _BeerListComponent_)

Efter det här kan vi navigera enligt följande:

Huvudvy -> Topplista
        -> Administration <--> Detalj

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

Navigering sker istället deklarativt med property-bindning till 
`routerLink`.

(Dessutom har vi en liten fudge för att fixa stöd för default-route.
Routern i Angular 2 är f.n under omarbetning och detta stöd finns ännu 
ej, men är på gång.)

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
Och så skapar vi skapar _./src/beeradmin/beeradmin.component.ts_
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

I och med att vi deklarerar `@Routes` igen, skapar _BeerAdminComponent_
en underrouter som kommer att routa relativt sin överordnade router, 
dvs den relativa URL:en kommer att läggas till URL:en som överordnad 
router ligger på. T.ex, i vårat fall kommer routen 
`http://localhost:12380/beer-admin/` matcha under-routerns 
route `/` och `http://localhost:12380/beer-admin/beer-details/3` 
matchar `/beer-details/:id`.

Detta är användbart för att bygga åternavändbara komponenter som skall 
kunna pluggas in oberoende av överordnad URL-struktur.

Fixa till _BeerListComponent_ och _BeerDetailsComponent_
--------------------------------------------------------
Sen måste vi uppdatera navigeringar i underkomponenter eftersom de nu
ligger under en annan router.

_BeerListComponent_
```typescript
:
  <a (click)="select(beer)">{{beer.name}} ({{beer.id}})</a> <a class="danger remove" (click)="remove(beer)">[ta bort]</a>

:
  select(beerToSelect) {
    this.router.navigate(['/beer-admin/beer-details', beerToSelect.id]);
  }
:
```
Observera att vi tagit bort `href="#` i `<a class="danger remove" ...`.

_BeerDetailsComponent_
```typescript
:
  close() {
    this.router.navigate(['/beer-admin']);
  }
:
```

Tuta och kör!

Vad har vi lärt oss?
--------------------
Vi lärde oss att använda deklarativ routing direkt i 
HTML-mallen med `[routerLink]`.

Vi lärde oss även att skapa en relativ under-router 
för en komponent.


