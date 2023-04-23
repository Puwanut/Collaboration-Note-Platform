import { faAngleDoubleLeft, faClock, faFileLines, faGear, faPlus, faPlusCircle, faSearch, faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from "react"
import { useAppContext } from "../context/AppContext"
import { useOverlayContext } from "../context/OverlayContext"
import { Tooltip } from "react-tooltip"
import Link from "next/link"
import { decode } from "entities"
import Image from "next/image"
import { v4 as uuidv4 } from "uuid"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

const menus = [
        { title: "Search", icon: <FontAwesomeIcon icon={faSearch} className="menu-sidebar-icon"/> },
        { title: "Updates", icon: <FontAwesomeIcon icon={faClock} className="menu-sidebar-icon"/> },
        { title: "Settings & Members", icon: <FontAwesomeIcon icon={faGear} className="menu-sidebar-icon"/> },
        { title: "New page", icon: <FontAwesomeIcon icon={faPlusCircle} className="menu-sidebar-icon"/> },
    ]

const Sidebar = () => {

    const { data: session } = useSession()
    const router = useRouter()
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
    const { currentWorkspace, currentWorkspaceData, currentPage } = appcontext

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

    const newPageHandler = async () => {
        // create new page
        const newPage = {
            id: uuidv4(),
            title: "",
            blocks: []
        }
        const createNewpage = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workspaces/${currentWorkspaceData.id}/pages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user.accessToken}`
            },
            body: JSON.stringify(newPage)
        }).then(res => res.json())

        router.push(`/${newPage.id}`)
        console.log(createNewpage)
    }

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
            ${sidebarOpenDone && `xs:min-w-[12rem]`}
            ${!isResizing && `duration-${transitionDuration}`}
            `}
            ref={sidebarRef}
            onMouseDown={(e) => e.preventDefault()}
            style={{ width:  sidebarWidth }}
            >

            {/* Workspace Title */}
            <section
                id="workspace-title"
                className={`flex gap-x-2 px-3 py-3 hover:cursor-pointer hover:bg-neutral-200`}
                onClick={() => setOverlayName("workspace")}
            >

                <div className="relative flex-none w-6 h-6">
                    <Image
                        src="/icons/notion_clone_logo.png"
                        className={`cursor-pointer w-5 duration-500 ${!leftSidebarOpen && "rotate-[-360deg] scale-0"}`}
                        alt="Logo"
                        fill
                        sizes="100%"
                    />
                </div>

                <h1 className={`text-slate-700 origin-left font-medium duration-300 grow text-overflow-ellipsis select-none
                    ${!leftSidebarOpen && "scale-0"}
                `}>
                    {currentWorkspace?.name}
                </h1>

                <FontAwesomeIcon
                    id="toggle-sidebar"
                    icon={faAngleDoubleLeft}
                    className={`text-neutral-400 cursor-pointer p-1 hover:bg-neutral-300 duration-300
                    ${!leftSidebarOpen && "rotate-180"}`}
                    onClick={e => handleToggleSidebar(e)}
                    data-tooltip-id="tooltip-sidebar-toggle"
                />
                <Tooltip id="tooltip-sidebar-toggle">
                    <span className="text-sm font-medium">
                        Close sidebar
                    </span>
                </Tooltip>
            </section>

            <section className="p-1">
                {/* Menu */}
                <ul className="mb-5">
                    {menus.map((menu, index) => (
                        <li key={index}
                            className={`menu-sidebar
                            ${menu.title === "New page" ? "text-neutral-600" : "text-neutral-400" }
                            ${!leftSidebarOpen && 'scale-0'}
                            ${isMobileView ? 'text-base' : 'text-sm'}
                            `}
                        >
                            {menu.icon}
                            <span className="text-overflow-ellipsis">
                                {menu.title}
                            </span>
                        </li>
                    ))}
                </ul>

                <div className="overflow-y-auto overflow-x-hidden mt-6">
                    {/* Favorite Pages */}
                    <div>
                        <h3 className={`text-neutral-400 px-3 mb-1 origin-left duration-200
                            ${!leftSidebarOpen && 'scale-0'}
                            ${isMobileView ? 'text-base' : 'text-sm'}
                        `} >
                            Favorites
                        </h3>
                        <ul>
                            <li className={`menu-sidebar text-neutral-400
                                ${!leftSidebarOpen && 'scale-0'}
                                ${isMobileView ? 'text-base' : 'text-sm'}
                                `}>
                                <FontAwesomeIcon icon={faStar} className="menu-sidebar-icon" />
                                <span className="text-overflow-ellipsis">
                                    Note 1
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Private Pages */}
                    <div className="mt-6">
                        <div className={`flex justify-between mr-2 origin-left duration-200
                             ${!leftSidebarOpen && 'scale-0'}
                             ${isMobileView ? 'text-base' : 'text-sm'}
                            `}
                        >
                            <h3 className="text-neutral-400 px-3 mb-1">
                                Private
                            </h3>
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="opacity-0 group-hover/sidebar:opacity-100 transition text-neutral-400 p-1 text-sm rounded-md hover:bg-neutral-200 hover:cursor-pointer"
                                onClick={newPageHandler}
                                data-tooltip-id="tooltip-sidebar-add-page"
                            />
                            <Tooltip id="tooltip-sidebar-add-page" noArrow className="z-20">
                                <span>Add a Page</span>
                            </Tooltip>
                        </div>
                        <ul>
                            {currentWorkspaceData?.pages?.map((page) => (
                            <Link key={page.id} href={page.id} className={`menu-sidebar text-neutral-400
                                ${!leftSidebarOpen && 'scale-0'}
                                ${isMobileView ? 'text-base' : 'text-sm'}
                                ${page.id === currentPage?.id && 'bg-neutral-200/70'}
                                `}
                            >
                                <FontAwesomeIcon icon={faFileLines} className="menu-sidebar-icon" />
                                <span className="text-overflow-ellipsis empty:before:content-[attr(data-placeholder)]" data-placeholder="Untitled">
                                    {/* Sync page title name when user edited */}
                                    {currentPage?.id === page.id ? decode(currentPage.title) : decode(page.title)}
                                </span>
                            </Link>
                            ))}
                        </ul>
                    </div>

                </div>

            </section>




            {/* Slider */}
            <div className={`top-0 w-1 right-0 absolute h-screen
                cursor-col-resize border-2 border-transparent bg-neutral-50
                hover:border-neutral-200 ${(!leftSidebarOpen || isMobileView) && 'hidden'}`}
                onMouseDown={startResizing}
            ></div>
        </div>
    )
}

export default Sidebar;
