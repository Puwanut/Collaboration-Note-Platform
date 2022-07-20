import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppContext } from "../context/AppContext";

const Topbar = () => {

    const { leftSidebarOpen, setLeftSidebarOpen } = useAppContext()




    return (
        <div className="w-full h-12 bg-slate-100 fixed items-center flex px-4">
            <FontAwesomeIcon icon={faBars}
                className={`${!leftSidebarOpen && "hidden"}`}
                onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}/>
        </div>
    )
}

export default Topbar;