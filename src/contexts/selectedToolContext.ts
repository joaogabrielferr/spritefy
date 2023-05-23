import { createContext } from "react";
import { toolsType } from "../types";

export const selectedToolContext = createContext<{selectedTool : toolsType; setSelectedTool : React.Dispatch<React.SetStateAction<toolsType>>;}>({
    selectedTool:'pencil',
    setSelectedTool : () => {/**/}
});