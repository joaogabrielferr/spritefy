import { create } from "zustand";
import { Store, toolsType } from "../types";




export const store = create<Store>()((set)=>({
    selectedTool : 'pencil',
    selectedColor : 'black',
    penSize : 1,
    previousPenSize : 1,
    setSelectedColor : (color : string) => set(()=> ({selectedColor : color})),
    setSelectedTool : (tool : toolsType) => set(()=> ({selectedTool : tool})),
    setPenSize : (size : number) => set(() => ({penSize : size})),
    setPreviousPenSize : (size : number) => set(() => ({previousPenSize : size})),
}));