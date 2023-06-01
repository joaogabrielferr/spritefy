import { create } from "zustand";
import { toolsType } from "../types";


export type StoreType = {
    selectedTool : toolsType;
    selectedColor : string;
    penSize : number;
    oneToOneRatioElipse : boolean;
    oneToOneRatioRectangle : boolean;
    setSelectedColor : (color : string) => void,
    setSelectedTool : (tool : toolsType) => void,
    setPenSize : (size : number) => void,
    toogleOneToOneRatioElipse : () => void
    toogleOneToOneRatioRectangle : () => void
}


export const store = create<StoreType>()((set)=>({
    selectedTool : 'pencil',
    selectedColor : 'black',
    penSize : 1,
    oneToOneRatioElipse : false,
    oneToOneRatioRectangle : false,
    setSelectedColor : (color : string) => set(()=> ({selectedColor : color})),
    setSelectedTool : (tool : toolsType) => set(()=> ({selectedTool : tool})),
    setPenSize : (size : number) => set(() => ({penSize : size,previousPenSize : size})),
    toogleOneToOneRatioElipse : () => set((state : StoreType)=> ({oneToOneRatioElipse : !state.oneToOneRatioElipse}) ),
    toogleOneToOneRatioRectangle : () => set((state : StoreType)=> ({oneToOneRatioRectangle : !state.oneToOneRatioRectangle}) )
}));