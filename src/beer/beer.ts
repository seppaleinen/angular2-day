export class Beer {
    name: string;
    description: string;
    points: number = 0;
    private static idCtr: number = 1;
    id: number = Beer.nextId();

    constructor(name:string, description:string) {
        this.name = name;
        this.description = description;
    }

    private static nextId() {
        return Beer.idCtr++;
    }
}