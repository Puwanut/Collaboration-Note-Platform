import { useState } from "react";
import Topbar from "./Topbar";

const Workspace = () => {

    const [isTop, setIsTop] = useState(true)

    return (
        <div className={`flex-1`}>
            <Topbar />

            <div className={`mt-12 h-[calc(100vh-3rem)] overflow-y-auto scroll-smooth
                ${isTop ? 'overscroll-auto' : 'overscroll-none'}`}
                onScroll={(e) => e.currentTarget.scrollTop == 0 ? setIsTop(true) : setIsTop(false)}
            >

                <div className="pt-8 pb-4 mb-16 px-4 container
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