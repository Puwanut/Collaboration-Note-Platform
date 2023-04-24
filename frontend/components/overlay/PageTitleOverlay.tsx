import { forwardRef, useState, useEffect, useMemo, KeyboardEvent } from 'react'
import { useAppContext } from '../../context/AppContext'
import ContentEditable from 'react-contenteditable'
import { useOverlayContext } from '../../context/OverlayContext'
import { setCaretToEnd } from '../../lib/setCaret'
import { PageWithOutBlocks } from '../../types/page'
import { useSession } from 'next-auth/react'
import { useDebounce } from 'react-use'
import { Coordinate } from '../../types/coordinate'

interface IPageTitleOverlayProps {
    coordinate: Coordinate,
    selectedPage: PageWithOutBlocks,
    referer: "topbar" | "sidebar"
}

const TITLE_CHANGE_DEBOUNCE_MS = 100

const PageTitleOverlay = forwardRef<HTMLDivElement, IPageTitleOverlayProps>(function PageTitleOverlay({coordinate, selectedPage, referer} ,ref) {

    const { data: session } = useSession()
    const { setOverlay } = useOverlayContext()
    const { currentPage, setCurrentPage, setCurrentWorkspaceData } = useAppContext()
    const [title, setTitle] = useState<string>(selectedPage?.title ?? "")
    const { x, y } = useMemo(() => {
        if (referer === "topbar") {
            const titlePosition = document.getElementById("topbar-title").getBoundingClientRect()
            return { x: titlePosition.x - 50, y: titlePosition.y + 30 }
        } else if (referer === "sidebar") {
            return coordinate
        }
    }, [coordinate, referer])

    const onKeyDownHandler = (e: KeyboardEvent) => {
        switch (e.key) {
            case "Enter":
                e.preventDefault()
                setOverlay(null)
                break
        }
    }

    const onTitleChangeHandler = async () => {
        if (selectedPage.id === currentPage?.id) {
            setCurrentPage(prev => ({ ...prev, title: title }))
        }
        else {
            setCurrentWorkspaceData(prev => ({
                ...prev,
                pages: prev.pages.map(page => page.id === selectedPage.id ? { ...page, title: title } : page)
            }))
        }
    }

    useEffect(() => {
        const titleInput = document.getElementById("title-input")
        titleInput.innerText.length === 0 ? titleInput?.focus() : setCaretToEnd(titleInput)
    }, [])

    useEffect(() => {
        if (title) {
            onTitleChangeHandler()
        }
    }, [title])

    useDebounce(async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/${selectedPage.id}/title`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user.accessToken}`
            },
            body: JSON.stringify({title: title})
        })
    }, TITLE_CHANGE_DEBOUNCE_MS, [title])

    return (
        <div className="absolute bg-white p-2 shadow-xl w-80" ref={ref} style={{ left: x, top: y }}>
            <div className="flex gap-x-2">
                <button className='flex-none border-[1px] rounded px-1 py-0.5 w-8 h-8 hover:bg-neutral-200/60'>
                    i
                </button>
                <ContentEditable
                    id="title-input"
                    className="w-full min-w-0 px-2 py-0.5 bg-neutral-100 border-[1px] rounded outline-none whitespace-pre-wrap"
                    html={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => onKeyDownHandler(e)}
                />
            </div>
        </div>
    )
})

export default PageTitleOverlay
