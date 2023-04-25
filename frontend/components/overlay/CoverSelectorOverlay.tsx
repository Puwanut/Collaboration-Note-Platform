/* eslint-disable no-unused-vars */
import { forwardRef, useState, useRef, ChangeEvent } from 'react'
import { Coordinate } from '../../types/coordinate'
import Image from 'next/image'
import { useAppContext } from '../../context/AppContext'
import { gallery } from '../../shared/gallery'
import { Tooltip } from 'react-tooltip'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'

interface ICoverSelectorOverlayProps {
    coordinate: Coordinate
}

enum Tab {
    Gallery = "Gallery",
    Upload = "Upload",
    Link = "Link"
}

const CoverSelectorOverlay = forwardRef<HTMLDivElement, ICoverSelectorOverlayProps>(function CoverSelectorOverlay({ coordinate }, ref) {

    const { data: session } = useSession()
    const { currentWorkspaceId, setCurrentPage } = useAppContext()
    const [selectedTab, setSelectedTab] = useState<Tab>(Tab.Gallery)
    const fileUploadRef = useRef<HTMLInputElement>(null)

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
        fileUploadRef.current.click()
    }

    const onUploadFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files
        if (fileList.length > 0) {
            const uploadFile = fileList[0]
            if (uploadFile.size > 4 * 1024 * 1024) {
                toast("The uploaded file exceeds the maximum upload size (4 MB).", { type: "error" })
                return
            }
            const formData = new FormData()
            formData.append("file", uploadFile)
            console.log(fileList)
            // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images/${currentWorkspaceId}/upload`, {
            //     method: "POST",
            //     headers: {
            //         "Authorization": `Bearer ${session?.user.accessToken}`,
            //         "Content-Type": "multipart/form-data"
            //     },
            //     body: uploadFile
            // })
            // const data = await res.json()
            // console.log(data)
        }
    }

    return (
        <div className="sticky max-w-xl rounded shadow-xl border-[1px] bg-white" ref={ref} style={{ left: coordinate.x - 200, top: coordinate.y + 30}}>
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
                    <form className="p-2" encType="multipart/form-data" onSubmit={e => e.preventDefault()}>
                        <input type='file' accept="image/*" ref={fileUploadRef} onChange={e => onUploadFileHandler(e)} hidden />
                        <button type="button" className="w-full border-[1px] rounded py-1 text-sm text-neutral-600 hover:bg-neutral-200/60" onClick={onClickUploadFileHandler}>Upload file</button>
                        <p className="w-full mt-2 text-center text-xs text-neutral-400">The maximum size per file is 4 MB.</p>
                    </form>
                }
            </div>
        </div>
    )

})

export default CoverSelectorOverlay
