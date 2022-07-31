import { ScriptProps } from "next/script";
import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
export interface IAppContextProviderProps {
    children: ReactNode
}

export const mobileViewWidth = 576

const AppContext = createContext(undefined)

// const getInitialWidth = () => {
//   const hasWindow = typeof window !== 'undefined'
//   if (hasWindow && window.innerWidth < mobileViewWidth) {
//     console.log('hasWindow', hasWindow)
//     return "15rem"
//   }
//   return 0
// }

// const initialWindowWidth = typeof window !== 'undefined' ? window.innerWidth : 0

export const AppProvider: FC<ScriptProps> = ({ children }: IAppContextProviderProps) => {
    const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true)
    const [sidebarWidth, setSidebarWidth] = useState<any>("15rem")
    const [isMobileView, setIsMobileView] = useState<boolean>(false)
    let sidebarWidthMemo = useRef(sidebarWidth)

    // Memo previous sidebarWidth and setSidebarWidth when toggle on
    const handleToggleSidebar = useCallback(() => {
        if (leftSidebarOpen) {
          sidebarWidthMemo.current = sidebarWidth
          setSidebarWidth(0)
          setLeftSidebarOpen(false)
        } else {
          if (isMobileView) {
            setSidebarWidth("100%")
          } else if (sidebarWidthMemo.current !== 0) {
            setSidebarWidth(sidebarWidthMemo.current)
          } else {
            setSidebarWidth("15rem")
          }
          setLeftSidebarOpen(true)
        }

      },
      [isMobileView, leftSidebarOpen, sidebarWidth],
    )

    const handleWindowViewport = useCallback(() => {
      if (window.innerWidth < mobileViewWidth) {
        setIsMobileView(true)
      } else {
        setIsMobileView(false)
      }
    }, [])

    // Set initial isMobileView for only once
    useEffect(() => {
      handleWindowViewport()
    }, [])

    // Handle isMobile from window width
    useEffect(() => {
      window.addEventListener("resize", handleWindowViewport)
      return () => {
        window.removeEventListener("resize", handleWindowViewport)
      }
    }, [handleWindowViewport])

    const value = useMemo(
        () => ({
          leftSidebarOpen,
          setLeftSidebarOpen,
          sidebarWidth,
          setSidebarWidth,
          handleToggleSidebar,
          isMobileView
        }),
        [leftSidebarOpen, sidebarWidth, handleToggleSidebar, isMobileView],
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