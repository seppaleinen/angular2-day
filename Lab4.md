Labb 4, Services & Routing
==========================
Nu har vi koll på hur vi kan bygga komponenter, samt sätta upp
en hierarki av kommunicerande komponenter.

I den här labben tittar vi på två saker
- Hur vi kan bryta ut egna tjänster som kan injiceras in i komponenter
- hur vi kan stödja routing mellan olika delar i applikationen med 
  routern i Angular2.

Vi bryter upp våran applikation i två vyer
- öllista; här visas öllistan och man kan lägga till och ta bort 
  ölsorter, samt redigera en ölsort.
- Istället för att visa detaljer på samma sida öppnas istället en ny
  vy när man lägger till, eller redigerar en ölsort.
  
Alla vyer skall vara djuplänkade, dvs stödja bokmärkning och 
bakåt-navigering.

Få igång routing
----------------
Innan vi börjar mecka med applikationskomponenterna ska vi få igång routern.

### Sätt base-href
Det första vi skall göra för att få routing att fungera rätt är att
lägga till följande i _./src/index.html_.
```html
:
<head>
  <base href="/">
:  
```

Detta är för att webbläsarens _pushState_-routing skall fungera. För mer
info, läs [Varför \<base href\> är viktigt](https://angular.io/docs/ts/latest/guide/router.html#!#base-href).

### Deklarera providers for Routern
Men det räcker inte, vi måste även ange _providers_ för `Router`-servicen.

Det gör vi i bootstrappen, _./src/main.ts_
```typescript
:
bootstrap(AppComponent, [ROUTER_PROVIDERS]);
:
```

Refaktorisera
-------------
OK, nu tar vi sönder våran applikation och bygger upp den från början 
med en mer produktionslik arkitektur. Vi vill inte ha våran datamodell
liggande i komponenterna, så vi definierar en egen tjänst.

### BeerService
Vi bryter ut en egen tjänst som håller våra ölsorter, _./src/beer/beer.service.ts_
```typescript
import { Injectable } from '@angular/core';
import {Beer} from "./beer";

@Injectable()
export class BeerService {
  private beers: Beer[] = [
    new Beer('Duvel','Ljus belgare som passar bra en varm sommardag.'),
    new Beer('Pripps Blå','Eh?')
  ];

  getBeers() {
    return this.beers;
  }

  addBeer(newBeer:Beer) {
    this.beers.push(newBeer);
  }

  removeBeer(beerToRemove:Beer) {
    this.beers = this.beers.filter(b=>!(b === beerToRemove));
  }

  getBeerById(id:number): Beer {
    return this.beers.find(b => b.id === id);
  }
}
```

Och flyttar in våran _./src/beerdetails/beer.ts_-klass till _./src/beer/_ 
(kom ihåg att fixa importer i beerdetails.component.ts och app.component.ts).
 
Dessutom lägger vi till ett `id`-fält på `Beer`-klassen
```typescript
:
  private static idCtr:number = 1;
  id:number = Beer.nextId();
:
  private static nextId() {
    return Beer.idCtr++;
  }
:  
```

### BeerDetailsComponent
Istället för property-bindning tar vi istället in ID för vald ölsort 
från routen och hämtar själva ölsorten från _BeerService_.
 
Vi modifierar _BeerDetailsComponent_
```typescript
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
    this.router.navigate(['/']);
  }
}
```

### BeerListComponent
Vi bryter ut listan till en egen komponent, _./src/beerlist/beerlist.component.ts
```typescript
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
```

### AppComponent
Sen gör vi en total makeover på _AppComponent_
```typescript
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
```

Här har det hänt grejer... 

Vi har importerat `Routes` och `Router` ...
Vi har konfigurerat en route för komponenten med `@Routes`-dekoratorn
Vi har lagt till ROUTER_DIRECTIVES
Vi har lagt till `<router-outlet>`
Vi har ändrat våran _anchor_.
Vi har injicerat in `Router`-servicen i våran _AppComponent_.
Vi deklararer provider för `BeerService`, vilken ärvs av alla barnkomponenter.
Vi tar bort
```html
<hr>
<my-beer-details *ngIf="selectedBeer" [beer]="selectedBeer" (updated)="beerUpdated($event)">
</my-beer-details>
```
från mallen.
Vi tar bort våran `selectedBeer`.
Vi ändrar våran `select(beer)`-metod att routa till detaljvyn (_BeerDetailsComponent_).
Vi tar bort `isSelected(beer)`-metoden.
Vi implementerar `OnInit` och `ngOnInit()`

###  Osså lite glasyr på kakan
Lägg till i _./src/styles.css_
```css
:

li:hover {
    font-size: larger;
    cursor: hand;
}
:
```


Vad har vi lärt oss?
--------------------



I


