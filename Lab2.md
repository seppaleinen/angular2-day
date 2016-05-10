Lab2, en- och två-vägsdatabindning
==================================

OK, nu har vi fått igång Angular 2 och vi kan utveckla och lägga till
ändringar och allt uppdateras automagiskt.

Dags att börja borra lite djupare i Angular 2 och vi börjar då med
det grundläggande: databindning. D.v.s magin som får data att flöda
mellan våran HTML (eller snarare dess motsvarighet i det körande
systemet, DOM:en) och våra komponenter skrivna i Typescript (eller
Javascript).

Vi börjar med att dra igång våran applikation med `npm run dev-server`
så att vi kan se vad som händer när vi inför ändringar.


Uppdatera vyn från komponentklassen
-----------------------------------

I det första exemplet börjar vi med att låta en komponentklassen
dynamiskt uppdatera sin tillhörande vy.

Vi gör det genom att lägga till en räknare i våran _AppComponent_:

```typescript
@Component({
  selector: 'my-app',
  template:
`
<h1>Min Angular2-komponent</h1>
<p>Sekunder sedan sidan laddades: {{seconds}} s</p>
`
})
export class AppComponent {
  seconds: number = -1;

  constructor() {
    this.nextTimeout();
  }

  nextTimeout() {
    this.seconds++;
    setTimeout(() => this.nextTimeout(), 1000);
  }
}
```

Observera att HTML-mallen ändrades så att den kunde spänna över flera rader
genom att använda _backtick_ ( ` ) istället för _single quote_ ( ' ).

Sådär, då ska vi ha en rad `Sekunder sedan start: nnn s` i vyn.

Gamla hederliga `{{}}-interpoleringen funkar som vanligt!

Hur är det då med input?

2-vägsdatabindning
------------------

När vi ska få in data från vyn, typiskt i en input, blir det lite annorlunda
än förut.

Vi bygger vidare på våran _AppComponent_ och lägger till lite inputs.

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template:
`
<h1>Min Angular2-komponent</h1>
<p>Sekunder sedan sidan laddades: {{seconds}} s</p>

<hr>

<h2>Ölsort: {{beer}}</h2>
<dl>
  <dt>Beskrivning</dt>
  <dd>{{description}}</dd>
</dl>

<hr>

Ange ölsort: <input type="text" [(ngModel)]="beer"><br><br>
Karaktär: <input type="text" [(ngModel)]="description">
`
})
export class AppComponent {
  seconds: number = -1;

  beer: string;
  description: string;

  constructor() {
    this.nextTimeout();
  }

  nextTimeout() {
    this.seconds++;
    setTimeout(() => this.nextTimeout(), 1000);
  }
}
```

OK, vad var det där med `[(ngModel)]="beer" nu då?

Det är den nya syntaxen för 2-vägsdatabindning.

Dax för lite teori
------------------

OK, vi kanske gick lite fort fram. Låt oss ta ett steg tillbaka och kolla lite
på vad Angular-gänget har hittat på egentligen.

Rent allmänt kommer det finnas följande sätt att binda data
- från datakälla till vy med `[<a property>]`; med det kan vi sätta properties
- från vy till datakälla (events) med `(<an event>)`; med det kan vi "fånga" events
- 2-vägsdatabindning blir kombinationen av dessa, d.v.s `[()]`, logiskt eller hur?

Hmm, men vad är det här med _properties_ och _events_?

### Properties
När vi talar om _properties_ menar vi _properties_ på DOM-element, d.v.s
(den dynamiska) representationen av våran HTML i webbläsarens minne. Det är
DOM:en som manipuleras av Angular genom att bl.a element, events och properties
läggs till, tas bort och ändras under tiden applikationen exekverar.

Många DOM-properties har motsvarande HTML-attribut, t.ex "disabled" på en knapp.
Men det är inte samma sak, attributet ger ett initialvärde till motsvarande
property, men sedan ändrar vi i körtid property-värdet, inte attributet.

Angular utnyttjar även DOM-properties för att skapa "kanaler" mellan komponenter
(mer om det längre fram), därigenom utökar vi property-konceptet att även innefatta
komponent-properties och direktiv-properties.

### Events
När vi talar om _events_ är det i grunden DOM-events vi pratar om, t.ex onclick,  
men även här utökar Angular modellen att även innefatta komponent- och direktiv-
events.

Mer finns att läsa här: [Beskrivning av bindnings-syntax](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#binding-syntax)


Med detta under bältet, låt oss labba vidare, men vi backar tillbaka lite och
tar det steg för steg.

Event-bindning
--------------

Nu ska vi lägga till en knapp som man kan rensa sin öl-info med.

Vi bygger vidare på våran _AppComponent_ och lägger till en knapp i våran HTML-mall.

```typescript
:
<button type="button" (click)="clear()">Rensa</button>
:
```

Samt en metod i våran komponent-klass

```typescript
  :
  clear() {
    this.beer = undefined;
    this.description = undefined;
  }
  :
```

Här har vi bundit event-typen _click_ till våran metod _AppComponent.clear()_.

Property-bindning
-----------------
Vi vill inaktivera knappen om inget data är inmatat.

Vi bygger vidare på våran _AppComponent_ och lägger till en knapp i våran HTML-mall.

```typescript
:
<button type="button" (click)="clear()" [disabled]="isEmpty()">Rensa</button>
:
```

Samt en metod i våran komponent-klass

```typescript
  :
  isEmpty() {
      return (this.beer === undefined || this.beer.length === 0) &&
        (this.description === undefined || this.description.length === 0)
  }
  :
```

Här har vi bundit _button_-elementets property _disabled_ till våran metod
_AppComponent.isEmpty()_

Vad har vi lärt oss?
--------------------

Vi har nu gått igenom hur vi allmänt flyttar data mellan DOM och komponentklass.

Det går att skicka data från komponentklass till DOM:en vidare
- interpolering, `{{}}` och
- property-bindnigar `[]`

Vi kan även skicka events från DOM till komponentklass vidare
- event-bindningar, `()`

Och vi kan kombinera dessa 
- 2-vägsbindning, `[()]`


Cool, vi börjar få lite kläm på hur data flyter fram och tillbaka mellan våran
komponentklass och vyn.

I nästa labb tar vi en titt på hur vi kan bygga komponenthierarkier och låta
data och events flyta mellan komponenter.
