import { Vector1, Vector2 } from "./Vectors";
import { ConvertGeneric } from "./ConvertGeneric";
import IntersectionType from "./IntersectionType";
import TargetComponent from "./TargetComponent";
import "./Strings";

import gsap from "gsap";

class CursorComponent {
  HTML: HTMLElement;
  position: Vector2;
  followDelay: number;
  rotationPhysics: boolean;
  rotation: Vector1;
  rotationDelay: number;
  rotationMagnitude: number;
  rotationMax: number;
  intersections: Array<TargetComponent>;
  hasIntersectClass: string;
  withoutIntersectClass: string;
  morphTarget: boolean;
  morphTargetDelay: number;
  morphTargetPadding: number;
  magneticTarget: boolean;
  magneticTargetDelay: number;

  constructor(
    { 
      HTML, 
      followDelay, 
      rotationPhysics, 
      rotationDelay,
      rotationMagnitude,
      rotationMax,
      hasIntersectClass,
      withoutIntersectClass,
      morphTarget,
      morphTargetDelay,
      morphTargetPadding,
      magneticTarget,
      magneticTargetDelay,
    }: { 
      HTML: HTMLElement; 
      followDelay: string | null; 
      rotationPhysics: string | null; 
      rotationDelay: string | null;
      rotationMagnitude: string | null; 
      rotationMax: string | null;
      hasIntersectClass: string | null;
      withoutIntersectClass: string | null;
      morphTarget: string | null;
      morphTargetDelay: string | null;
      morphTargetPadding: string | null;
      magneticTarget: string | null;
      magneticTargetDelay: string | null;
    }
  ) {
    // check ConvertGeneric.ts for the implementation of ConvertGeneric

    this.HTML = HTML;
    this.position = new Vector2(0, 0);
    this.followDelay = ConvertGeneric<number>(followDelay || "0", Number);
    
    this.rotation = new Vector1(0);
    this.rotationPhysics = ConvertGeneric<boolean>(rotationPhysics !== null ? rotationPhysics : "false", Boolean);
    this.rotationDelay = ConvertGeneric<number>(rotationDelay || "0", Number);
    this.rotationMagnitude = ConvertGeneric<number>(rotationMagnitude || "1", Number);
    this.rotationMax = ConvertGeneric<number>(rotationMax || "45", Number);
    
    this.intersections = [];
    this.hasIntersectClass = ConvertGeneric<string>(hasIntersectClass || "", String);
    this.withoutIntersectClass = ConvertGeneric<string>(withoutIntersectClass || "", String);
    
    this.morphTarget = ConvertGeneric<boolean>(morphTarget !== null ? morphTarget : "false", Boolean);
    this.morphTargetDelay = ConvertGeneric<number>(morphTargetDelay || "0", Number);
    this.morphTargetPadding = ConvertGeneric<number>(morphTargetPadding || "0", Number);
    
    this.magneticTarget = ConvertGeneric<boolean>(magneticTarget !== null ? magneticTarget : "false", Boolean);
    this.magneticTargetDelay = ConvertGeneric<number>(magneticTargetDelay || "0", Number);

    // set up fluid cursor specifics
    this.HTML.classList.add("fluid-cursor");
    if (!this.withoutIntersectClass.isEmpty()) this.HTML.classList.add(this.withoutIntersectClass);
  }
  
  hasIntersection() {
    return this.intersections.length > 0;
  }
  
