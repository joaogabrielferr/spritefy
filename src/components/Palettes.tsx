import { ChangeEvent} from "react";
import './palettes.css';
import { PaletteType, Store } from "../types";
import { store } from "../store";


const palettes = [
{
    name : 'solid colors',
    colors: ['black','silver','gray','white','maroon','red','purple','fuchsia','green','lime','olive','yellow','navy','blue','teal','aqua'],
    id : 1
},{
    name : 'skin colors',
    colors: ['#22140e','#3b2219','#a16e4b','#d4aa78','#e6bc98','#ffe7d1'],
    id : 2
},
{
    name : 'water',
    colors: ['#0f5e9c','#2389da','#1ca3ec','#5abcd8','#74ccf4'],
    id : 3
},
{
    name : 'fire',
    colors: ['#ff0000','#ff5a00','#ff9a00','#ffce00','#ffe808'],
    id : 4
},
{
    name : 'grass',
    colors: ['#234d20','#36802d','#77ab59','#c9df8a','#f0f7da'],
    id : 5
},
{
    name : 'sand',
    colors: ['#b38b67','#c89f73','#d9b380','#f1cc8f','#fbe7a1'],
    id : 6
},
] as PaletteType[]

export function Palettes(){


    //TODO: Save palettes created by user on local storage
    // const [selectedPalette,setSelectedPalette] = useState<PaletteType>(palettes[0]);

    // const {setSelectedColor} = useContext(selectedColorContext);

    const setSelectedColor = store((state : Store) => state.setSelectedColor);

    function handleChangePalette(e : ChangeEvent<HTMLSelectElement>){
        // setSelectedPalette(palettes.find((palette)=>+palette.id === +e.target.value)!)
    }

    return <div className = "palettes">
        <div className = "palettesTitle">COLOR PALETTES</div>
         {/* <div className = "selectPaletteWrapper">
            <select  className = "selectPalette" name="" id="" onChange={handleChangePalette}>
                {
                    palettes.map((palette)=> <option key = {palette.id} value = {palette.id}>{palette.name}</option>)
                }
            </select>
         </div> */}
         {/* <Palette palette={selectedPalette}></Palette> */}
         {
            palettes.map((palette)=>
            <div key = {palette.id} style = {{marginTop:'5px'}}>
                {palette.name.toLocaleUpperCase()}
                <div className = "palette">
                {
                    palette.colors.map((color)=><button className = "paletteButton" style = {{backgroundColor:color}} key = {color} onClick = {()=>setSelectedColor(color)}></button>)
                }
            </div>
        </div>
        )
         }
    </div>

}