import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppContext } from "../context/AppContext";

const Topbar = () => {
  const { leftSidebarOpen, handleToggleSidebar } = useAppContext();

  return (
    <div className="sticky z-10 flex h-12  items-center bg-slate-100 px-4">
      <FontAwesomeIcon
        icon={faBars}
        size="lg"
        className={`${
          leftSidebarOpen && "!hidden"
        } cursor-pointer hover:bg-slate-200`}
        onClick={handleToggleSidebar}
      />
    </div>
  )
}

export default Topbar;
