"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector2 = exports.Vector1 = void 0;
// defined for use with GSAP which seems
// to dislike primitives as arguments
class Vector1 {
    constructor(x) {
        this.x = x;
    }
    equals(v) {
        return this.x === v.x;
    }
}
exports.Vector1 = Vector1;
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    equals(v) {
        return this.x === v.x && this.y === v.y;
    }
}
exports.Vector2 = Vector2;
