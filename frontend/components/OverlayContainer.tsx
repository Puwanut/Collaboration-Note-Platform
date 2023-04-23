import { useClickAway } from "react-use"
import { OverlayType, useOverlayContext } from "../context/OverlayContext"
import WorkspaceOverlay from "./WorkspaceOverlay"
import { useRef } from "react"
import PageTitleOverlay from "./PageTitleOverlay"
import PageMenuOverlay from "./PageMenuOverlay"

// overlay container will disabled all actions outside of overlay

const OverlayContainer = () => {

    const { overlay, setOverlay } = useOverlayContext()
    const overlayRef = useRef<HTMLDivElement>(null)

    useClickAway(overlayRef, () => {
        setOverlay(null)
    })

    return (
        <>
            {overlay &&
            <div className="fixed z-[999] w-screen h-screen">
                {overlay.name === OverlayType.workspaceSelector &&
                  <WorkspaceOverlay ref={overlayRef} />
                }
                {overlay.name === OverlayType.pageTitleEditor &&
                  <PageTitleOverlay pageId={overlay.properties.pageId} ref={overlayRef} />
                }
                {overlay.name === OverlayType.pageMenu &&
                  <PageMenuOverlay coordinate={overlay.coordinate} pageId={overlay.properties.pageId} ref={overlayRef} />
                }
            </div>
            }
        </>
    )
}

export default OverlayContainer
