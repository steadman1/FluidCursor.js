// defined for use with GSAP which seems
// to dislike primitives as arguments
class Vector1 {
  x: number;
  
  constructor(x: number) {
    this.x = x;
  }
  
  equals(v: Vector1) {
    return this.x === v.x;
  }
}

class Vector2 {
  x: number;
  y: number;
  
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  
  equals(v: Vector2) {
    return this.x === v.x && this.y === v.y;
  }
}
export { Vector1, Vector2 };