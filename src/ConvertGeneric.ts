export const ConvertGeneric = <Type>(value: string, typeConstructor: Function): Type => {
  if (typeConstructor === Boolean) {
    return (value === "true" || value === "") as unknown as Type;
  }

  if (typeConstructor === Number) {
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) {
      return 0 as unknown as Type;
    }
    return numberValue as unknown as Type;
  }

  if (typeConstructor === String) {
    return value as unknown as Type;
  }

  return new (typeConstructor as { new (...args: any[]): Type })(value);
};
