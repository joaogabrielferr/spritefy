import { ChangeEvent, useState } from 'react';
import './palettes.scss';
import { PaletteType } from '../../types';
import { StoreType, store } from '../../store';
import { palettes } from '../../utils/paletteLists';

export function Palettes() {
  //TODO: Save palettes created by user on local storage
  const [selectedPalette, setSelectedPalette] = useState<PaletteType>(palettes[0]);

  // const {setSelectedColor} = useContext(selectedColorContext);

  const setSelectedColor = store((state: StoreType) => state.setSelectedColor);

  function handleChangePalette(e: ChangeEvent<HTMLSelectElement>) {
    setSelectedPalette(palettes.find((palette) => +palette.id === +e.target.value)!);
  }

  return (
    <div className="palettes">
      <div className="palettes-title">COLOR PALETTES</div>
      <div>
        <select className="selectPalette" name="" id="" onChange={handleChangePalette}>
          {palettes.map((palette) => (
            <option key={palette.id} value={palette.id}>
              {palette.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: '5px' }}>
        {selectedPalette.name.toLocaleUpperCase()}
        <div className="palette">
          {selectedPalette.colors.map((color, index) => (
            <button
              className="palette-button"
              style={{ backgroundColor: color }}
              key={color + index}
              onClick={() => setSelectedColor(color)}></button>
          ))}
        </div>
      </div>
    </div>
  );
}
