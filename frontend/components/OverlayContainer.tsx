import { useClickAway } from "react-use"
import { OverlayType, useOverlayContext } from "../context/OverlayContext"
import WorkspaceOverlay from "./overlay/WorkspaceOverlay"
import { useRef } from "react"
import PageTitleOverlay from "./overlay/PageTitleOverlay"
import PageMenuOverlay from "./overlay/PageMenuOverlay"
import CoverSelectorOverlay from "./overlay/CoverSelectorOverlay"

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
                  <PageTitleOverlay coordinate={overlay.coordinate} selectedPage={overlay.properties.page} referer={overlay.properties.referer} ref={overlayRef} />
                }
                {overlay.name === OverlayType.pageMenu &&
                  <PageMenuOverlay coordinate={overlay.coordinate} selectedPage={overlay.properties.page} ref={overlayRef} />
                }
                {overlay.name === OverlayType.coverSelector &&
                  <CoverSelectorOverlay coordinate={overlay.coordinate} ref={overlayRef} />
                }
            </div>
            }
        </>
    )
}

export default OverlayContainer
