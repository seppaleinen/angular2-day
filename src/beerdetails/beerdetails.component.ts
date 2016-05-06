import {Component, Input} from "@angular/core";
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
  @Input()
  beer: Beer;
}

