import { forwardRef } from 'react'
import { Coordinate, useOverlayContext } from '../context/OverlayContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone, faStar, faTrashCan, faEdit } from '@fortawesome/free-regular-svg-icons'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useAppContext } from '../context/AppContext'
import { v4 as uuidv4 } from 'uuid'

interface IPageMenuOverlayProps {
    coordinate: Coordinate
    pageId: string
}

const PageMenuOverlay = forwardRef<HTMLDivElement, IPageMenuOverlayProps>(function PageMenuOverlay({coordinate, pageId}, ref) {

    const { data: session } = useSession()
    const { setOverlay } = useOverlayContext()
    const { currentWorkspaceData, setCurrentWorkspaceData, currentPage } = useAppContext()
    const router = useRouter()

    const onDeleteHandler = async () => {
        setOverlay(null)
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/${pageId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user.accessToken}`
            }
        })

        if (currentWorkspaceData.pages.length > 1) {

            // if current page is first page and deleted, redirect to second page
            // if current page is deleted, redirect to first page
            // else no redirect
            if (currentWorkspaceData.pages[0].id === pageId) {
                router.push(`/${currentWorkspaceData.pages[1].id}`)
            } else if (pageId === currentPage.id) {
                router.push(`/${currentWorkspaceData.pages[0].id}`)
            }

            setCurrentWorkspaceData(prev => ({
                ...prev,
                pages: prev.pages.filter((page) => page.id !== pageId)
            }))
        } else {
            // if only one page left, create new page
            const newPage = {id: uuidv4(), title: "", blocks: []}
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workspaces/${currentWorkspaceData.id}/pages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.user.accessToken}`
                },
                body: JSON.stringify(newPage)
            }).then((res) => res.json())

            setCurrentWorkspaceData(prev => ({
                ...prev,
                pages: [{ id: res.id, title: res.title }]
            }))

            router.push(`/${res.id}`)
        }

    }

    const pageMenus = [
        { name: "Delete", icon: <FontAwesomeIcon icon={faTrashCan} className="w-4" />, onClickHandler: onDeleteHandler },
        { name: "Add to Favorites", icon: <FontAwesomeIcon icon={faStar} className="w-4" /> },
        { name: "Duplicate", icon: <FontAwesomeIcon icon={faClone} className="w-4" />},
        { name: "Copy link", icon: <FontAwesomeIcon icon={faLink} className="w-4" /> },
        { name: "Rename", icon: <FontAwesomeIcon icon={faEdit} className="w-4" /> }
    ]

    return (
        <div
            className="absolute bg-white p-1.5 rounded border-[1px] shadow-xl w-52"
            style={{ left: coordinate.x, top: coordinate.y}}
            ref={ref}
        >
            {pageMenus.map((menu) => (
            <button
                key={menu.name}
                className="text-left w-full px-3 py-[3px] text-neutral-600 hover:bg-neutral-200/60 rounded"
                onClick={menu.onClickHandler}
            >
                {menu.icon}
                <span className="ml-3 text-sm">{menu.name}</span>
            </button>
            ))}

        </div>
    )
})

export default PageMenuOverlay
