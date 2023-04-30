import { ScriptProps } from "next/script";
import React, { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Workspace, WorkspaceData } from "../types/workspace";
import { Page } from "../types/page";

interface IAppContextProviderProps {
    children: ReactNode
}

interface IAppContext {
    leftSidebarOpen: boolean
    setLeftSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    sidebarWidth: string | number
    setSidebarWidth: React.Dispatch<React.SetStateAction<any>>
    // eslint-disable-next-line no-unused-vars
    handleToggleSidebar: (e: React.MouseEvent) => void
    isMobileView: boolean
    isDragging: boolean
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>
    workspaces: Workspace[]
    setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>
    currentWorkspaceId: string
    setCurrentWorkspaceId: React.Dispatch<React.SetStateAction<string>>
    currentWorkspaceData: WorkspaceData
    setCurrentWorkspaceData: React.Dispatch<React.SetStateAction<WorkspaceData>>
    currentPage: Page
    setCurrentPage: React.Dispatch<React.SetStateAction<Page>>
}

export const MOBILE_VIEW_WIDTH = 576

const AppContext = createContext<IAppContext>(undefined)

export const AppProvider: FC<ScriptProps> = ({ children }: IAppContextProviderProps) => {

    // Sidebar state
    const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true)
    const [sidebarWidth, setSidebarWidth] = useState<string | number>("15rem")
    const [isMobileView, setIsMobileView] = useState<boolean>(false)
    const sidebarWidthMemo = useRef<string | number>(sidebarWidth) // Memo previous sidebarWidth
    const [isDragging, setIsDragging] = useState<boolean>(false)

    // workspace state
    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>("")
    const [currentWorkspaceData, setCurrentWorkspaceData] = useState<WorkspaceData>(null)
    const [currentPage, setCurrentPage] = useState<Page>(null)

    // Use Context to pass down functions to sidebar and topbar components
    const handleToggleSidebar = useCallback((e: React.MouseEvent) => {
      // stop click event
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
      if (window.innerWidth < MOBILE_VIEW_WIDTH) {
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
