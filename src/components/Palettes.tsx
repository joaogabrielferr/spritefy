import { useState } from "react";
import '../styles/palettes.css';
import { Palette } from "./Palette";

export function Palettes(){

    //TODO: Save palettes created by user on local storage
    const [selectedPalette,setSelectedPalette] = useState<string[]>(['black','red','blue','purple','white','green','aliceblue','orange']);


    return <div className = "palettes">
        <div>PALETTES</div>
         <Palette palette={selectedPalette}></Palette>
    </div>

}