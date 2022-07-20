import { ScriptProps } from "next/script";
import { createContext, FC, ReactNode, useContext, useMemo, useState } from "react";

const AppContext = createContext(undefined)

export interface IAppContextProviderProps {
    children: ReactNode
  }

export const AppProvider: FC<ScriptProps> = ({ children }: IAppContextProviderProps) => {
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)

    const value = useMemo(
        () => ({
          leftSidebarOpen,
          setLeftSidebarOpen,
        }),
        [leftSidebarOpen],
      )

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext)
}