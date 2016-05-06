import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template:
`
<h1>Min Angular2-komponent</h1>
<p>Sekunder sedan sidan laddades: {{seconds}} s</p>

<hr>

<h2>{{beer}}</h2>
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