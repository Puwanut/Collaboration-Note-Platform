import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Topbar = () => {


    return (
        <div className="w-full h-12 bg-slate-100 fixed items-center flex px-4">
            <FontAwesomeIcon icon={faBars}/>
        </div>
    )
}

export default Topbar;