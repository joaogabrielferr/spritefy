import { Pixel } from '../types';

//removes duplicated pixels
export function cleanDraw(draw: Pixel[][]) {
  const clean = [];

  const map = new Map<number, boolean>();

  for (let i = 0; i < draw.length; i++) {
    if (draw[i]) {
      for (let j = 0; j < draw[i].length; j++) {
        // if (!map.get(draw[i][j].x1.toString() + draw[i][j].y1.toString())) {
        //   map.set(draw[i][j].x1.toString() + draw[i][j].y1.toString(), true);
        //   clean.push(draw[i][j]);
        // }
        if (!map.get(draw[i][j].id)) {
          map.set(draw[i][j].id, true);
          clean.push(draw[i][j]);
        }
      }
    }
  }

  return clean;
}
