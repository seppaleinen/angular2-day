Labb 3, hantera listor och skapa hierarkiaska komponenter
=========================================================

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

Rensa upp i _AppComponent_ och ta bort gamla ölburkar...

```typescript
imort {Component} from "@angular/core";
import {Beer} from "./beerdetails/beer";

@Component({
  selector: 'my-app',
  template: `
<h2>Öllistan</h2>
<ol>
  <li *ngFor="let beer of beers"><a href="#">{{beer.name}}</a></li>
</ol>
`
})
export class AppComponent {
  beers:Beer[] = [
    new Beer('Duvel','Ljus belgare som passar bra en varm sommardag.'),
    new Beer('Pripps Blå','Eh?')
  ];

  constructor() {
  }
}
```

Här stoppade vi in ett gammalt Angular-direktiv i ny skepnad
`*ngFor="let beer in beers"`. Vad menas med den nya syntaxen?

Den första biten är "let beer in beers". Där har vi liksom i
Angular 1.x ett eget mikro-språk specifikt för _ngFor_.

Däremot är \* generellt och används som syntaktisk socker i alla 
direktiv där man definierar en mall som skall ersätta HTML-taggen där 
direktivet skall användas. 

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

Mer info finns på [Beskrivning av * och <template>](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#star-template)



