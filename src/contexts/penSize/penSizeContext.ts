import { createContext } from "react";


export const penSizeContext = createContext<{penSize : number; setPenSize : React.Dispatch<React.SetStateAction<number>>;}>(
    {
        penSize : 1,
        setPenSize : () => {/* */}
    }
);