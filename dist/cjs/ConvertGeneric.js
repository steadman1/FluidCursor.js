"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertGeneric = void 0;
const ConvertGeneric = (value, typeConstructor) => {
    if (typeConstructor === Boolean) {
        return (value === "true" || value === "");
    }
    if (typeConstructor === Number) {
        const numberValue = parseFloat(value);
        if (isNaN(numberValue)) {
            return 0;
        }
        return numberValue;
    }
    if (typeConstructor === String) {
        return value;
    }
    return new typeConstructor(value);
};
exports.ConvertGeneric = ConvertGeneric;
//# sourceMappingURL=ConvertGeneric.js.map