export function toRGB(hex: string) {
  if (hex[0] === '#') hex = hex.substring(1);
  const aRgbHex = hex.match(/.{1,2}/g);
  const rgb = [parseInt(aRgbHex![0], 16), parseInt(aRgbHex![1], 16), parseInt(aRgbHex![2], 16)];

  return rgb;
}

export function toHex(rgb: number[]) {
  function valueToHex(value: number) {
    return value.toString(16);
  }

  return valueToHex(rgb[0]) + valueToHex(rgb[1]) + valueToHex(rgb[2]);
}
