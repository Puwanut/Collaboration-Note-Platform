import Image from 'next/legacy/image'
import { useOverlayContext } from "../context/OverlayContext"
import { MouseEvent, useEffect, useState } from "react"
import { useAppContext } from "../context/AppContext"
import { useSession } from "next-auth/react"

const PageCover = ({ src }) => {

    const { data: session } = useSession()
    const { setOverlay } = useOverlayContext()
    const { currentWorkspaceId } = useAppContext()
    const [imageUrl, setImageUrl] = useState<string>("/images/placeholder.png")

    useEffect(() => {
        const fetchImageUrl = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workspaces/${currentWorkspaceId}/images/${src}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${session?.user.accessToken}`
                }
            }).then(res => res.json()).then(res => res.data)
            setImageUrl(res.signedUrl)
        }
        fetchImageUrl()
    }, [src])

    const onClickHandler = (e: MouseEvent) => {
        console.log(e)
        setOverlay(null)
    }

    return (
        <div className="relative w-full h-72 group/page-cover">
            {/* blur isn't working in next/image (https://github.com/vercel/next.js/issues/42140) */}
            <Image
                src={imageUrl ?? ""}
                alt="page cover"
                layout="fill"
                sizes="100%"
                priority
            />
            <div className="relative w-full h-full mx-auto max-w-screen-sm opacity-0 group-hover/page-cover:opacity-100 transition">
                <button
                    type="button"
                    className="absolute right-10 bottom-3 px-2 py-1.5 rounded bg-neutral-50 hover:bg-neutral-200 text-xs font-medium text-neutral-500"
                    onClick={(e) => onClickHandler(e)}
                >
                    Change cover
                </button>
            </div>
        </div>
    )
}

export default PageCover
