"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatoProcessato = void 0;
class DatoProcessato {
    constructor(priority, K, D, dataora) {
        this.priority = priority;
        this.K = K;
        this.D = D;
        this.dataora = dataora;
    }
    print() {
        return "DatoProcessato: <" + this.priority + " " + this.K + " " + this.D;
    }
}
exports.DatoProcessato = DatoProcessato;
