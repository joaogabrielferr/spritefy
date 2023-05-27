
import { useContext} from 'react';
import { selectedColorContext } from '../contexts/selectedColor/selectedColorContext';
import { PaletteType } from '../types';
import './palettes.css';

interface PaletteInterface{
    palette : PaletteType;
}

export function Palette({palette} : PaletteInterface){

    const {setSelectedColor} = useContext(selectedColorContext);

    const uniqueColors = palette.colors.filter((color,index)=>{return palette.colors.indexOf(color) === index;})


    return <div className = "palette">

        
        {
            uniqueColors.map((color)=><button className = "paletteButton" style = {{backgroundColor:color}} key = {color} onClick = {()=>setSelectedColor(color)}></button>)
        }


    </div>

}