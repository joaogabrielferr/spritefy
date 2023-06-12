import { create } from "zustand";
import { toolsType } from "../types";
import { BACKGROUND_CANVAS, TOP_CANVAS } from "../utils/constants";


export type StoreType = {
    selectedTool : toolsType;
    selectedColor : string;
    penSize : number;
    oneToOneRatioElipse : boolean;
    oneToOneRatioRectangle : boolean;
    xMirror : boolean;
    yMirror : boolean;

    layers : string[];

    currentLayer : string;

    setSelectedColor : (color : string) => void,
    setSelectedTool : (tool : toolsType) => void,
    setPenSize : (size : number) => void,
    toogleOneToOneRatioElipse : () => void,
    toogleOneToOneRatioRectangle : () => void,
    toogleXMirror : () => void,
    toogleYMirror : () => void,
    setLayers : (newLayers : string[]) => void,
    setCurrentLayer : (newLayer : string) => void
}


export const store = create<StoreType>()((set)=>({
    selectedTool : 'pencil',
    selectedColor : 'black',
    penSize : 1,
    oneToOneRatioElipse : false,
    oneToOneRatioRectangle : false,
    xMirror : false,
    yMirror : false,
    layers : [TOP_CANVAS,'canvas1',BACKGROUND_CANVAS],
    currentLayer : 'canvas1',
    setSelectedColor : (color : string) => set(()=> ({selectedColor : color})),
    setSelectedTool : (tool : toolsType) => set(()=> ({selectedTool : tool})),
    setPenSize : (size : number) => set(() => ({penSize : size,previousPenSize : size})),
    toogleOneToOneRatioElipse : () => set((state : StoreType)=> ({oneToOneRatioElipse : !state.oneToOneRatioElipse}) ),
    toogleOneToOneRatioRectangle : () => set((state : StoreType)=> ({oneToOneRatioRectangle : !state.oneToOneRatioRectangle}) ),
    toogleXMirror : () => set((state : StoreType)=>({xMirror : !state.xMirror})),
    toogleYMirror : () => set((state : StoreType)=>({yMirror : !state.yMirror})),
    setLayers : (newLayers : string[]) => set(()=>({layers : newLayers})),
    setCurrentLayer : (newLayer : string) => set(()=>({currentLayer : newLayer})),
}));