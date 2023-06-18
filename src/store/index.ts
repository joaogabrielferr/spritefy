import { create } from "zustand";
import { toolsType } from "../types";


export type StoreType = {
    selectedTool : toolsType;
    selectedColor : string;
    penSize : number;
    oneToOneRatioElipse : boolean;
    oneToOneRatioRectangle : boolean;
    xMirror : boolean;
    yMirror : boolean;
    framesList : string[]; //list of the names of all frames created
    currentFrame : string;
    backgroundTileSize : number;
    frameRate : number;

    setSelectedColor : (color : string) => void,
    setSelectedTool : (tool : toolsType) => void,
    setPenSize : (size : number) => void,
    toogleOneToOneRatioElipse : () => void,
    toogleOneToOneRatioRectangle : () => void,
    toogleXMirror : () => void,
    toogleYMirror : () => void,
    setCurrentFrame : (newLayer : string) => void,
    setFramesList : (newFrames : string[]) => void,
    setBackgroundTileSize : (newSize : number) => void,
    setFrameRate : (newFrameRate : number) => void,

}


export const store = create<StoreType>()((set)=>({
    selectedTool : 'pencil',
    selectedColor : 'black',
    penSize : 1,
    oneToOneRatioElipse : false,
    oneToOneRatioRectangle : false,
    xMirror : false,
    yMirror : false,
    framesList : ['frame1'],
    currentFrame : 'frame1',
    backgroundTileSize : 1,
    frameRate: 6,
    setSelectedColor : (color : string) => set(()=> ({selectedColor : color})),
    setSelectedTool : (tool : toolsType) => set(()=> ({selectedTool : tool})),
    setPenSize : (size : number) => set(() => ({penSize : size,previousPenSize : size})),
    toogleOneToOneRatioElipse : () => set((state : StoreType)=> ({oneToOneRatioElipse : !state.oneToOneRatioElipse}) ),
    toogleOneToOneRatioRectangle : () => set((state : StoreType)=> ({oneToOneRatioRectangle : !state.oneToOneRatioRectangle}) ),
    toogleXMirror : () => set((state : StoreType)=>({xMirror : !state.xMirror})),
    toogleYMirror : () => set((state : StoreType)=>({yMirror : !state.yMirror})),
    setCurrentFrame : (newFrame : string) => set(()=>({currentFrame : newFrame})),
    setFramesList : (newFrames : string[]) => set(() => ({framesList : newFrames})),
    setBackgroundTileSize : (newSize : number) => set(() => ({backgroundTileSize : newSize})),
    setFrameRate : (newFrameRate : number) => set(() => ({frameRate : newFrameRate})),

}));