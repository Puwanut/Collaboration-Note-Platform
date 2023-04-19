import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppContext } from "../context/AppContext";

const Topbar = () => {
  const { leftSidebarOpen, handleToggleSidebar, currentPage } = useAppContext();

  return (
    <div className="sticky z-10 flex h-12 items-center px-4">
      <FontAwesomeIcon
        icon={faBars}
        size="lg"
        className={`${leftSidebarOpen && "!hidden"} mr-4 cursor-pointer hover:bg-slate-200`}
        onClick={handleToggleSidebar}
      />
      <h1 className="">{currentPage?.title}</h1>
    </div>
  )
}

export default Topbar;
