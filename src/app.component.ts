import {Component} from "@angular/core";

@Component({
    selector:'my-app',
    template:`
        <h1>Min angular2 App</h1>
    `
})

export class AppComponent {
    constructor() {
        console.log("LoggyLog!");
    }
}