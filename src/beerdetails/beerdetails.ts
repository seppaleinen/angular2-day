import {Component, Input, Output, EventEmitter} from "@angular/core";
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
<button type="button" (click)="like()">Yep, den är smarrig!</button>
`
})
export class BeerDetailsComponent {
    @Input()
    beer: Beer;

    @Output()
    updated: EventEmitter<Beer> = new EventEmitter();

    like() {
        this.beer.points++;
        this.updated.emit(this.beer);
    }
}
