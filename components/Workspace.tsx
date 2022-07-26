import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Topbar from "./Topbar";

const Workspace = () => {

    // const {leftSidebarOpen} = useAppContext()
    // const [leftSidebarOpen_mobile, setLeftSidebarOpen_mobile] = useState(false)

    // const handleHideWorkspace = useCallback(
    //   () => {
    //     if (window.innerWidth < 420 && leftSidebarOpen) {
    //         setLeftSidebarOpen_mobile(true)
    //     } else {
    //         setLeftSidebarOpen_mobile(false)
    //     }
    //   },
    //   [leftSidebarOpen],
    // )

    // useEffect(() => {
    //     handleHideWorkspace()
    // }, [handleHideWorkspace])

    return (
        // <div className="p-7 text-2xl font-semibold flex-1 h-screen container"></div>
        <div className={`flex-1`}>
            <Topbar />

            {/* <div className="pt-16"></div> mt-[6vh] h-[94vh]*/}
            <div className="mt-12 h-[calc(100vh-4rem)] overflow-y-auto">

                <div className="pt-4 pb-4 px-4 container
                lg:max-w-screen-md
                xl:max-w-screen-md
                2xl:max-w-screen-md">
                    <h1 className="text-5xl font-bold mb-5">Home Page</h1>
                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                        Ipsam quisquam aliquam cupiditate ab saepe dolorum doloremque doloribus
                        eligendi repellendus deserunt voluptas laboriosam unde ut quae dicta,
                        minima placeat quo commodi!
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe,
                        itaque doloribus. Omnis voluptatum reiciendis provident illum at
                        amet quae eligendi fugit unde nesciunt, porro, voluptatibus minima
                        repellat dolor, suscipit aperiam!
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe,
                        itaque doloribus. Omnis voluptatum reiciendis provident illum at
                        amet quae eligendi fugit unde nesciunt, porro, voluptatibus minima
                        repellat dolor, suscipit aperiam!
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                        Ipsam quisquam aliquam cupiditate ab saepe dolorum doloremque doloribus
                        eligendi repellendus deserunt voluptas laboriosam unde ut quae dicta,
                        minima placeat quo commodi!
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe,
                        itaque doloribus. Omnis voluptatum reiciendis provident illum at
                        amet quae eligendi fugit unde nesciunt, porro, voluptatibus minima
                        repellat dolor, suscipit aperiam!
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe,
                        itaque doloribus. Omnis voluptatum reiciendis provident illum at
                        amet quae eligendi fugit unde nesciunt, porro, voluptatibus minima
                        repellat dolor, suscipit aperiam!
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                        Ipsam quisquam aliquam cupiditate ab saepe dolorum doloremque doloribus
                        eligendi repellendus deserunt voluptas laboriosam unde ut quae dicta,
                        minima placeat quo commodi!
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe,
                        itaque doloribus. Omnis voluptatum reiciendis provident illum at
                        amet quae eligendi fugit unde nesciunt, porro, voluptatibus minima
                        repellat dolor, suscipit aperiam!
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe,
                        itaque doloribus. Omnis voluptatum reiciendis provident illum at
                        amet quae eligendi fugit unde nesciunt, porro, voluptatibus minima
                        repellat dolor, suscipit aperiam!
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                        Ipsam quisquam aliquam cupiditate ab saepe dolorum doloremque doloribus
                        eligendi repellendus deserunt voluptas laboriosam unde ut quae dicta,
                        minima placeat quo commodi!
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe,
                        itaque doloribus. Omnis voluptatum reiciendis provident illum at
                        amet quae eligendi fugit unde nesciunt, porro, voluptatibus minima
                        repellat dolor, suscipit aperiam!
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe,
                        itaque doloribus. Omnis voluptatum reiciendis provident illum at
                        amet quae eligendi fugit unde nesciunt, porro, voluptatibus minima
                        repellat dolor, suscipit aperiam!
                    </p>

                </div>
            </div>

        </div>
    )
}

export default Workspace;