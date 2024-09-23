"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TopRightBottomLeft_1 = require("./TopRightBottomLeft");
const IntersectionType_1 = require("./IntersectionType");
const ConvertGeneric_1 = require("./ConvertGeneric");
require("./Strings");
const Vectors_1 = require("./Vectors");
class TargetComponent {
    constructor({ HTML, intersectMargin, intersectScale, hasIntersectClass, withoutIntersectClass, morphCursor, morphDivisor, morphMultiplier, }) {
        this.HTML = HTML;
        this.hasIntersection = false;
        this.intersectMargin = new TopRightBottomLeft_1.default(intersectMargin);
        this.intersectScale = (0, ConvertGeneric_1.ConvertGeneric)(intersectScale || "1", Number);
        this.hasIntersectClass = (0, ConvertGeneric_1.ConvertGeneric)(hasIntersectClass || "", String);
        this.withoutIntersectClass = (0, ConvertGeneric_1.ConvertGeneric)(withoutIntersectClass || "", String);
        this.morphCursor = (0, ConvertGeneric_1.ConvertGeneric)(morphCursor !== null ? morphCursor : "false", Boolean);
        this.morphDivisor = (0, ConvertGeneric_1.ConvertGeneric)(morphDivisor || "1", Number);
        this.morphMultiplier = (0, ConvertGeneric_1.ConvertGeneric)(morphMultiplier || "1", Number);
    }
    morphTo(position) {
        if (!this.morphCursor)
            return;
        const targetPosition = this.HTML.getBoundingClientRect();
        const center = new Vectors_1.Vector2(targetPosition.left + targetPosition.width / 2, targetPosition.top + targetPosition.height / 2);
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
        const offset = new Vectors_1.Vector2(Math.log(Math.abs(dx) / (this.morphDivisor) + 1) * this.morphMultiplier * (dx > 0 ? -1 : 1), Math.log(Math.abs(dy) / (this.morphDivisor) + 1) * this.morphMultiplier * (dy > 0 ? -1 : 1));
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
            case IntersectionType_1.default.ENTER:
                if (!this.hasIntersectClass.isEmpty())
                    this.HTML.classList.add(this.hasIntersectClass);
                if (!this.withoutIntersectClass.isEmpty())
                    this.HTML.classList.remove(this.withoutIntersectClass);
                this.hasIntersection = true;
                break;
            case IntersectionType_1.default.LEAVE:
                if (!this.hasIntersectClass.isEmpty())
                    this.HTML.classList.remove(this.hasIntersectClass);
                if (!this.withoutIntersectClass.isEmpty())
                    this.HTML.classList.add(this.withoutIntersectClass);
                this.hasIntersection = false;
                break;
        }
    }
}
exports.default = TargetComponent;
