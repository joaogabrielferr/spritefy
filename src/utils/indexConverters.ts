export function CanvasCoordinatesToArrayIndex(x: number, y: number, displaySize: number) {
  return (x + displaySize * y) * 4;
}

export function ArrayIndexToCanvasCoordinates(index: number, displaySize: number) {
  //Uint8clampedArray index to canvas coordinate
  const x = Math.floor((index / 4) % displaySize);
  const y = Math.floor(index / 4 / displaySize);

  return { x, y };
}
