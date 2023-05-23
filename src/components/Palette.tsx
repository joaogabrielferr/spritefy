
import { useContext, useEffect, useState } from 'react';
import { selectedColorContext } from '../contexts/selectedColor/selectedColorContext';

interface PaletteInterface{
    palette : string[];
}

export function Palette({palette} : PaletteInterface){

    const {setSelectedColor} = useContext(selectedColorContext);

    const uniqueColors = palette.filter((color,index)=>{return palette.indexOf(color) === index;})


    return <div className = "palette">

        
        {
            uniqueColors.map((color)=><button key = {color} style = {{borderStyle:'none',backgroundColor:color,height:'30px'}} onClick = {()=>setSelectedColor(color)}></button>)
        }


    </div>

}