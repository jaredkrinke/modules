"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Xorwow = /** @class */ (function () {
    function Xorwow(a, b, c, d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.counter = 0;
    }
    Xorwow.prototype.nextUInt32 = function () {
        var t = this.d;
        var s = this.a;
        this.d = this.c;
        this.c = this.b;
        this.b = s;
        t ^= t >>> 2;
        t ^= t << 1;
        t ^= s ^ (s << 4);
        this.a = t;
        this.counter = (this.counter + 362437) | 0;
        return (t + this.counter) >>> 0;
    };
    Xorwow.prototype.nextDouble = function () {
        return this.nextUInt32() / Xorwow.onePastUInt32Max;
    };
    Xorwow.onePastUInt32Max = Math.pow(2, 32);
    return Xorwow;
}());
exports.default = Xorwow;
