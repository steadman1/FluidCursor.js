import TRBL from "./TopRightBottomLeft";
import IntersectionType from "./IntersectionType";
import { ConvertGeneric } from "./ConvertGeneric";
import { Vector2 } from "./Vectors";
class TargetComponent {
    constructor({ HTML, intersectMargin, intersectScale, hasIntersectClass, withoutIntersectClass, morphCursor, morphDivisor, morphMultiplier, }) {
        this.HTML = HTML;
        this.hasIntersection = false;
        this.intersectMargin = new TRBL(intersectMargin);
        this.intersectScale = ConvertGeneric(intersectScale || "1", Number);
        this.hasIntersectClass = ConvertGeneric(hasIntersectClass || "", String);
        this.withoutIntersectClass = ConvertGeneric(withoutIntersectClass || "", String);
        this.morphCursor = ConvertGeneric(morphCursor !== null ? morphCursor : "false", Boolean);
        this.morphDivisor = ConvertGeneric(morphDivisor || "1", Number);
        this.morphMultiplier = ConvertGeneric(morphMultiplier || "1", Number);
    }
    morphTo(position) {
        if (!this.morphCursor)
            return;
        const targetPosition = this.HTML.getBoundingClientRect();
        const center = new Vector2(targetPosition.left + targetPosition.width / 2, targetPosition.top + targetPosition.height / 2);
        if (!this.hasIntersection) {
            this.HTML.style.transition = "translate 0.25s, scale 0.25s";
            this.HTML.style.translate = "0px 0px";
            this.HTML.style.scale = "1";
            return;
        }
        // **different morph to the cursor morph**
        // translate HTML in cursor"s direction
        const dx = center.x - position.x;
        const dy = center.y - position.y;
        const offset = new Vector2(Math.log(Math.abs(dx) / (this.morphDivisor) + 1) * this.morphMultiplier * (dx > 0 ? -1 : 1), Math.log(Math.abs(dy) / (this.morphDivisor) + 1) * this.morphMultiplier * (dy > 0 ? -1 : 1));
        this.HTML.style.transition = "translate 0.05s, scale 0.05s";
        this.HTML.style.translate = `${offset.x}px ${offset.y}px`;
        this.HTML.style.scale = `${this.intersectScale}`;
    }
    intersection(type) {
        // dispatch generic and specific events
        window.dispatchEvent(new Event(`ft-intersect-${type}`));
        window.dispatchEvent(new Event(`ft-intersect-${type}-${this.HTML.id}`));
        // add classes if specified
        switch (type) {
            case IntersectionType.ENTER:
                if (!(this.hasIntersectClass.trim() === ""))
                    this.HTML.classList.add(this.hasIntersectClass);
                if (!(this.withoutIntersectClass.trim() === ""))
                    this.HTML.classList.remove(this.withoutIntersectClass);
                this.hasIntersection = true;
                break;
            case IntersectionType.LEAVE:
                if (!(this.hasIntersectClass.trim() === ""))
                    this.HTML.classList.remove(this.hasIntersectClass);
                if (!(this.withoutIntersectClass.trim() === ""))
                    this.HTML.classList.add(this.withoutIntersectClass);
                this.hasIntersection = false;
                break;
        }
    }
}
export default TargetComponent;
//# sourceMappingURL=TargetComponent.js.map