//creates a sprite with 5 frames per row
export function createSpriteSheet(displaySize: number, framesList: string[]) {
  const canvas = document.createElement('canvas');
  const width = displaySize * 5; //TODO: allow user to specify how many frames will be in a row
  const heigth = Math.ceil(framesList.length / 5) * displaySize;
  canvas.width = width;
  canvas.height = heigth;
  const ctx = canvas.getContext('2d');
  let destX = 0;
  let destY = 0;
  framesList.forEach((frame) => {
    ctx?.drawImage(document.getElementById(`${frame}@sidebar`)! as HTMLCanvasElement, destY, destX);
    if (destY + displaySize < displaySize * 5) {
      destY += displaySize;
    } else {
      destX += displaySize;
      destY = 0;
    }
  });
  document.body.appendChild(canvas);
  const img: string =
    framesList.length > 1
      ? canvas.toDataURL('image/png')
      : (document.getElementById(`${framesList[0]}@sidebar`) as HTMLCanvasElement).toDataURL('image/png');
  const link = document.createElement('a');
  link.href = img;
  link.download = 'spritefy-drawing.png';
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    })
  );
}
