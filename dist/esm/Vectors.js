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
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    equals(v) {
        return this.x === v.x && this.y === v.y;
    }
}
export { Vector1, Vector2 };
//# sourceMappingURL=Vectors.js.map