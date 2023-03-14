import { faAngleDoubleLeft, faClock, faGear, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react"
import { useAppContext } from "../context/AppContext"

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

    const menus = [
        { title: "Quick Find", icon: <FontAwesomeIcon icon={faSearch}/> },
        { title: "All Updates", icon: <FontAwesomeIcon icon={faClock}/> },
        { title: "Settings & Members", icon: <FontAwesomeIcon icon={faGear}/> },
        // { title: "Quick Find", icon: <FontAwesomeIcon icon={faSearch}/> },
        // { title: "All Updates", icon: <FontAwesomeIcon icon={faClock}/> },
        // { title: "Settings & Members", icon: <FontAwesomeIcon icon={faGear}/> },
        // { title: "Quick Find", icon: <FontAwesomeIcon icon={faSearch}/> },
        // { title: "All Updates", icon: <FontAwesomeIcon icon={faClock}/> },
        // { title: "Settings & Members", icon: <FontAwesomeIcon icon={faGear}/> },
        // { title: "Quick Find", icon: <FontAwesomeIcon icon={faSearch}/> },
        // { title: "All Updates", icon: <FontAwesomeIcon icon={faClock}/> },
        // { title: "Settings & Members", icon: <FontAwesomeIcon icon={faGear}/> },
        // { title: "Quick Find", icon: <FontAwesomeIcon icon={faSearch}/> },
        // { title: "All Updates", icon: <FontAwesomeIcon icon={faClock}/> },
        // { title: "Settings & Members", icon: <FontAwesomeIcon icon={faGear}/> },
        // { title: "Quick Find", icon: <FontAwesomeIcon icon={faSearch}/> },
        // { title: "All Updates", icon: <FontAwesomeIcon icon={faClock}/> },
        // { title: "Settings & Members", icon: <FontAwesomeIcon icon={faGear}/> },
        // { title: "Quick Find", icon: <FontAwesomeIcon icon={faSearch}/> },
        // { title: "All Updates", icon: <FontAwesomeIcon icon={faClock}/> },
        // { title: "Settings & Members", icon: <FontAwesomeIcon icon={faGear}/> },
        // { title: "Quick Find", icon: <FontAwesomeIcon icon={faSearch}/> },
        // { title: "All Updates", icon: <FontAwesomeIcon icon={faClock}/> },
        // { title: "Settings & Members", icon: <FontAwesomeIcon icon={faGear}/> },
        // { title: "Quick Find", icon: <FontAwesomeIcon icon={faSearch}/> },
        // { title: "All Updates", icon: <FontAwesomeIcon icon={faClock}/> },
        // { title: "Settings & Members", icon: <FontAwesomeIcon icon={faGear}/> },
        // { title: "Quick Find", icon: <FontAwesomeIcon icon={faSearch}/> },
        // { title: "All Updates", icon: <FontAwesomeIcon icon={faClock}/> },
        // { title: "Settings & Members", icon: <FontAwesomeIcon icon={faGear}/> },
    ]

    // const [favNotes, setFavNotes] = useState<ItemType[]>([
    //     { id: 1, name: "Workbook 1"},
    //     { id: 2, name: "Workbook 2"},
    //     { id: 3, name: "Workbook 3"},
    //     { id: 4, name: "Workbook 4"},
    //     { id: 5, name: "Workbook 5"}
    // ])

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
        <div className={`xs:block fixed xs:relative xs:max-w-fit h-screen bg-stone-100 z-20 overflow-x-hidden whitespace-nowrap
            ${!sidebarLoaded && `hidden`}
            ${sidebarOpenDone && `xs:min-w-[10rem]`}
            ${!isResizing && `duration-${transitionDuration}`}
            `}
            ref={sidebarRef}
            onMouseDown={(e) => e.preventDefault()}
            style={{ width:  sidebarWidth }}
            >

            {/* Workspace Title */}
            <div className={`flex gap-x-3 px-3 py-3 hover:bg-stone-200`}>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/square.svg"
                    className={`cursor-pointer w-5 duration-500 ${!leftSidebarOpen && "rotate-[-360deg] scale-0"}`}
                    alt="Logo"
                />

                <h1 className={`text-slate-700 origin-left font-medium duration-300 grow
                    text-ellipsis overflow-hidden
                 ${!leftSidebarOpen && "scale-0"}
                 `}>
                    Puwanut Janmee&apos;s Workspace {/* $apos; = ' (single quote) */}
                </h1>

                <FontAwesomeIcon icon={faAngleDoubleLeft}
                    className={`text-stone-400 cursor-pointer p-1 hover:bg-stone-300 duration-300
                    ${!leftSidebarOpen && "rotate-180"}`}
                    onClick={handleToggleSidebar}
                />
            </div>

            {/* Menu */}
            <ul className="mb-5" id='items'>
                {menus.map((menu, index) => (
                    <li key={index}
                        className={`
                        text-stone-400 flex items-center gap-x-4 cursor-pointer duration-300
                        px-4 py-1 font-medium hover:bg-stone-200 origin-left
                        ${!leftSidebarOpen && 'scale-0'}
                        ${isMobileView ? 'text-base' : 'text-sm'}
                        `}>
                        <span>{menu.icon}</span>
                        <span className="overflow-hidden whitespace-nowrap overflow-ellipsis">
                            {menu.title}
                        </span>
                    </li>
                ))}
            </ul>

            {/* Favorite Notes */}


            {/* Slider */}
            <div className={`top-0 w-1 right-0 absolute h-screen
            cursor-col-resize resize-x border-2 border-transparent bg-stone-100
            hover:border-stone-300 ${(!leftSidebarOpen || isMobileView) && 'hidden'}`}
                onMouseDown={startResizing}>
            </div>
        </div>
    )
}

export default Sidebar;
