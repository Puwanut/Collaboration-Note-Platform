/* eslint-disable no-unused-vars */
import { forwardRef, useState } from 'react'
import { Page } from '../../types/page'
import { Coordinate } from '../../types/coordinate'
import Image from 'next/image'
import { useAppContext } from '../../context/AppContext'
import { gallery } from '../../shared/gallery'
import { Tooltip } from 'react-tooltip'

interface ICoverSelectorOverlayProps {
    coordinate: Coordinate
}

enum Tab {
    Gallery = "Gallery",
    Upload = "Upload",
    Link = "Link"
}

const tempURL = "https://zbjqqzpujmtnfcrchymi.supabase.co/storage/v1/object/sign/dev/gallery/Bourbon.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkZXYvZ2FsbGVyeS9Cb3VyYm9uLmpwZyIsImlhdCI6MTY4MjQzMTk4OSwiZXhwIjoxNjgzMDM2Nzg5fQ.zAOcAuNrtM7S91q5MtT6qZwKU1hbM0n4i6iWH8Fp6U8&t=2023-04-25T14%3A13%3A09.093Z"

const CoverSelectorOverlay = forwardRef<HTMLDivElement, ICoverSelectorOverlayProps>(function CoverSelectorOverlay({ coordinate }, ref) {

    const [selectedTab, setSelectedTab] = useState<Tab>(Tab.Gallery)
    const { setCurrentPage } = useAppContext()

    const onClickRemoveHandler = () => {
        setCurrentPage(prev => {
            return {...prev, cover: null}
        })
    }

    const onClickGalleryImageHandler = (img: string) => {
        setCurrentPage(prev => {
            return {...prev, cover: img}
        })
    }

    const onClickUploadFileHandler = () => {
        const fileInput = document.getElementById("cover-upload") as HTMLInputElement
        fileInput.click()
    }

    return (
        <div className="sticky max-w-[550px] rounded shadow-xl border-[1px] bg-white" ref={ref} style={{ left: coordinate.x - 200, top: coordinate.y + 30}}>
            <nav className="flex justify-between text-sm px-2">
                <div id="cover-tab" className="text-neutral-700">
                    {Object.values(Tab).map((tab) => (
                        <div key={tab} className={`inline-block py-1.5 ${selectedTab === tab ? "border-b-2 border-black" : ""}`} onClick={() => setSelectedTab(tab)}>
                            <button className="px-2 py-1 hover:bg-neutral-200/60 rounded">{tab}</button>
                        </div>
                    ))}
                </div>
                <button className="text-neutral-400 px-2 my-1.5 hover:bg-neutral-200/60 rounded" onClick={onClickRemoveHandler}>Remove</button>
            </nav>
            <hr />
            <div className="p-1 xs:max-h-[500px] overflow-y-auto">
                {selectedTab === Tab.Gallery &&
                    gallery.map((imgCategory) => (
                        <div key={imgCategory.category} className="p-2">
                            <h3 className="text-sm text-neutral-500 mb-3">{imgCategory.category}</h3>
                            <div className="grid grid-cols-2 xs:grid-cols-4 gap-1.5">
                                {imgCategory.images.map((img) => (
                                    <div key={img}>
                                        <div className="relative w-auto h-16 hover:opacity-80 hover:cursor-pointer"
                                            onClick={() => onClickGalleryImageHandler("gallery/" + img)}
                                            data-tooltip-id={`tooltip-cover-${img}`}
                                            data-tooltip-content={img.slice(0, -4)}
                                        >
                                            <Image src={`/images/gallery/${img}`} fill sizes="100%" alt={img} className="rounded" />
                                        </div>
                                        <Tooltip id={`tooltip-cover-${img}`} noArrow />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                }
                {selectedTab === Tab.Upload &&
                    <div className="p-2">
                        <input type='file' id='cover-upload' accept="image/*" hidden />
                        <button type="button" className="w-full border-[1px] rounded py-1 text-sm text-neutral-600 hover:bg-neutral-200/60" onClick={onClickUploadFileHandler}>Upload file</button>
                        <p className="w-full mt-2 text-center text-xs text-neutral-400">The maximum size per file is 4 MB.</p>
                    </div>
                }
            </div>
        </div>
    )

})

export default CoverSelectorOverlay
