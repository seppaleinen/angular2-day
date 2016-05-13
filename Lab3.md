Labb 3, hantera listor och skapa hierarkiska komponenter
========================================================

Hittills har vi implementerat allt i våran _AppComponent_. 

Det kan vi såklart inte fortsätta med. Vi villl bryta upp applikationen
i komponenter med hög kohesion och låg koppling enligt gamla beprövade
principer. Dessutom bör vi alltid sträva efter att komponenterna skall
vara återanvändbara.

Om vi nu utökar vår lilla applikation till att hålla en lista med 
ölsorter samt möjlighet att kunna lägga till nya ölsorter. 
 
Desutom skall man kunna markera en ölsort i listan och uppdatera den.

Refaktorisera
-------------

Vi börjar med att refaktorisera _AppComponent_. 

Bryt ut en egen klass som vi lägger i _./src/beerdetails/beer.ts_ 
för att hålla information om ölsört

```typescript
export class Beer {
  name:string;
  description:string;

  constructor(name:string, description:string) {
    this.name = name;
    this.description = description;
  }
}
```

Rensa upp i _AppComponent_ och ta bort gamla ölburkar, men lägg till
lite nytt...

```typescript
import {Component} from "@angular/core";
import {Beer} from "./beerdetails/beer";

@Component({
  selector: 'my-app',
  template: `
<h2>Öllistan</h2>
<ol>
  <li *ngFor="let beer of beers">
    <a href="#">{{beer.name}}</a> <a class="danger" href="#" (click)="remove(beer)">[ta bort]</a>
  </li>
</ol>
<button type="button" (click)="addBeer()">Lägg till ölsort</button>
`
})
export class AppComponent {
  beers:Beer[] = [
    new Beer('Duvel','Ljus belgare som passar bra en varm sommardag.'),
    new Beer('Pripps Blå','Eh?')
  ];

  constructor() {
  }

  addBeer() {
    this.beers.push(new Beer('Ange namn', 'Ange beskrivning'));
  }

  remove(beerToRemove) {
    this.beers = this.beers.filter(b=>!(b === beerToRemove));
  }
}
```

Vi har lagt till en knapp för att lägga till ölsort till listan _beers_.

Vi stoppade även in ett gammalt Angular-direktiv i ny skepnad
`*ngFor="let beer in beers"`. Den känner vi igen som direktivet som 
används för att repetera element baserat på en underliggande lista.
 
Men vad menas med den nya syntaxen?

Den första biten är "let beer in beers". Där har vi liksom i
Angular 1.x ett eget mikro-språk specifikt för _ngFor_.

Däremot är `*` generellt och används som syntaktisk socker i alla 
direktiv där direktivet tar en mall och gör något med den. 

Ett klumpigare sätt att uttrycka samma sak med vanlig property-bindning
och Angulars template-direktiv visas enklast genom att expandera Angulars
ngIf-direktiv (jepp, samma funktion som ng-if) är:
```html
<p *ngIf="true">Banan</p>
```

Med _template_-direktivet:
```html
<p template="ngIf:true">Banan</p>
```

Vilket i sin tur kan expanderas till property-bindningsform
```html
<template [ngIf]="true">
  <p>Banan</p>
</template>
```

