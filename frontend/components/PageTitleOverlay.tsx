import { forwardRef, useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import ContentEditable from 'react-contenteditable'

interface IPageTitleOverlayProps {
    pageId: string
}

const PageTitleOverlay = forwardRef<HTMLDivElement, IPageTitleOverlayProps>(function PageTitleOverlay({pageId} ,ref) {

    const { currentPage, setCurrentPage, setCurrentWorkspaceData } = useAppContext()
    const [pageTitle, setPageTitle] = useState<string>(currentPage?.title || "")
    const { x: titleTopbarX, y: titleTopbarY } = document.getElementById("topbar-title").getBoundingClientRect()

    useEffect(() => {
        // setCurrentPage(prev => ({ ...prev, title: pageTitle }))
        if (pageId === currentPage?.id) {
            setCurrentPage(prev => ({ ...prev, title: pageTitle }))
        }
        setCurrentWorkspaceData(prev => ({
            ...prev,
            pages: prev.pages.map(page => page.id === pageId ? { ...page, title: pageTitle } : page)
        }))
    }, [pageTitle])

    return (
        <div className="absolute bg-white p-2 shadow-xl w-80" ref={ref} style={{ left: titleTopbarX - 50, top: titleTopbarY + 30}}>
            <div className="flex gap-x-2">
                <button className='flex-none border-[1px] rounded px-1 py-0.5 w-8 h-8 hover:bg-neutral-200/60'>
                    i
                </button>
                <ContentEditable
                    className="w-full min-w-0 px-2 py-0.5 bg-neutral-100 border-[1px] rounded outline-none whitespace-pre-wrap"
                    html={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                />
            </div>
        </div>
    )
})

export default PageTitleOverlay
