import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useCallback } from "react";
import { useAppContext } from "../context/AppContext";

const Topbar = () => {

    const { leftSidebarOpen, handleToggleSidebar} = useAppContext()

    return (
        <div className="w-full h-12 bg-slate-100 fixed z-10 top-0 items-center flex px-4">
            <FontAwesomeIcon icon={faBars}
                className={`${leftSidebarOpen && "!hidden"} cursor-pointer`}
                onClick={handleToggleSidebar}/>
        </div>
    )
}

export default Topbar;