Mer info finns på [Beskrivning av \* och \<template\>](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#star-template)

OK, vi kör vidare och skapar en komponent för öldetaljer.

Öldetaljer
----------
Nu ska vi skapa en komponent där man kan redigera detaljer om en ölsort.

Vi tar delar från det vi implementerade i Labb 2 och skapar följande
komponent:

```typescript
import {Component} from "@angular/core";
import {Beer} from "./beer";

@Component({
  selector: 'my-beer-details',
  template: `
<h2>Ölsort: {{beer.name}}</h2>
<dl>
  <dt>Beskrivning</dt>
  <dd>{{beer.description}}</dd>
</dl>

<hr>
Ange ölsort: <input type="text" [(ngModel)]="beer.name"><br><br>
Karaktär: <input type="text" [(ngModel)]="beer.description"><br><br>
`
})
export class BeerDetailsComponent {
  beer: Beer = new Beer('Gull','Isländsk blask');
}

```

Samt ändra _AppComponent_:
```typescript
:
import {BeerDetailsComponent} from "./beerdetails/beerdetails.component"
:
  directives: [BeerDetailsComponent],
:
<button type="button" (click)="addBeer()">Lägg till ölsort</button>

<hr>

<my-beer-details *ngIf="selectedBeer"></my-beer-details>
:
```

Vi måste deklarera att vi använder komponenten `my-beer-details` med 
`directives: [BeerDetailsComponent]`
Vi använder direktivet _ngIf_ för att styra om detaljerna skall visas.

OK, det funkar, men nu ska vi ta bort de hårdkodade värdena.

Parametrisera komponent med @Input och property-bindning
--------------------------------------------------------

Först ser vi till att man kan välja vad som skall visas i _AppComponent_:
```typescript
:
    <a href="#" (click)="select(beer)">{{beer.name}}</a> <a class="danger" href="#" (click)="remove(beer)">[ta bort]</a>
:
  selectedBeer: Beer;
:
  select(beerToSelect) {
    this.selectedBeer = beerToSelect;
  }
:
```

Sedan måste vi få in information om vilken ölsort som valts till 
_BeerDetailsComponent_. I Angular 2 gör man det genom att först deklarera
att fältet _BeerDetailsComponent.beer_ är ett property som kan ta emot 
data via property-bindning. Detta gör man genom att annotera 
_beer_-fältet med \@Input:
 
```typescript
export class BeerDetailsComponent {
  @Input()
  beer: Beer;
}
```

Nu kan vi lägga på property-bindningen i HTML-elementet där komponenten 
används i HTML-mallen för _AppComponent_ och på det sättet binda ihop
_AppComponent.selectedBeer_ med _BeerDetailsComponent.beer_:
```typescript
:
<my-beer-details *ngIf="selectedBeer" [beer]="selectedBeer"></my-beer-details>
:
```

Och _BAM!_ nu öppnas detaljvyn när man klickar på en ölsort i listan.

Nu, ska vi få komponenten att ge ifrån sig lite events oxå.

Komponentspecifika events
-------------------------
Nu ska lägga till en gilla-knapp i _BeerDetailsComponent_. När man gillar en ölsort så 
inkrementeras en poängräknare och dessutom skickas ett event till eventuella lyssnare.

Vi sätter upp _AppComponent_ att lyssna på dessa events och sortera om öllistan när 
de kommer.

Vi börjar med att lägga till poäng i _./src/beerdetails/beer.ts_:
```typescript
:
points:number
:
```

Sedan lägger vi till gilla-knapp och event-emitter i _./src/beerdetails/beerdetails.component.ts_:
```typescript
import {Component, Input, Output, EventEmitter} from "@angular/core";
:
<button type="button" (click)="like()">Yep, den är smarrig!</button>
:
  @Output()
  updated: EventEmitter<Beer> = new EventEmitter();
  
  like() {
    this.beer.points++;
    this.updated.emit(this.beer);
  }
:
```

Här används dekoratorn `@Output` för att markera att ett fält är en output-property man
kan binda emot. Denna är implementerad med `ÈventEmitter` vilken används för att skicka
events. Fältnamnet blir det event man kan binda emot.

I våran `like()`-metod anropar vi `EventEmitter.emit()`för att skicka eventet.

Till sist sätter vi upp en event-bindning i _AppComponent_ så att vi kan lyssna på
_update_-events.
```typescript
:
<li *ngFor="let beer of beers" [class.selected]="isSelected(beer)"><span class="badge">{{beer.points}}</span>
:
<my-beer-details *ngIf="selectedBeer" [beer]="selectedBeer" (update)="beerUpdated($event)"></my-beer-details>
:
beerUpdated(event) {
  this.beers = this.beers.sort((b1, b2) => b2.points - b1.points);
}
:
```

Slutlig finputs
---------------

Till sist putsar vi till applikationen och fixar så att detaljvyn öppnas 
automatiskt när vi lägger till en ny ölsort:
```typescript
:
export class AppComponent {
:
  addBeer() {
    var newBeer = new Beer('Ange namn', 'Ange beskrivning');
    this.beers.push(newBeer);
    this.selectedBeer = newBeer; 
  }
:
```

Och så fixar vi styling så att vald ölsort markeras i listan med 
property-bindning för _class_.

Sen uppdaterar vi _AppComponent_:
```typescript
:
  <li *ngFor="let beer of beers" [class.selected]="isSelected(beer)">
:
  isSelected(beer) {
    return beer === this.selectedBeer;
  }
```


Vad har vi lärt oss?
--------------------

I den här labben lärde vi oss två gamla kända direktiv i ny form

- ngFor, för att repetera element över en lista
- ngIf för att styra huruvida ett element skall visas eller ej

Vi refaktorerade applikationen och skapade en separat komponent
för öldetaljer, vilken tar emot inparametrar via property-binding
och `@Input` samt ger ifrån sig events med `@Output` och `EventEmitter`.

