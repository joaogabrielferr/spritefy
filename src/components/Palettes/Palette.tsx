import { PaletteType } from '../../types';
import './palettes.scss';
import { StoreType, store } from '../../store';

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
          className="palette-button"
          style={{ backgroundColor: color }}
          key={color}
          onClick={() => setSelectedColor(color)}></button>
      ))}
    </div>
  );
}
