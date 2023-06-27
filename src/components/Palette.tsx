import { PaletteType } from '../types';
import './palettes.css';
import { StoreType, store } from '../store';

interface PaletteInterface {
  palette: PaletteType;
}

export function Palette({ palette }: PaletteInterface) {
  const setSelectedColor = store((store: StoreType) => store.setSelectedColor);

  const uniqueColors = palette.colors.filter((color, index) => {
    return palette.colors.indexOf(color) === index;
  });

  return (
    <div className="palette">
      {uniqueColors.map((color) => (
        <button
          className="paletteButton"
          style={{ backgroundColor: color }}
          key={color}
          onClick={() => setSelectedColor(color)}
        ></button>
      ))}
    </div>
  );
}
