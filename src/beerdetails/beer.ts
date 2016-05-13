export class Beer {
    name: string;
    description: string;
    points: number = 0;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }
}