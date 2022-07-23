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
    // const [sidebarWidth, setSidebarWidth] = useState<any>("auto")
    const [isResizing, setIsResizing] = useState<boolean>(false)


    const menus = [
        { title: "Quick Find", icon: <FontAwesomeIcon icon={faSearch}/> },
        { title: "All Updates", icon: <FontAwesomeIcon icon={faClock}/> },
        { title: "Settings & Members", icon: <FontAwesomeIcon icon={faGear}/> }
    ]

    // const [favNotes, setFavNotes] = useState<ItemType[]>([
    //     { id: 1, name: "Workbook 1"},
    //     { id: 2, name: "Workbook 2"},
    //     { id: 3, name: "Workbook 3"},
    //     { id: 4, name: "Workbook 4"},
    //     { id: 5, name: "Workbook 5"}
    // ])


    // Auto close menu when on mobile
    const handleAutoResize = useCallback(() => {
        if (window.innerWidth < 768) {
            setLeftSidebarOpen(false)
            setSidebarWidth(0)
        }
    }, [setLeftSidebarOpen, setSidebarWidth])

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

    useEffect(() => {
        window.addEventListener("resize", handleAutoResize)
        window.addEventListener("mousemove", resize)
        window.addEventListener("mouseup", stopResizing)


        return () => {
            window.removeEventListener("resize", handleAutoResize)
            window.removeEventListener("mousemove", resize)
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [handleAutoResize, leftSidebarOpen, resize, setSidebarWidth, stopResizing])

    return (
        <div className={`h-screen bg-stone-100 relative ${leftSidebarOpen ? `max-w-fit` : ''}
            ${isResizing ? `duration-[0]` : `duration-300`}
        `}
            ref={sidebarRef}
            onMouseDown={(e) => e.preventDefault()}
            style={{ width:  sidebarWidth }}
            >

            {/* Workspace Title */}
            <div className={`flex gap-x-3 items-center px-3 py-3 hover:bg-stone-200 ${!leftSidebarOpen && `scale-0`} `}>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/square.svg"
                    className={`cursor-pointer w-5 duration-500 ${leftSidebarOpen && "rotate-[360deg]"}`}
                    alt="Logo"
                />

                <h1 className={`text-slate-700 origin-left font-medium duration-300
                overflow-hidden whitespace-nowrap overflow-ellipsis
                 ${!leftSidebarOpen && "scale-0"}`}>
                    Puwanut&apos;s Workspace {/* $apos; = ' (single quote) */}
                </h1>

                <FontAwesomeIcon icon={faAngleDoubleLeft}
                    className={`text-stone-400 cursor-pointer p-1 hover:bg-stone-300 duration-300
                    ${!leftSidebarOpen && "rotate-180"}`}
                    onClick={handleToggleSidebar}
                />
            </div>

            {/* Menu */}
            <ul>
                {menus.map((menu, index) => (
                    <li key={index}
                        className={`
                        text-stone-400 flex items-center gap-x-4 cursor-pointer duration-200
                        px-4 py-1 font-medium text-sm hover:bg-stone-200 origin-left ${!leftSidebarOpen && 'scale-0'}
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
            <div className={`top-0 w-1 -right-0 absolute h-screen
            cursor-col-resize resize-x border-2 border-transparent bg-stone-100
            hover:border-stone-300 ${!leftSidebarOpen && "hidden"}`}
                onMouseDown={startResizing}>
            </div>
        </div>
    )
}

export default Sidebar;