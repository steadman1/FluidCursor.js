import { Vector1, Vector2 } from "./Vectors";
import { ConvertGeneric } from "./ConvertGeneric";
import IntersectionType from "./IntersectionType";
import gsap from "gsap";
class CursorComponent {
    constructor({ HTML, followDelay, rotationPhysics, rotationDelay, rotationMagnitude, rotationMax, hasIntersectClass, withoutIntersectClass, morphTarget, morphTargetDelay, morphTargetPadding, magneticTarget, magneticTargetDelay, }) {
        // check ConvertGeneric.ts for the implementation of ConvertGeneric
        this.HTML = HTML;
        this.position = new Vector2(0, 0);
        this.followDelay = ConvertGeneric(followDelay || "0", Number);
        this.rotation = new Vector1(0);
        this.rotationPhysics = ConvertGeneric(rotationPhysics !== null ? rotationPhysics : "false", Boolean);
        this.rotationDelay = ConvertGeneric(rotationDelay || "0", Number);
        this.rotationMagnitude = ConvertGeneric(rotationMagnitude || "1", Number);
        this.rotationMax = ConvertGeneric(rotationMax || "45", Number);
        this.intersections = [];
        this.hasIntersectClass = ConvertGeneric(hasIntersectClass || "", String);
        this.withoutIntersectClass = ConvertGeneric(withoutIntersectClass || "", String);
        this.morphTarget = ConvertGeneric(morphTarget !== null ? morphTarget : "false", Boolean);
        this.morphTargetDelay = ConvertGeneric(morphTargetDelay || "0", Number);
        this.morphTargetPadding = ConvertGeneric(morphTargetPadding || "0", Number);
        this.magneticTarget = ConvertGeneric(magneticTarget !== null ? magneticTarget : "false", Boolean);
        this.magneticTargetDelay = ConvertGeneric(magneticTargetDelay || "0", Number);
        // set up fluid cursor specifics
        this.HTML.classList.add("fluid-cursor");
        if (!(this.withoutIntersectClass.trim() === ""))
            this.HTML.classList.add(this.withoutIntersectClass);
    }
    hasIntersection() {
        return this.intersections.length > 0;
    }
    morphTo(target) {
        if (!this.morphTarget)
            return;
        const targetPosition = target.HTML.getBoundingClientRect();
        const computedStyles = window.getComputedStyle(target.HTML);
        // either gets computed style or inline style to
        // use for the cursor morphing effect
        const getValidStyle = (property) => {
            const inlineStyle = target.HTML.style[property];
            const computedStyle = computedStyles[property];
            return (inlineStyle || computedStyle || "").toString();
        };
        // add cursor styling to match target
        const borderRadius = parseFloat(getValidStyle("borderRadius").replace("px", "")) + this.morphTargetPadding;
        this.HTML.style.transition = `width ${this.morphTargetDelay}s, height ${this.morphTargetDelay}s, scale ${this.morphTargetDelay}s, padding ${this.morphTargetDelay}s`;
        this.HTML.style.scale = `${target.intersectScale}`;
        this.HTML.style.width = getValidStyle("width") || `${targetPosition.width}px`;
        this.HTML.style.height = getValidStyle("height") || `${targetPosition.height}px`;
        this.HTML.style.borderRadius = `${borderRadius}px` || "0px";
        this.HTML.style.padding = `${this.morphTargetPadding}px`;
    }
    cancelMorph() {
        if (!this.morphTarget)
            return;
        this.HTML.style.scale = "1";
        this.HTML.style.width = "";
        this.HTML.style.height = "";
        this.HTML.style.borderRadius = "";
        this.HTML.style.padding = "";
    }
    magneticTo(target) {
        if (!this.magneticTarget)
            return;
        const targetPosition = target.HTML.getBoundingClientRect();
        const targetCenter = new Vector2(targetPosition.left + targetPosition.width / 2, targetPosition.top + targetPosition.height / 2);
        // tween to target center and lock position until
        // cursor is no longer intersecting with any target
        const tween1 = gsap.to(this.position, {
            x: targetCenter.x,
            y: targetCenter.y,
            duration: this.magneticTargetDelay,
            ease: "power3.out",
            onUpdate: () => { if (!this.hasIntersection())
                tween1.kill(); }
        });
        // tween to target rotation to 0 and lock rotation
        const tween2 = gsap.to(this.rotation, {
            x: 0,
            duration: this.magneticTargetDelay,
            ease: "power3.out",
            onUpdate: () => { if (!this.hasIntersection())
                tween2.kill(); }
        });
    }
    intersection(type, target) {
        switch (type) {
            case IntersectionType.ENTER:
                this.intersections.push(target);
                // when cursor intersects target dispatch generic
                // event and add classes if specified
                window.dispatchEvent(new Event(`fc-has-intersection`));
                if (!(this.hasIntersectClass.trim() === ""))
                    this.HTML.classList.add(this.hasIntersectClass);
                if (!(this.withoutIntersectClass.trim() === ""))
                    this.HTML.classList.remove(this.withoutIntersectClass);
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
            if (!(this.hasIntersectClass.trim() === ""))
                this.HTML.classList.remove(this.hasIntersectClass);
            if (!(this.withoutIntersectClass.trim() === ""))
                this.HTML.classList.add(this.withoutIntersectClass);
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
//# sourceMappingURL=CursorComponent.js.map