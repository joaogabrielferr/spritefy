export function createSpriteSheet(displaySize: number, framesList: string[]) {
  const canvas = document.createElement('canvas');
  const rows = framesList.length < 5 ? framesList.length : 5;
  const width = displaySize * rows; //TODO: allow user to specify how many frames will be in a row
  const heigth = Math.ceil(framesList.length / rows) * displaySize;
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

  document.body.removeChild(canvas);
  document.body.removeChild(link);
}
