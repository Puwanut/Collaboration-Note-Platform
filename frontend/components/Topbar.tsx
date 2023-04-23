import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppContext } from "../context/AppContext";
import { decode } from "entities";
import { OverlayType, useOverlayContext } from "../context/OverlayContext";

const Topbar = () => {
  const { leftSidebarOpen, handleToggleSidebar, currentPage } = useAppContext()
  const { setOverlay } = useOverlayContext()

  const topbarTitleHandler = () => {
    // check window scroll to top
    const pageWorkspace = document.getElementById("page-workspace")
    if (pageWorkspace.scrollTop > 0) {
      pageWorkspace.scrollTo(0, 0);
    } else {
      setOverlay({
        name: OverlayType.pageTitleEditor,
        properties: {pageId: currentPage.id}
      })
    }
  }

  return (
    <div className="sticky z-10 flex h-12 items-center px-4">
      <FontAwesomeIcon
        icon={faBars}
        size="lg"
        className={`${leftSidebarOpen && "!hidden"} mr-4 cursor-pointer hover:bg-slate-200`}
        onClick={handleToggleSidebar}
      />
      <button
        id="topbar-title"
        className="text-overflow-ellipsis hover:bg-neutral-200/70 empty:before:content-[attr(data-placeholder)]"
        onClick={topbarTitleHandler}
        data-placeholder="Untitled">
        {currentPage?.title ? decode(currentPage.title) : ""}
      </button>
    </div>
  )
}

export default Topbar;
