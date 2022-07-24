import { ScriptProps } from "next/script";
import { createContext, FC, ReactNode, useCallback, useContext, useMemo, useRef, useState } from "react";

const AppContext = createContext(undefined)

export interface IAppContextProviderProps {
    children: ReactNode
  }

export const AppProvider: FC<ScriptProps> = ({ children }: IAppContextProviderProps) => {
    const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true)
    const [sidebarWidth, setSidebarWidth] = useState<any>(0)
    let sidebarWidthMemo = useRef(sidebarWidth)
    let sidebarUserToggleOpen = useRef(true)

    const handleToggleSidebar = useCallback(
      () => {
        if (leftSidebarOpen) {
          sidebarWidthMemo.current = sidebarWidth
          setSidebarWidth(0)
        } else {
          if (sidebarWidthMemo.current == 0 || window.innerWidth < 420) {
            setSidebarWidth("100%")
          } else if (window.innerWidth < 768) {
            setSidebarWidth("35vw")
          } else {
            setSidebarWidth(sidebarWidthMemo.current)
          }
        }
        sidebarUserToggleOpen.current = !sidebarUserToggleOpen.current
        setLeftSidebarOpen(!leftSidebarOpen)

      },
      [leftSidebarOpen, sidebarWidth],
    )

    const value = useMemo(
        () => ({
          leftSidebarOpen,
          setLeftSidebarOpen,
          sidebarWidth,
          setSidebarWidth,
          handleToggleSidebar
        }),
        [leftSidebarOpen, sidebarWidth, handleToggleSidebar],
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