import Image from 'next/image'
import { OverlayType, useOverlayContext } from "../context/OverlayContext"
import { MouseEvent, useEffect, useState } from "react"
import { useSession } from "next-auth/react"

interface IPageCoverProps {
    src: string
}

const PageCover = ({ src }: IPageCoverProps) => {

    const { data: session } = useSession()
    const { setOverlay } = useOverlayContext()
    const [imageUrl, setImageUrl] = useState<string>("/images/placeholder.png")

    useEffect(() => {
        if (src.startsWith("gallery")) {
            setImageUrl(`/images/${src}`)
        } else if (src.startsWith("http")) {
            setImageUrl(src)
        }
        else {
            const fetchImageUrl = async () => {
                // src is workspaceId/imageName
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images/${src}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${session?.user.accessToken}`
                    }
                }).then(res => res.json())
                setImageUrl(res.signedUrl)
            }
            fetchImageUrl()
        }
    }, [src])

    const onClickHandler = (e: MouseEvent) => {
        const buttonPosition = e.currentTarget.getBoundingClientRect()
        setOverlay({
            name: OverlayType.coverSelector,
            coordinate: {
                x: buttonPosition.x,
                y: buttonPosition.y
            }
        })
    }

    return (
        <div className="relative w-full h-72 group/page-cover">
            {/* blur isn't working in next/image (https://github.com/vercel/next.js/issues/42140) */}
            <Image
                src={imageUrl ?? ""}
                alt="page cover"
                fill
                sizes="100%"
                priority
                style={{objectFit:"cover"}}
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
