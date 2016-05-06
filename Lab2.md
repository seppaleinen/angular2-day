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


Uppdatera vyn från controllern
------------------------------

I det första exemplet börjar vi med att låta en komponents controller
dynamiskt uppdatera sin tillhörande vy.

Vi gör det genom att lägga till en räknare i våran _AppComponent_:


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

Observera att HTML-mallen ändrades så att den kunde spänna över flera rader 
genom att använda backticks ( ` ).

Sådär, då ska vi ha en rad

    _Sekunder sedan start: nnn s_
    
i vyn.

Gamla hederliga {{}} funkar som vanligt!

Hur är det då med input?

2-vägsdatabindning
------------------

När vi ska få in data från vyn, typiskt i en input, blir det lite annorlunda
än förut.

Vi bygger vidare på våran _AppComponent_ och ändrar våran komponent

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
    
OK, vad var det där med [(ngModel)]="beer" nu då?  
