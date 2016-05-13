import {Injectable} from '@angular/core';
import {Beer} from './beer';

@Injectable()
export class BeerService {
    private beers: Beer[] = [
        new Beer('Duvel','Ljus belgare som passar bra en varm sommardag.'),
        new Beer('Pripps Blå','Eh?')
    ];

    getBeers() {
        return this.beers;
    }

    addBeer(beer: Beer) {
        this.beers.push(beer);
    }

    removeBeer(beer: Beer) {
        this.beers = this.beers.filter(b=>!(b === beer));
    }

    getBeerById(id: number): Beer {
        return this.beers.find(b => b.id === id);
    }
}