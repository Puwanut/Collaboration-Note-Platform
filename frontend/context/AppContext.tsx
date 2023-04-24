import { ScriptProps } from "next/script";
import React, { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export interface IAppContextProviderProps {
    children: ReactNode
}

export const mobileViewWidth = 576

const AppContext = createContext(undefined)

export const AppProvider: FC<ScriptProps> = ({ children }: IAppContextProviderProps) => {

    // Sidebar state
    const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true)
    const [sidebarWidth, setSidebarWidth] = useState<any>("15rem")
    const [isMobileView, setIsMobileView] = useState<boolean>(false)
    const sidebarWidthMemo = useRef(sidebarWidth) // Memo previous sidebarWidth
    const [isDragging, setIsDragging] = useState<boolean>(false)

    // workspace state
    const [workspaces, setWorkspaces] = useState<any>([])
    const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>("")
    const [currentWorkspaceData, setCurrentWorkspaceData] = useState<any>(null)
    const [currentPage, setCurrentPage] = useState<any>(null)

    // Use Context to pass down functions to sidebar and topbar components
    const handleToggleSidebar = useCallback((e: React.MouseEvent) => {
      e.stopPropagation()
        if (leftSidebarOpen) { // Close sidebar
          sidebarWidthMemo.current = sidebarWidth // Memo previous sidebarWidth
          setSidebarWidth(0)
          setLeftSidebarOpen(false)
        } else { // Open sidebar
          if (isMobileView) {
            setSidebarWidth("100%")
          } else if (sidebarWidthMemo.current !== 0) { // If sidebarWidthMemo is not 0, set sidebarWidth to previous sidebarWidth
            setSidebarWidth(sidebarWidthMemo.current)
          } else { // If sidebarWidthMemo is 0, set sidebarWidth to default
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
          isMobileView,
          isDragging,
          setIsDragging,
          workspaces,
          setWorkspaces,
          currentWorkspaceId,
          setCurrentWorkspaceId,
          currentWorkspaceData,
          setCurrentWorkspaceData,
          currentPage,
          setCurrentPage
        }),
        [leftSidebarOpen, sidebarWidth, handleToggleSidebar, isMobileView, isDragging, workspaces, currentWorkspaceId, currentWorkspaceData, currentPage],
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
