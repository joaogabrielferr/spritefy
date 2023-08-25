import { ChangeEvent, useEffect, useState } from 'react';
import './palettes.scss';
import { PaletteType } from '../../types';
import { StoreType, store } from '../../store';
import { UtilPalettes } from '../../utils/paletteLists';

export function Palettes() {
  //TODO: Save palettes created by user on local storage
  const currentColorsPalette = store((state: StoreType) => state.currentColorsPalette);

  const palettes = [currentColorsPalette, ...UtilPalettes];
  const [selectedPalette, setSelectedPalette] = useState<PaletteType>(palettes[0]);

  useEffect(() => {
    if (selectedPalette.id === currentColorsPalette.id) {
      setSelectedPalette(currentColorsPalette);
    }
  }, [currentColorsPalette, selectedPalette.id]);

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
        {/* {selectedPalette.name.toLocaleUpperCase()} */}
        <div className="palette-container">
          <div className="palette">
            {selectedPalette.colors.map((color, index) => (
              <button
                className="palette-button"
                style={{ backgroundColor: color }}
                key={color + index}
                onClick={() => setSelectedColor(color)}></button>
            ))}
          </div>
          {selectedPalette.id == 0 && selectedPalette.colors.length == 0 ? (
            <div
              style={{
                width: '100%',
                height: '25px',
                fontSize: '12px',
                color: '#adabab',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              draw on canvas to add colors
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
