import {Component} from "@angular/core";
import {PartComponent} from "./part.component";

@Component({
  selector: 'my-app',
  directives: [PartComponent],
  template: `
<h1>Min Angular2-komponent</h1>
<p>Sekunder sedan sidan laddades: {{seconds}} s</p>

<hr/>

<h2>Ölsort: {{beer}}</h2>
<dl>
    <dt>Beskrivning</dt>
    <dd>{{description}}</dd>
</dl>

<hr/>

Ange ölsort: <input type="text" [(ngModel)]="beer"><br><br>
Karaktär: <input type="text" [(ngModel)]="description"><br><br>
<button type="button" (click)="clear()" [disabled]="isEmpty()">Rensa</button>
<li *ngFor="let thing of things">{{thing}}</li>
<button type="button" (click)="addThing()">Lägg</button>

<hr/>

<part [text]="name" (size)="showSize($event)"></part>
<p>Längd={{nameSize}}</p>
`
})
export class AppComponent {
    things: string[] = ['kaka','baka'];
    seconds:number = -1;
    beer:string;
    description:string;
    nameSize: number = 0;

    constructor() {
        this.nextTimeout();
    }

    nextTimeout() {
        this.seconds++;
        setTimeout(() => this.nextTimeout(), 1000);
    }

    clear() {
        this.beer = undefined;
        this.description = undefined;
    }

    isEmpty() {
        return (this.beer === undefined || this.beer.length === 0) &&
               (this.description === undefined || this.description.length === 0)
    }

    addThing() {
        this.things.push(this.beer);
    }

    showSize(size) {
        this.nameSize = size;
    }
}