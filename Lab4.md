Labb 4, Services & Routing
==========================
Nu har vi koll på hur vi kan bygga komponenter, samt sätta upp
en hierarki av kommunicerande komponenter.

I den här labben tittar vi på två saker
- Hur vi kan bryta ut egna tjänster som kan injiceras in i 
  komponenter.
- hur vi kan stödja routing mellan olika delar i applikationen 
  med routern i Angular2, vilken stödjer navigering mellan 
  olika vy-komponenter.

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
När vi bygger tjänster så behöver vi inte göra något annat än 
att annotera med `@Injectable()`så att metadata genereras
för Angular.

Vi gör en fultjänst som inte på ett enkelt sätt kan 
refaktoriseras till en riktig back-end-tjänst. För det
skulle vi behöva promises och annat koncept med sparning
när vi ändrar i ölsorterna. Men vi komplicerar inte 
applikationen med de aspekterna i de här labbarna.

### Beer
Vi flyttar dessutom in våran _./src/beerdetails/beer.ts_-klass 
till _./src/beer/_-katalogen (kom ihåg att fixa importer i 
`beerdetails.component.ts` och `app.component.ts`).
 
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

### BeerListComponent
Vi bryter ut listan till en egen komponent, _./src/beerlist/beerlist.component.ts_
```typescript
import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {BeerDetailsComponent} from "../beerdetails/beerdetails.component";
import {Beer} from "../beer/beer";
import {BeerService} from "../beer/beer.service";

@Component({
  selector: 'my-beer-list',
  directives: [BeerDetailsComponent],
  template: `
<h2>Öllistan</h2>
<ul>
  <div *ngFor="let beer of getBeers()"><span class="badge">{{beer.points}}</span>
    <a (click)="select(beer)">{{beer.name}} ({{beer.id}})</a> <a class="danger remove" href="#" (click)="remove(beer)">[ta bort]</a>
  </div>
</ul>
<button type="button" (click)="addBeer()">Lägg till ölsort</button>
`
})
export class BeerListComponent {
  private router: Router;
  private beerService: BeerService;

  constructor(router: Router, beerService: BeerService) {
    this.router = router;
    this.beerService = beerService;
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

  getBeers() {
    return this.beerService.getBeers().sort((b1, b2) => b2.points - b1.points);
  }
}
```

Öllistan ligger nu i en egen komponent och använder routern 
för att öppna detaljvyn. 

För att få tillgång till routern importerar vi den injicerar 
vi den i konstruktorn.

Vi injicerar även _BeerService_ i konstruktorn.

Vi har ändrat på våran `select()`-metod, så att den nu
använder routern för att navigera till detaljvyn.

Övriga metoder använder _BeerService_ för att komma åt
ölsorterna.

### BeerDetailsComponent
Vi refaktoriserar våran _BeerDetailsComponent_ och ersätter 
property-bindning med att istället få _ID_ för vald ölsort 
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
Återigen, vi injicerar _Router_ och _BeerService_.

Dessutom implementerar vi gränssnittet _OnActivate_ 
vilken definierar en metod, `routerOnActivate(...)`.
Denna metod körs när våran komponent aktiveras som
följd av att man navigerat till den. I den plockar
vi ut _ID_ och hämtar specifik ölsort från
_BeerService_.

### AppComponent
Till sist gör vi en total makeover på _AppComponent_.

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
  {path: '/beer-details/:id', component: BeerDetailsComponent},
])
export class AppComponent {
  constructor(private router: Router) {
  }
}
```

Här har det hänt grejer... 

All ölliste-hantering har försvunnit.
Istället har vi en mager HTML-mall, som bara innehåller:
```html
<router-outlet></router-outlet>
```
Det är här routern kommer att lägga in den komponent 
men navigerar till. För att det skall fungera
måste vi lägga till `directives: [ROUTER_DIRECTIVES]`.

Vi deklararer `provider` för _BeerService_, vilket gör 
att Angular förstår hur _BeerService_ skapas vid 
injicering i konstruktorer. 
En mycket viktig detalj är att vi endast deklarerar den
på toppkomponenten. Samma tjänsteinstans ärvs sedan ner
till alla barnkomponenter. 
Notera att vi __INTE__ ska deklararera `providers` i 
barnkomponenter eftersom det skulle medför att nya 
tjänsteinstanser skulle skapas för dem.

Vi har konfigurerat routes med `@Routes`-dekoratorn:
- när man navigerar till `http://localhost:12380/`kommer 
  man till öllistan
- när man navigerar till `http://localhost:12380/beer-details/3`
  kommer man till detaljvyn för ölsorten med ID=3

Vi har injicerat in `Router`-servicen i våran _AppComponent_, 
men med lite alternativ syntax, fältet router skapas 
automatiskt i och med att det är ett konstruktor-argument.


Vad har vi lärt oss?
--------------------
Vi refaktoriserade hela applikationen och bröt ut en 
datalagret till en egen tjänst. För det använde vi
- `@Inject()`
- `providers`, men bara på topp-komponenten

Vi använde routern i Angular 2. För det behövdes
- `<router-outlet></router-outlet>` på det ställe där
  man vill att routern skall lägga in den komponent man
  routar till.
- Vi använde _Router_-tjänsten för att navigera.

Mer finns att läsa i 
- [Routing](https://angular.io/docs/ts/latest/guide/router.html)
- [Beroendeinjicering](https://angular.io/docs/ts/latest/guide/dependency-injection.html)