  morphTo(target: TargetComponent) {
    if (!this.morphTarget) return;
    
    const targetPosition = target.HTML.getBoundingClientRect();
    const computedStyles = window.getComputedStyle(target.HTML);
  
    // either gets computed style or inline style to
    // use for the cursor morphing effect
    const getValidStyle = (property: keyof CSSStyleDeclaration) => {
      const inlineStyle = target.HTML.style[property];
      const computedStyle = computedStyles[property];
  
      return (inlineStyle || computedStyle || "").toString();
    };
    
    // add cursor styling to match target
    const borderRadius = parseFloat(getValidStyle("borderRadius").replace("px", "")) + this.morphTargetPadding;
    this.HTML.style.transition = `width ${this.morphTargetDelay}s, height ${this.morphTargetDelay}s, scale ${this.morphTargetDelay}s, padding ${this.morphTargetDelay}s`;
    this.HTML.style.scale = `${target.intersectScale}`
    this.HTML.style.width = getValidStyle("width") || `${targetPosition.width}px`;
    this.HTML.style.height = getValidStyle("height") || `${targetPosition.height}px`;
    this.HTML.style.borderRadius = `${borderRadius}px` || "0px";
    this.HTML.style.padding = `${this.morphTargetPadding}px`;
  }
  
  cancelMorph() {
    if (!this.morphTarget) return;
    this.HTML.style.scale = "1";
    this.HTML.style.width = "";
    this.HTML.style.height = "";
    this.HTML.style.borderRadius = "";
    this.HTML.style.padding = "";
  }
  
  magneticTo(target: TargetComponent) {
    if (!this.magneticTarget) return;
    
    const targetPosition = target.HTML.getBoundingClientRect();
    
    const targetCenter = new Vector2(
      targetPosition.left + targetPosition.width / 2,
      targetPosition.top + targetPosition.height / 2 
    );
    
    // tween to target center and lock position until
    // cursor is no longer intersecting with any target
    const tween1 = gsap.to(this.position, {
      x: targetCenter.x,
      y: targetCenter.y,
      duration: this.magneticTargetDelay,
      ease: "power3.out",
      onUpdate: () => { if (!this.hasIntersection()) tween1.kill(); }
    });  
    
    // tween to target rotation to 0 and lock rotation
    const tween2 = gsap.to(this.rotation, {
      x: 0,
      duration: this.magneticTargetDelay,
      ease: "power3.out",
      onUpdate: () => { if (!this.hasIntersection()) tween2.kill(); }
    }); 
  }
  
  intersection(type: IntersectionType, target: TargetComponent ) {
    switch (type) {
      case IntersectionType.ENTER:
        this.intersections.push(target)
        
        // when cursor intersects target dispatch generic
        // event and add classes if specified
        window.dispatchEvent(new Event(`fc-has-intersection`));
        if (!this.hasIntersectClass.isEmpty()) this.HTML.classList.add(this.hasIntersectClass);
        if (!this.withoutIntersectClass.isEmpty()) this.HTML.classList.remove(this.withoutIntersectClass);
        break;
      case IntersectionType.LEAVE:
        this.intersections = this.intersections.filter((t) => t !== target);
        this.cancelMorph();
        break;
    }
    
    if (this.intersections.length <= 0) {
      // when cursor leaves all intersection targets 
      // dispatch generic event and add classes
      window.dispatchEvent(new Event(`fc-without-intersection`));
      if (!this.hasIntersectClass.isEmpty()) this.HTML.classList.remove(this.hasIntersectClass);
      if (!this.withoutIntersectClass.isEmpty()) this.HTML.classList.add(this.withoutIntersectClass);
    }
  }

  setHTML() {
    // set required cursor HTML element
    this.HTML.style.top = `${this.position.y}px`;
    this.HTML.style.left = `${this.position.x}px`;

    if (this.rotationPhysics) {
      const rotation = this.rotationMax
        ? Math.max(Math.min(this.rotation.x, this.rotationMax), -this.rotationMax)
        : this.rotation.x;
      this.HTML.style.rotate = `${rotation}deg`;
    }
    
    // check if cursor is intersecting with any target
    // and apply morphing and magnetic effects
    if (this.hasIntersection()) {
      this.morphTo(this.intersections[0]);
      this.magneticTo(this.intersections[0]);
    }
  }
}

export default CursorComponent;
