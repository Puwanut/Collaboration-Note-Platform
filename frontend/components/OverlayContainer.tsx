import { useClickAway } from "react-use"
import { useOverlayContext } from "../context/OverlayContext"
import WorkspaceOverlay from "./WorkspaceOverlay"
import { useRef } from "react"

// overlay container will disabled all actions outside of overlay

const OverlayContainer = () => {

    const { overlayName, setOverlayName } = useOverlayContext()
    const overlayRef = useRef<HTMLDivElement>(null)

    useClickAway(overlayRef, () => {
        setOverlayName("")
    })

    return (
        <>
            {overlayName &&
            <div className="fixed z-[999] w-screen h-screen">
                {overlayName === "workspace" &&
                  <WorkspaceOverlay ref={overlayRef} />
                }
            </div>
            }
        </>
    )
}

export default OverlayContainer
