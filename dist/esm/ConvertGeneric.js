export const ConvertGeneric = (value, typeConstructor) => {
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
//# sourceMappingURL=ConvertGeneric.js.map