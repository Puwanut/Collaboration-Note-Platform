import { forwardRef } from 'react'
import { OverlayType, useOverlayContext } from '../../context/OverlayContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone, faStar, faTrashCan, faEdit } from '@fortawesome/free-regular-svg-icons'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useAppContext } from '../../context/AppContext'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import { PageWithBlocks, PageWithOutBlocks } from '../../types/page'
import { Coordinate } from '../../types/coordinate'

interface IPageMenuOverlayProps {
    coordinate: Coordinate
    selectedPage: PageWithOutBlocks
}

const PageMenuOverlay = forwardRef<HTMLDivElement, IPageMenuOverlayProps>(function PageMenuOverlay({ coordinate, selectedPage }, ref) {

    const { data: session } = useSession()
    const { setOverlay } = useOverlayContext()
    const { currentWorkspaceData, setCurrentWorkspaceData, currentPage } = useAppContext()
    const router = useRouter()

    const onDeleteHandler = async () => {
        setOverlay(null)
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/${selectedPage.id}`, {
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
            if (currentWorkspaceData.pages[0].id === selectedPage.id && currentPage.id === selectedPage.id) {
                router.push(`/${currentWorkspaceData.pages[1].id}`)
            } else if (selectedPage.id === currentPage.id) {
                router.push(`/${currentWorkspaceData.pages[0].id}`)
            }

            setCurrentWorkspaceData(prev => ({
                ...prev,
                pages: prev.pages.filter((page) => page.id !== selectedPage.id)
            }))
        } else {
            // if only one page left, create new page
            const newPage = {id: uuidv4(), title: "", blocks: []}
            const res: PageWithBlocks = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workspaces/${currentWorkspaceData.id}/pages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.user.accessToken}`
                },
                body: JSON.stringify(newPage)
            }).then((res) => res.json())

            setCurrentWorkspaceData(prev => ({
                ...prev,
                pages: [{ id: res.id, title: res.title, isFavorite: res.isFavorite }]
            }))

            router.push(`/${res.id}`)
        }

    }

    const onCopyLinkHandler = () => {
        setOverlay(null)
        navigator.clipboard.writeText(`${window.location.origin}/${selectedPage.id}`)
        toast("Link copied to clipboard", { type: "success" })
    }

    const onRenameHandler = () => {
        setOverlay({
            name: OverlayType.pageTitleEditor,
            properties: {
                page: selectedPage,
                referer: "sidebar"
            },
            coordinate: {
                x: coordinate.x,
                y: coordinate.y
            }
        })
    }

    const onDuplicateHandler = async () => {
        setOverlay(null)

        // get full page data
        const selectedPageIncludeBlocks: PageWithBlocks = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/${selectedPage.id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${session?.user.accessToken}`
            }
        }).then((res) => res.json())

        const newPage = {
            id: uuidv4(),
            title: selectedPageIncludeBlocks.title,
            blocks: selectedPageIncludeBlocks.blocks,
            icon: selectedPageIncludeBlocks.icon,
            cover: selectedPageIncludeBlocks.cover
        }

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workspaces/${currentWorkspaceData.id}/pages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user.accessToken}`
            },
            body: JSON.stringify(newPage)
        }).then((res) => res.json())

        router.push(`/${newPage.id}`)
    }

    const onFavoriteHandler = async () => {
        setOverlay(null)
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/${selectedPage.id}/favorite`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user.accessToken}`
            },
            body: JSON.stringify({ isFavorite: !selectedPage.isFavorite })
        })
        setCurrentWorkspaceData(prev => ({
            ...prev,
            pages: prev.pages.map((page) => {
                if (page.id === selectedPage.id) {
                    return {
                        ...page,
                        isFavorite: !selectedPage.isFavorite
                    }
                }
                return page
            }
        )}))
    }

    const pageMenus = [
        { name: "Delete", icon: <FontAwesomeIcon icon={faTrashCan} className="w-4" />, onClickHandler: onDeleteHandler },
        { name: `${selectedPage.isFavorite ? "Remove" : "Add"} to Favorites`, icon: <FontAwesomeIcon icon={faStar} className="w-4" />, onClickHandler: onFavoriteHandler },
        { name: "Duplicate", icon: <FontAwesomeIcon icon={faClone} className="w-4" />, onClickHandler: onDuplicateHandler },
        { name: "Copy link", icon: <FontAwesomeIcon icon={faLink} className="w-4" />, onClickHandler: onCopyLinkHandler },
        { name: "Rename", icon: <FontAwesomeIcon icon={faEdit} className="w-4" />, onClickHandler: onRenameHandler }
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
