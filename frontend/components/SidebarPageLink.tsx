import { OverlayType, useOverlayContext } from "../context/OverlayContext"
import Link from "next/link"
import { useAppContext } from "../context/AppContext"
import { decode } from "entities"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsis } from "@fortawesome/free-solid-svg-icons"
import { faFileLines } from "@fortawesome/free-regular-svg-icons"
import React from "react"
import { PageMinimalData } from "../types/page"

interface ISidebarPageLinkProps {
    page: PageMinimalData
}

const SidebarPageLink = ({ page }: ISidebarPageLinkProps) => {

    const { setOverlay } = useOverlayContext()
    const { currentPage, leftSidebarOpen, isMobileView } = useAppContext()

    const onClickEllipsisHandler = (e: React.MouseEvent) => {
        // on next/link, prevent default = prevent change page url
        e.preventDefault()
        setOverlay({
            name: OverlayType.pageMenu,
            coordinate: {
                x: e.clientX,
                y: e.clientY
            },
            properties: {
                page: page
            }
        })

    }

    return (
        <Link href={page.id} className={`menu-sidebar text-neutral-400 group/sidebar-page
            ${!leftSidebarOpen && 'scale-0'}
            ${isMobileView ? 'text-base mt-2' : 'text-sm'}
            ${page.id === currentPage?.id && 'bg-neutral-200/70'}
            `}
        >
            <FontAwesomeIcon icon={faFileLines} className="menu-sidebar-icon" size="lg" />
            <span className="flex-1 text-overflow-ellipsis empty:before:content-[attr(data-placeholder)]" data-placeholder="Untitled">
                {/* Sync page title name when user edited */}
                {currentPage?.id === page.id ? decode(currentPage.title) : decode(page.title)}
            </span>
            <div
                className="hidden group-hover/sidebar-page:block text-neutral-600 px-0.5 text-sm rounded-sm hover:bg-neutral-300/60 hover:cursor-pointer"
                onClick={(e) => onClickEllipsisHandler(e)}
            >
                <FontAwesomeIcon icon={faEllipsis} size="lg" />
            </div>
        </Link>
    )
}

export default SidebarPageLink
