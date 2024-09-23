import TRBL from "./TopRightBottomLeft";
import IntersectionType from "./IntersectionType";
import { Vector2 } from "./Vectors";
declare class TargetComponent {
    HTML: HTMLElement;
    hasIntersection: boolean;
    intersectMargin: TRBL;
    intersectScale: number;
    hasIntersectClass: string;
    withoutIntersectClass: string;
    morphCursor: boolean;
    morphDivisor: number;
    morphMultiplier: number;
    constructor({ HTML, intersectMargin, intersectScale, hasIntersectClass, withoutIntersectClass, morphCursor, morphDivisor, morphMultiplier, }: {
        HTML: HTMLElement;
        intersectMargin: string | null;
        intersectScale: string | null;
        hasIntersectClass: string | null;
        withoutIntersectClass: string | null;
        morphCursor: string | null;
        morphDivisor: string | null;
        morphMultiplier: string | null;
    });
    morphTo(position: Vector2): void;
    intersection(type: IntersectionType): void;
}
export default TargetComponent;
