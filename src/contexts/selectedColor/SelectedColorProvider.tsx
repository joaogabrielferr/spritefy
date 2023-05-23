import { useState } from "react";
import { selectedColorContext } from "./selectedColorContext";




export function SelectedColorProvider({children} : {children : React.ReactNode}) : JSX.Element{

    const [selectedColor,setSelectedColor] = useState<string>('black');

    return <selectedColorContext.Provider value = {{selectedColor,setSelectedColor}}>
            {children}
           </selectedColorContext.Provider>
    
    
}