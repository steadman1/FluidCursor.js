import "./css/FluidCursorStyle.scss";
import CursorComponent from "./CursorComponent";
import TargetComponent from "./TargetComponent";
import { Vector2 } from "./Vectors";
import IntersectionType from "./IntersectionType";
import gsap from "gsap";
export default class FluidCursor {
    constructor() {
        this.lastMouse = new Vector2(0, 0);
        this.targets = [];
        this.cursors = [];
        // TODO: Don"t setup if user is a touch event device
        const HTMLCursorComponents = document.querySelectorAll("[fluid-cursor]");
        const HTMLTargetComponents = document.querySelectorAll("[fluid-target]");
        // set up fluid cursor and target components
        for (const cursor of HTMLCursorComponents)
            this.setUpFluidCursor(cursor);
        for (const target of HTMLTargetComponents)
            this.setUpFluidTarget(target);
        // set up body styling and hide cursor
        if (this.cursors.length > 0) {
            document.body.style.width = "100vw";
            document.body.style.height = "100vh";
            document.body.style.margin = "0";
            document.body.style.cursor = "none";
        }
        // bind all functions to this to prevent weird scope behavior
        this.getCursorPosition = this.getCursorPosition.bind(this);
        this.addGSAPPositionTweens = this.addGSAPPositionTweens.bind(this);
        this.addGSAPRotationTweens = this.addGSAPRotationTweens.bind(this);
        this.updateCursorPosition = this.updateCursorPosition.bind(this);
        this.updateCursorRotation = this.updateCursorRotation.bind(this);
        this.updateCursorIntersection = this.updateCursorIntersection.bind(this);
        this.checkIntersection = this.checkIntersection.bind(this);
        this.updateTargetMorphCursor = this.updateTargetMorphCursor.bind(this);
        this.setLastMouse = this.setLastMouse.bind(this);
        this.animateCursors = this.animateCursors.bind(this);
        this.setUpFluidCursor = this.setUpFluidCursor.bind(this);
        this.setUpFluidTarget = this.setUpFluidTarget.bind(this);
        // add event listeners and start animation loop
        gsap.ticker.add(() => { this.animateCursors(); });
    }
    getCursorPosition(event) {
        // explicitly get mouse position to handle cases of
        // scroll events changing mouse position relative to HTML
        let mouseX;
        let mouseY;
        if (event instanceof MouseEvent) {
            mouseX = event.clientX;
            mouseY = event.clientY;
        }
        else {
            mouseX = this.lastMouse.x;
            mouseY = this.lastMouse.y;
        }
        return new Vector2(mouseX, mouseY);
    }
    addGSAPPositionTweens(cursor, position) {
        if (cursor.hasIntersection() && (cursor.morphTarget || cursor.magneticTarget))
            return;
        // will kill tween if cursor is intersecting with a target
        // and has an attribute that depends on locking cursor position
        const tween = gsap.to(cursor.position, {
            x: position.x,
            y: position.y,
            duration: cursor.followDelay,
            ease: "power3.out",
            onUpdate: () => {
                if (cursor.hasIntersection() && (cursor.morphTarget || cursor.magneticTarget))
                    tween.kill();
            },
        });
    }
    addGSAPRotationTweens(cursor, delta) {
        if (cursor.hasIntersection() && (cursor.morphTarget || cursor.magneticTarget))
            return;
        // will kill tween if cursor is intersecting with a target
        // and has an attribute that depends on locking cursor rotation
        const tween = gsap.to(cursor.rotation, {
            x: delta * cursor.rotationMagnitude,
            duration: cursor.rotationDelay,
            ease: "power3.out",
            onUpdate: () => {
                if (cursor.hasIntersection() && (cursor.morphTarget || cursor.magneticTarget)) {
                    tween.kill();
                    this.addGSAPRotationTweens(cursor, 0);
                }
            },
            // reset rotation to 0 after tween completes
            onComplete: () => { this.addGSAPRotationTweens(cursor, 0); },
        });
    }
    updateCursorPosition(e) {
        for (const cursor of this.cursors)
            this.addGSAPPositionTweens(cursor, this.getCursorPosition(e));
    }
    updateCursorRotation(e) {
        for (const cursor of this.cursors) {
            if (!cursor.rotationPhysics)
                return; // Assuming this is meant for checking physics
            const deltaX = e.movementX;
            const deltaY = e.movementY;
            this.addGSAPRotationTweens(cursor, (deltaX + deltaY / 2));
        }
    }
    updateCursorIntersection(type, target) {
        for (const cursor of this.cursors)
            cursor.intersection(type, target);
    }
    checkIntersection(e) {
        const { x: mouseX, y: mouseY } = this.getCursorPosition(e);
        for (const target of this.targets) {
            const rect = target.HTML.getBoundingClientRect();
            // check if mouse is within target"s bounding box
            const intersection = mouseX >= rect.left - target.intersectMargin.left &&
                mouseX <= rect.right + target.intersectMargin.right &&
                mouseY >= rect.top - target.intersectMargin.top &&
                mouseY <= rect.bottom + target.intersectMargin.bottom;
            let type;
            if (intersection && !target.hasIntersection)
                type = IntersectionType.ENTER;
            else if (intersection && target.hasIntersection)
                type = IntersectionType.DORMANT;
            else if (!intersection && target.hasIntersection)
                type = IntersectionType.LEAVE;
            if (!type)
                continue;
            target.intersection(type);
            this.updateCursorIntersection(type, target);
            target.hasIntersection = intersection;
        }
    }
    updateTargetMorphCursor(e) {
        for (const target of this.targets) {
            if (!target.morphCursor)
                continue;
            target.morphTo(new Vector2(e.clientX, e.clientY));
        }
    }
    setLastMouse(e) {
        this.lastMouse.x = e.clientX;
        this.lastMouse.y = e.clientY;
    }
    animateCursors() {
        window.addEventListener("mousemove", this.setLastMouse);
        window.addEventListener("scroll", this.updateCursorPosition);
        window.addEventListener("mousemove", this.updateCursorPosition);
        window.addEventListener("mousemove", this.updateCursorRotation);
        window.addEventListener("mousemove", this.updateTargetMorphCursor);
        if (this.targets.length > 0)
            window.addEventListener("scroll", this.checkIntersection);
        if (this.targets.length > 0)
            window.addEventListener("mousemove", this.checkIntersection);
        for (const cursor of this.cursors)
            cursor.setHTML();
    }
    setUpFluidTarget(target) {
        this.targets.push(new TargetComponent({
            HTML: target,
            intersectMargin: target.getAttribute("ft-intersect-margin"),
            intersectScale: target.getAttribute("ft-intersect-scale"),
            hasIntersectClass: target.getAttribute("ft-has-intersect-class"),
            withoutIntersectClass: target.getAttribute("ft-without-intersect-class"),
            morphCursor: target.getAttribute("ft-morph-cursor"),
            morphDivisor: target.getAttribute("ft-morph-divisor"),
            morphMultiplier: target.getAttribute("ft-morph-multiplier"),
        }));
    }
    setUpFluidCursor(cursor) {
        this.cursors.push(new CursorComponent({
            HTML: cursor,
            followDelay: cursor.getAttribute("fc-follow-delay"),
            rotationPhysics: cursor.getAttribute("fc-rotation-physics"),
            rotationDelay: cursor.getAttribute("fc-rotation-delay"),
            rotationMagnitude: cursor.getAttribute("fc-rotation-magnitude"),
            rotationMax: cursor.getAttribute("fc-rotation-max"),
            hasIntersectClass: cursor.getAttribute("fc-has-intersect-class"),
            withoutIntersectClass: cursor.getAttribute("fc-without-intersect-class"),
            morphTarget: cursor.getAttribute("fc-morph-target"),
            morphTargetDelay: cursor.getAttribute("fc-morph-delay"),
            morphTargetPadding: cursor.getAttribute("fc-morph-padding"),
            magneticTarget: cursor.getAttribute("fc-magnetic-target"),
            magneticTargetDelay: cursor.getAttribute("fc-magnetic-delay"),
        }));
    }
}
//# sourceMappingURL=FluidCursor.js.map