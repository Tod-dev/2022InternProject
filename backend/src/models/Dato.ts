export class Dato{
  priority: number;
  K: number;
  D: string;
  id: any;
 
  constructor(priority: number, K:number, D: string,id?:number) {
    this.priority = priority;
    this.K = K;
    this.D = D;
    this.id = id;
  }
 
  print() {
    return "Dato: <"+this.priority+" "+this.K+" "+this.D;
  }
}
 