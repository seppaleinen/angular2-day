
<h2>Ölsort: {{beer}}</h2>
<dl>
  <dt>Beskrivning</dt>
<dd>{{description}}</dd>
</dl>

<hr>

  Ange ölsort: <input type="text" [(ngModel)]="beer"><br><br>
    Karaktär: <input type="text" [(ngModel)]="description"><br><br>
  <button type="button" (click)="clear()" [disabled]="isEmpty()">Rensa</button>