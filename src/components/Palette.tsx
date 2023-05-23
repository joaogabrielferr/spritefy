
import { useContext, useEffect, useState } from 'react';
import '../styles/palettes.css'
import { selectedColorContext } from '../contexts/selectedColorContext';

interface PaletteInterface{
    palette : string[];
}

export function Palette({palette} : PaletteInterface){

    const {selectedColor,setSelectedColor} = useContext(selectedColorContext);

    return <div className = "palette">

        
        {
            palette.map((color)=><button style = {{borderStyle:'none',backgroundColor:color,height:'30px'}} onClick = {()=>setSelectedColor(color)}></button>)
        }


    </div>

}