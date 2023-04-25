import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppContext } from "../context/AppContext";
import { decode } from "entities";
import { OverlayType, useOverlayContext } from "../context/OverlayContext";
import { MouseEvent } from "react";

const Topbar = () => {
  const { leftSidebarOpen, handleToggleSidebar, currentPage } = useAppContext()
  const { setOverlay } = useOverlayContext()

  const topbarTitleHandler = (e: MouseEvent) => {
    // check window scroll to top
    const pageWorkspace = document.getElementById("page-workspace")
    if (pageWorkspace.scrollTop > 0) {
      pageWorkspace.scrollTo(0, 0);
    } else {
      const titleTopbarPosition = (e.target as HTMLElement).getBoundingClientRect()
      setOverlay({
        name: OverlayType.pageTitleEditor,
        properties: {
          page: currentPage,
          referer: "topbar"
        },
        coordinate: {
          x: titleTopbarPosition.x,
          y: titleTopbarPosition.y
        }
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
        className="text-overflow-ellipsis px-1.5 rounded hover:bg-neutral-200/70 empty:before:content-[attr(data-placeholder)]"
        onClick={(e) => topbarTitleHandler(e)}
        data-placeholder="Untitled">
        {currentPage?.title ? decode(currentPage.title) : ""}
      </button>
    </div>
  )
}

export default Topbar;
