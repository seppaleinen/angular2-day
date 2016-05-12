export class Beer {
  private static idCtr:number = 1;
  id:number = Beer.nextId();

  name:string;
  description:string;
  points:number = 0;

  constructor(name:string, description:string) {
    this.name = name;
    this.description = description;
  }

  private static nextId() {
    return Beer.idCtr++;
  }
}