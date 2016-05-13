import {Component, Input, EventEmitter, Output} from "@angular/core";

@Component({
    selector: 'part',
    template: `
        <h4>Text @Input: {{text}}</h4>
        <button type="button" (click)="calc()">Beräkna längd</button>
    `
})

export class PartComponent {
    @Input()
    text: string;

    @Output()
    size: EventEmitter<number> = new EventEmitter();

    calc() {
        this.size.emit(text.length);
    }
}