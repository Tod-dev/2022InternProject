"use strict";
const fs = require("fs");
/*
Dovrà essere realizzato uno script di utility che, quando lanciato, generi un file random (con 1 <= N
<= 50 e 0 <= A < B <= N ) che segua la struttura del file riportato in precedenza.
*/
function generateRandomText() {
    const length = Math.floor(Math.random() * 100);
    let result = "";
    const characters = "ABCDEF GHIJK LMNOP QRS TUVWX YZab cd efghij klmn opqr stuvwxyz ";
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
const N = Math.floor(Math.random() * 50) + 1; //[1,50]
const A = Math.floor(Math.random() * N); //[0,N-1]
const B = Math.floor(Math.random() * (N - A)) + (A + 1); //[(A+1),N]
console.log("N:" + N + ", A:" + A + " ,B:" + B);
const path = "./tests/generatedFromScriptUtility.txt";
let content = "";
content += A.toString() + " " + B.toString() + "\n";
for (let i = 1; i <= N; i++) {
    const p = Math.floor(Math.random() * 5) + 1; //[1,5]
    const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    const k = Math.floor(Math.random() * 1000) * plusOrMinus; //[1,5]
    content +=
        p.toString() + " " + k.toString() + " " + generateRandomText() + "\n";
}
console.log(`content:\n${content}`);
fs.writeFileSync(path, content, (err) => {
    if (err) {
        console.error(err);
    }
});
