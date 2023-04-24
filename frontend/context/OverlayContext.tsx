/* eslint-disable no-unused-vars */
import { ScriptProps } from "next/script";
import { createContext, FC, ReactNode, useContext, useState } from "react";
import { Coordinate } from "../types/coordinate";

interface IOverlayContextProviderProps {
    children: ReactNode
}

export enum OverlayType {
    workspaceSelector = "workspace-selector",
    pageTitleEditor = "page-title-editor",
    pageMenu = "page-menu",
}

interface IOverlay {
    name: OverlayType,
    coordinate?: Coordinate,
    properties?: Record<string, any>
}

interface IOverlayContext {
    overlay: IOverlay,
    setOverlay: (overlay: IOverlay) => void
}

const OverlayContext = createContext<IOverlayContext>(undefined)

export const OverlayProvider: FC<ScriptProps> = ({ children }: IOverlayContextProviderProps) => {
    const [overlay, setOverlay] = useState<IOverlay>(null)

    return (
        <OverlayContext.Provider value={{overlay, setOverlay}}>
            {children}
        </OverlayContext.Provider>
    )
}

export function useOverlayContext() {
    return useContext(OverlayContext)
}

