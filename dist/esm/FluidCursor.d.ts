import "./css/FluidCursorStyle.scss";
import CursorComponent from "./CursorComponent";
import TargetComponent from "./TargetComponent";
import { Vector2 } from "./Vectors";
import IntersectionType from "./IntersectionType";
export declare class FluidCursor {
    lastMouse: Vector2;
    targets: Array<TargetComponent>;
    cursors: Array<CursorComponent>;
    constructor();
    getCursorPosition(event: MouseEvent | Event): Vector2;
    addGSAPPositionTweens(cursor: CursorComponent, position: Vector2): void;
    addGSAPRotationTweens(cursor: CursorComponent, delta: number): void;
    updateCursorPosition(e: MouseEvent | Event): void;
    updateCursorRotation(e: MouseEvent): void;
    updateCursorIntersection(type: IntersectionType, target: TargetComponent): void;
    checkIntersection(e: MouseEvent | Event): void;
    updateTargetMorphCursor(e: MouseEvent): void;
    setLastMouse(e: MouseEvent): void;
    animateCursors(): void;
    setUpFluidTarget(target: Element): void;
    setUpFluidCursor(cursor: Element): void;
}
