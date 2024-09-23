"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TRBL {
    constructor(trbl) {
        if (!trbl) {
            this.top = this.right = this.bottom = this.left = 0;
            return;
        }
        const values = trbl.split(" ").map(Number);
        if (values.length <= 0) {
            this.top = this.right = this.bottom = this.left = 0;
            return;
        }
        switch (values.length) {
            case 1:
                this.top = this.right = this.bottom = this.left = values[0];
                break;
            case 2:
                this.top = this.bottom = values[0];
                this.right = this.left = values[1];
                break;
            case 3:
                this.top = values[0];
                this.right = this.left = values[1];
                this.bottom = values[2];
                break;
            default:
                this.top = values[0];
                this.right = values[1];
                this.bottom = values[2];
                this.left = values[3];
                break;
        }
    }
}
exports.default = TRBL;
//# sourceMappingURL=TopRightBottomLeft.js.map