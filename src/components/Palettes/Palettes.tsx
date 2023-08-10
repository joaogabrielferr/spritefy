import { ChangeEvent } from 'react';
import './palettes.scss';
import { PaletteType } from '../../types';
import { StoreType, store } from '../../store';

const palettes = [
  {
    name: 'solid colors',
    colors: [
      // Red
      '#FF0000', // Red
      '#FF4500', // Orange Red
      '#DC143C', // Crimson
      '#FF6347', // Tomato
      '#FF7F50', // Coral
      '#FF8C00', // Dark Orange
      '#FFA500', // Orange
      '#FFD700', // Gold
      '#FFA07A', // Light Salmon
      '#CD5C5C', // Indian Red
      '#B22222', // Fire Brick
      '#8B0000', // Dark Red

      // Pink
      '#FFC0CB', // Pink
      '#FF69B4', // Hot Pink
      '#FF1493', // Deep Pink
      '#C71585', // Medium Violet Red
      '#DB7093', // Pale Violet Red

      // Purple
      '#800080', // Purple
      '#8A2BE2', // Blue Violet
      '#9932CC', // Dark Orchid
      '#BA55D3', // Medium Orchid
      '#DA70D6', // Orchid
      '#D8BFD8', // Thistle
      '#DDA0DD', // Plum
      '#EE82EE', // Violet
      '#FF00FF', // Magenta
      '#FF00FF', // Fuchsia

      // Blue
      '#0000FF', // Blue
      '#0000CD', // Medium Blue
      '#00008B', // Dark Blue
      '#000080', // Navy
      '#4169E1', // Royal Blue
      '#6495ED', // Cornflower Blue
      '#1E90FF', // Dodger Blue
      '#00BFFF', // Deep Sky Blue
      '#87CEEB', // Sky Blue
      '#87CEFA', // Light Sky Blue
      '#ADD8E6', // Light Blue
      '#B0C4DE', // Light Steel Blue
      '#4682B4', // Steel Blue
      '#4B0082', // Indigo
      '#6A5ACD', // Slate Blue
      '#7B68EE', // Medium Slate Blue
      '#8B008B', // Dark Magenta

      // Green
      '#008000', // Green
      '#006400', // Dark Green
      '#9ACD32', // Yellow Green
      '#00FF00', // Lime
      '#32CD32', // Lime Green
      '#00FF7F', // Spring Green
      '#7FFF00', // Chartreuse
      '#7CFC00', // Lawn Green
      '#ADFF2F', // Green Yellow
      '#00FA9A', // Medium Spring Green
      '#00FF00', // Lime Green
      '#9ACD32', // Yellow Green

      // Yellow
      '#FFFF00', // Yellow
      '#FFD700', // Gold
      '#FFED00', // Yellow Orange
      '#FFA500', // Orange
      '#FFC800', // Amber
      '#FFB90F', // Dark Golden Rod

      // Orange
      '#FF8C00', // Dark Orange
      '#FF7F50', // Coral
      '#FF6347', // Tomato
      '#FF4500', // Orange Red

      // Brown
      '#8B4513', // Saddle Brown
      '#A0522D', // Sienna
      '#D2691E', // Chocolate
      '#B8860B', // Dark Golden Rod
      '#BC8F8F', // Rosy Brown
      '#CD853F', // Peru
      '#D2B48C', // Tan
      '#DEB887', // Burly Wood
      '#F4A460', // Sandy Brown

      // White & Gray
      '#FFFFFF', // White
      '#DCDCDC', // Gainsboro
      '#D3D3D3', // Light Gray
      '#C0C0C0', // Silver
      '#A9A9A9', // Dark Gray
      '#808080', // Gray
      '#696969', // Dim Gray
      '#000000' // Black
    ],
    id: 1
  },
  {
    name: 'gray scale',
    colors: [
      '#000000',
      '#080808',
      '#101010',
      '#181818',
      '#202020',
      '#282828',
      '#303030',
      '#383838',
      '#404040',
      '#484848',
      '#505050',
      '#585858',
      '#606060',
      '#686868',
      '#707070',
      '#787878',
      '#808080',
      '#888888',
      '#909090',
      '#989898',
      '#A0A0A0',
      '#A8A8A8',
      '#B0B0B0',
      '#B8B8B8',
      '#C0C0C0',
      '#C8C8C8',
      '#D0D0D0',
      '#D8D8D8',
      '#E0E0E0',
      '#E8E8E8',
      '#F0F0F0',
      '#F8F8F8',
      '#FFFFFF'
    ],
    id: 7
  },
  {
    name: 'water',
    colors: ['#0f5e9c', '#2389da', '#1ca3ec', '#5abcd8', '#74ccf4'],
    id: 3
  },
  {
    name: 'fire',
    colors: ['#ff0000', '#ff5a00', '#ff9a00', '#ffce00', '#ffe808'],
    id: 4
  },
  {
    name: 'grass',
    colors: ['#234d20', '#36802d', '#77ab59', '#c9df8a', '#f0f7da'],
    id: 5
  },
  {
    name: 'sand',
    colors: ['#b38b67', '#c89f73', '#d9b380', '#f1cc8f', '#fbe7a1'],
    id: 6
  }
] as PaletteType[];

export function Palettes() {
  //TODO: Save palettes created by user on local storage
  // const [selectedPalette,setSelectedPalette] = useState<PaletteType>(palettes[0]);

  // const {setSelectedColor} = useContext(selectedColorContext);

  const setSelectedColor = store((state: StoreType) => state.setSelectedColor);

  function handleChangePalette(e: ChangeEvent<HTMLSelectElement>) {
    // setSelectedPalette(palettes.find((palette)=>+palette.id === +e.target.value)!)
  }

  return (
    <div className="palettes">
      <div className="palettes-title">COLOR PALETTES</div>
      {/* <div className = "selectPaletteWrapper">
                <select  className = "selectPalette" name="" id="" onChange={handleChangePalette}>
                    {
                        palettes.map((palette)=> <option key = {palette.id} value = {palette.id}>{palette.name}</option>)
                    }
                </select>
            </div> */}
      {/* <Palette palette={selectedPalette}></Palette> */}
      {palettes.map((palette) => (
        <div key={palette.id} style={{ marginTop: '5px' }}>
          {palette.name.toLocaleUpperCase()}
          <div className="palette">
            {palette.colors.map((color, index) => (
              <button
                className="palette-button"
                style={{ backgroundColor: color }}
                key={color + index}
                onClick={() => setSelectedColor(color)}></button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
