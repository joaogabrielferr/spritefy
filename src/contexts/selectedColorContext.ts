import { createContext } from "react";


export const selectedColorContext = createContext<{ selectedColor: string; setSelectedColor: React.Dispatch<React.SetStateAction<string>>; }>({
    selectedColor : 'black', setSelectedColor : () => {/**/}
}
);