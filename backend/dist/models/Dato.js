"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dato = void 0;
class Dato {
    constructor(priority, K, D, id) {
        this.priority = priority;
        this.K = K;
        this.D = D;
        this.id = id;
    }
    print() {
        return "Dato: <" + this.priority + " " + this.K + " " + this.D;
    }
}
exports.Dato = Dato;
