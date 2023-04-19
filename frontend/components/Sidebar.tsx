import { faAngleDoubleLeft, faClock, faFileLines, faGear, faPlus, faPlusCircle, faSearch, faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from "react"
import { useAppContext } from "../context/AppContext"
import { useOverlayContext } from "../context/OverlayContext"
import { Tooltip } from "react-tooltip"
import Link from "next/link"

const Sidebar = () => {

    const appcontext = useAppContext()
    const {leftSidebarOpen, setLeftSidebarOpen} = appcontext
    const {sidebarWidth, setSidebarWidth} = appcontext
    const {handleToggleSidebar} = appcontext
    const sidebarRef: MutableRefObject<HTMLDivElement> = useRef(null);
    const [isResizing, setIsResizing] = useState<boolean>(false)
    const {isMobileView} = appcontext
    const [sidebarOpenDone, setSidebarOpenDone] = useState<boolean>(false)
    const [sidebarLoaded, setSidebarLoaded] = useState<boolean>(false)
    const transitionDuration = 300 // ms

    const { setOverlayName } = useOverlayContext()
    const { workspaces, currentWorkspaceData, currentPage } = appcontext

    const menus = [
        { title: "Search", icon: <FontAwesomeIcon icon={faSearch} className="min-w-4"/> },
        { title: "Updates", icon: <FontAwesomeIcon icon={faClock} className="min-w-4"/> },
        { title: "Settings & Members", icon: <FontAwesomeIcon icon={faGear} className="min-w-4"/> },
        { title: "New page", icon: <FontAwesomeIcon icon={faPlusCircle} className="min-w-4"/>, className: "text-neutral-600" },
    ]

    const handleAutoResize = useCallback(() => {
        if (isMobileView) {
            setLeftSidebarOpen(false)
            setSidebarWidth(0)
        } else {
            setLeftSidebarOpen(true)
            setSidebarWidth("15rem")
        }
    }, [isMobileView])

    // Handle toggle class min-w-[10rem] when open sidebar (delay)
    const handleSidebarMinWidth = useCallback(() => {
        if (leftSidebarOpen) {
            setTimeout(() => setSidebarOpenDone(true), transitionDuration)
        } else {
            setSidebarOpenDone(false)
        }
    }, [leftSidebarOpen])

    /* Function Group for Handle Drag Sidebar Slider */
    const startResizing = useCallback(() => {
        setIsResizing(true);
      }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
        setSidebarWidth(sidebarRef.current.getBoundingClientRect().width)
    }, [setSidebarWidth]);

    const resize = useCallback((mouseMoveEvent: MouseEvent) => {
        if (isResizing) {
            setSidebarWidth(mouseMoveEvent.clientX - sidebarRef.current.getBoundingClientRect().x)
        }
    },[isResizing, setSidebarWidth])
    /* Function Group for Handle Drag Sidebar Slider */

    // Handle Toggle Sidebar between mobile as desktop
    useEffect(() => {
        handleAutoResize()
    }, [handleAutoResize])

    // Handle toggle class min-w-[10rem] when open sidebar
    useEffect(() => {
        handleSidebarMinWidth()
    }, [handleSidebarMinWidth])

    // If mobileview in first time, setLoaded to true when sidebar is closed
    useEffect(() => {
        if (isMobileView) {
            setSidebarLoaded(true)
        }
    }, [isMobileView])

    // Handle Resizeable Sidebar
    useEffect(() => {
        window.addEventListener("mousemove", resize)
        window.addEventListener("mouseup", stopResizing)

        return () => {
            window.removeEventListener("mousemove", resize)
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing])

    return (
        <div className={`xs:block fixed left-0 xs:relative xs:max-w-fit flex-none h-screen bg-neutral-50 z-20 overflow-hidden whitespace-nowrap group/sidebar
            ${!sidebarLoaded && `hidden`}
            ${sidebarOpenDone && `xs:min-w-[10rem]`}
            ${!isResizing && `duration-${transitionDuration}`}
            `}
            ref={sidebarRef}
            onMouseDown={(e) => e.preventDefault()}
            style={{ width:  sidebarWidth }}
            >

            {/* Workspace Title */}
            <div
                id="workspace-title"
                className={`flex gap-x-3 px-3 py-3 hover:cursor-pointer hover:bg-stone-200`}
                onClick={() => setOverlayName("workspace")}
            >

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/square.svg"
                    className={`cursor-pointer w-5 duration-500 ${!leftSidebarOpen && "rotate-[-360deg] scale-0"}`}
                    alt="Logo"
                />

                <h1 className={`text-slate-700 origin-left font-medium duration-300 grow
                    text-ellipsis overflow-hidden select-none
                 ${!leftSidebarOpen && "scale-0"}
                 `}>
                    {workspaces[0]?.name}
                </h1>

                <FontAwesomeIcon icon={faAngleDoubleLeft}
                    id="toggle-sidebar"
                    className={`text-stone-400 cursor-pointer p-1 hover:bg-stone-300 duration-300
                    ${!leftSidebarOpen && "rotate-180"}`}
                    onClick={e => handleToggleSidebar(e)}
                />
            </div>

            <div className="p-1">
                {/* Menu */}
                <ul className="mb-5">
                    {menus.map((menu, index) => (
                        <li key={index}
                            className={`
                            flex text-neutral-400 rounded-md items-center gap-x-3 cursor-pointer duration-200
                            px-3 py-1 font-medium hover:bg-neutral-200/70 origin-left ${menu.className}
                            ${!leftSidebarOpen && 'scale-0'}
                            ${isMobileView ? 'text-base' : 'text-sm'}
                            `}>
                            {menu.icon}
                            <span className="overflow-hidden whitespace-nowrap overflow-ellipsis">
                                {menu.title}
                            </span>
                        </li>
                    ))}
                </ul>

                <div className="overflow-y-auto mt-6">
                    {/* Favorite Pages */}
                    <div className="">
                        <h3 className={`text-neutral-400 text-sm px-3 mb-1`} >
                            Favorites
                        </h3>
                        <ul>
                            <li className={`flex text-neutral-400 items-center gap-x-3 cursor-pointer duration-200
                                px-3 py-1 font-medium hover:bg-neutral-200/70 origin-left
                                ${!leftSidebarOpen && 'scale-0'}
                                ${isMobileView ? 'text-base' : 'text-sm'}
                                `}>
                                <FontAwesomeIcon icon={faStar} className="min-w-4" />
                                <span className="overflow-hidden whitespace-nowrap overflow-ellipsis">
                                    Note 1
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Private Pages */}
                    <div className="mt-6">
                        <div className="flex justify-between mr-2">
                            <h3 className={`text-neutral-400 text-sm px-3 mb-1`} >
                                Private
                            </h3>
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="opacity-0 group-hover/sidebar:opacity-100 transition text-neutral-400 p-1 text-sm rounded-md hover:bg-neutral-200 hover:cursor-pointer"
                                onClick={() => console.log("add page")}
                                data-tooltip-id="tooltip-sidebar-add-page"
                            />
                            <Tooltip id="tooltip-sidebar-add-page" noArrow className="z-20">
                                <span>Add a Page</span>
                            </Tooltip>
                        </div>
                        <ul>
                            {currentWorkspaceData?.pages?.map((page) => (
                            <Link key={page.id} href={page.id} className={`flex text-neutral-400 items-center gap-x-3 cursor-pointer duration-200
                                px-3 py-1 font-medium hover:bg-neutral-200/70 origin-left
                                ${!leftSidebarOpen && 'scale-0'}
                                ${isMobileView ? 'text-base' : 'text-sm'}
                                ${page.id === currentPage?.id && 'bg-neutral-200/70'}
                                `} >
                                <FontAwesomeIcon icon={faFileLines} className="min-w-4" />
                                <span className="overflow-hidden whitespace-nowrap overflow-ellipsis">
                                    {page.title}
                                </span>
                            </Link>
                            ))}
                        </ul>
                    </div>

                </div>

            </div>




            {/* Slider */}
            <div className={`top-0 w-1 right-0 absolute h-screen
            cursor-col-resize resize-x border-2 border-transparent bg-neutral-50
            hover:border-neutral-200 ${(!leftSidebarOpen || isMobileView) && 'hidden'}`}
                onMouseDown={startResizing}>
            </div>
        </div>
    )
}

export default Sidebar;
