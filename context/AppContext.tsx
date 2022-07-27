import { ScriptProps } from "next/script";
import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const AppContext = createContext(undefined)

export interface IAppContextProviderProps {
    children: ReactNode
  }

export const mobileViewWidth = 576

// const initialWindowWidth = typeof window !== 'undefined' ? window.innerWidth : 0

export const AppProvider: FC<ScriptProps> = ({ children }: IAppContextProviderProps) => {
    const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true)
    const [sidebarWidth, setSidebarWidth] = useState<any>(0)
    const [isMobileView, setIsMobileView] = useState<boolean>(false)
    let sidebarWidthMemo = useRef(sidebarWidth)

    // Memo previous sidebarWidth and setSidebarWidth when toggle on
    const handleToggleSidebar = useCallback(
      () => {
        console.log("Click Toggle Sidebar")
        if (leftSidebarOpen) {
          sidebarWidthMemo.current = sidebarWidth
          setSidebarWidth(0)
          setLeftSidebarOpen(false)
        } else {
          setLeftSidebarOpen(true)
          //
          if (sidebarWidthMemo.current == 0 || isMobileView) {
            setSidebarWidth("100%")
          } else {
            setSidebarWidth(sidebarWidthMemo.current)
          }
        }

      },
      [isMobileView, leftSidebarOpen, sidebarWidth],
    )

    const handleWindowViewport = useCallback(() => {
      console.log("Handle mobile viewport")
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