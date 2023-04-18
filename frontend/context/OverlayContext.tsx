import { ScriptProps } from "next/script";
import { createContext, FC, ReactNode, useContext, useState } from "react";


const OverlayContext = createContext(undefined)

interface IOverlayContextProviderProps {
    children: ReactNode
}

export interface Coordinate {
    x: number,
    y: number
}

export const OverlayProvider: FC<ScriptProps> = ({ children }: IOverlayContextProviderProps) => {
    const [overlayName, setOverlayName] = useState<string>("")

    return (
        <OverlayContext.Provider value={{overlayName, setOverlayName}}>
            {children}
        </OverlayContext.Provider>
    )
}

export function useOverlayContext() {
    return useContext(OverlayContext)
}
