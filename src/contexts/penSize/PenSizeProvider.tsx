import { useState } from "react";
import { penSizeContext } from "./penSizeContext";

export function PenSizeProvider({children} : {children : React.ReactNode}){

    const [penSize,setPenSize] = useState(1);

    return <penSizeContext.Provider value={{penSize,setPenSize}}>
        {children}
    </penSizeContext.Provider>

}