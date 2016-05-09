Labb 3: Hantera listor och skapa hierarkiska komponenter
========================================================

Hittills har vi implementerat allt i våran `AppComponent`. 

Det kan vi såklart inte fortsätta med. Vi villl bryta upp applikationen
i komponenter med hög kohesion och låg koppling enligt gamla beprövade
principer. Dessutom bör vi alltid sträva efter att komponenterna skall
vara återanvändbara.

Om vi nu utökar vår lilla applikation till att hålla en lista med 
ölsorter samt möjlighet att kunna lägga till nya ölsorter. 
 
Desutom skall man kunna markera en ölsort i listan och uppdatera den.

Refaktorisera
-------------

Vi börjar med att refaktorisera `AppComponent`. 

Bryt ut en egen klass som vi lägger i `./src/beerdetails/beer.ts` 
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

Rensa upp i `AppComponent` och ta bort gamla ölburkar, men lägg till
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
    <a href="#">{{beer.name}}</a> 
    <a class="danger" href="#" (click)="remove(beer)">[ta bort]</a>
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
I komponentklassen har vi rensat bort Lab1-detaljer och lagt till 
en lista med ölsorter, `beers`, samt metoder för att ta bort och lägga
till ölsorter.

I HTML-mallen har vi nu en knapp för att lägga till ölsort till 
listan `beers`.

Vi stoppade även in ett gammalt Angular-direktiv i ny skepnad
`*ngFor="let beer in beers"`. Den känner vi igen som direktivet som 
används för att repetera element baserat på en underliggande lista.

Vi repeterar över `beers` och lägger upp en rad med två `<a>`-element.
Den ena för att visa ölsort som länk (ej bunden till action än), 
den andra för att ta bort ölsort, bunden till `AppComponent.remove(beerToRemove)`.
 
Men vad menas med den nya syntaxen?

Den första biten är "let beer in beers". Där har vi liksom i
Angular 1.x ett eget mikro-språk specifikt för `ngFor`.

Däremot är `*` generellt och används som syntaktisk socker i alla 
direktiv där man definierar en mall som skall ersätta HTML-taggen där 
direktivet skall användas. 

Ett klumpigare sätt att uttrycka samma sak med vanlig property-bindning
och Angulars template-direktiv visas enklast genom att expandera Angulars
`ngIf`-direktiv (jepp, samma funktion som ng-if i Angular 1.x) är:
```html
<p *ngIf="true">Banan</p>
```

Med `template`-direktivet:
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
komponent i `./src/beerdetails/beerdetails.component.ts`:

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

Samt ändra `AppComponent`:
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
  selectedBeer: Beer = beers[0];
:
```

Notera att vi måste deklarera att vi använder komponenten `my-beer-details` med 
`directives: [BeerDetailsComponent]`. 

Vi använder direktivet `ngIf` för att styra huruvida detaljerna skall 
visas eller ej.

OK, det funkar, men nu ska vi ta bort de hårdkodade värdena.

Parametrisera komponent med @Input och property-bindning
--------------------------------------------------------

Först ser vi till att man kan välja vad som skall visas i `AppComponent`:
```typescript
:
    <a href="#" (click)="select(beer)">{{beer.name}}</a> 
    <a class="danger" href="#" (click)="remove(beer)">[ta bort]</a>
:
  selectedBeer: Beer;
:
  select(beerToSelect) {
    this.selectedBeer = beerToSelect;
  }
:
```

Sedan måste vi få in information om vilken ölsort som valts till 
`BeerDetailsComponent`. I Angular 2 gör man det genom att först deklarera
att fältet `BeerDetailsComponent.beer` är ett property som kan ta emot 
data via property-bindning. Detta gör man genom att annotera 
`beer`-fältet med `@Input()` (OBS, paranteserna är viktiga!):
 
```typescript
export class BeerDetailsComponent {
  @Input()
  beer: Beer;
}
```

Nu kan vi lägga på property-bindningen i HTML-elementet där komponenten 
används i HTML-mallen för `AppComponent` och på det sättet binda ihop
`AppComponent.selectedBeer` med `BeerDetailsComponent.beer`:
```typescript
:
<my-beer-details *ngIf="selectedBeer" [beer]="selectedBeer"></my-beer-details>
:
```

Och nu öppnas detaljvyn när man klickar på en ölsort i listan.

Nu ska vi få komponenten att ge ifrån sig lite events oxå.

Komponentspecifika events
-------------------------
Nu ska vi lägga till en gilla-knapp i `BeerDetailsComponent`. När man gillar en ölsort så 
inkrementeras en poängräknare och dessutom skickas ett event till eventuella lyssnare.

Vi sätter upp `AppComponent` att lyssna på dessa events och sortera om öllistan när 
de kommer.

Vi börjar med att lägga till poäng i `./src/beerdetails/beer.ts`:
```typescript
:
points:number
:
```

Sedan lägger vi till gilla-knapp och event-emitter i `./src/beerdetails/beerdetails.component.ts`:
```typescript
import {Component, Input, EventEmitter} from "@angular/core";
:
<button type="button" (click)="like()">Yep, den är smarrig!</button>
:
  @Output()
  updated: EventEmitter<Beer> = new EventEmitter();
  
  like() {
    this.beer.points++;
    this.updated.emit(beer);
  }
:
```

Här används dekoratorn `@Output()` för att markera att ett fält är en output-property man
kan binda emot. Denna är implementerad med `EventEmitter` vilken används för att skicka
events. Fältnamnet (i detta fall `updated`) blir det event man kan binda emot.

I våran `like()`-metod anropar vi `EventEmitter.emit()`för att skicka eventet.

Till sist sätter vi upp en event-bindning i `AppComponent` så att vi kan lyssna på
_update_-events.
```typescript
:
<li *ngFor="let beer of beers"><span class="badge">{{beer.points}}</span>
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
property-bindning för _class_ (inbyggd property-bindning motsvarande 
ng-class i Angular 1.x, CSS-klassen `selected` aktiveras om uttrycket 
är sant).

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

