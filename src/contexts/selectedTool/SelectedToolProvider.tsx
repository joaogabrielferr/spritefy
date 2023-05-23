import { useState } from "react";
import { toolsType } from "../../types";
import { selectedToolContext } from "../selectedTool/selectedToolContext";

export function SelectedToolProvider({children} : {children : React.ReactNode}){

    const [selectedTool,setSelectedTool] = useState<toolsType>('pencil');
    
    return <selectedToolContext.Provider value = {{selectedTool,setSelectedTool}}>
        {children}
    </selectedToolContext.Provider>


}