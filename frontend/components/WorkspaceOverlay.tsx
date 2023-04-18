import { faCheck, faCircleXmark, faEllipsis, faGripVertical, faPlusSquare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import { useState, forwardRef } from "react"
import { useAppContext } from "../context/AppContext"

const WorkspaceOverlay = forwardRef<HTMLDivElement>(function WorkspaceOverlay(_, ref) {

    const { data: session } = useSession()
    const { workspaces } = useAppContext()
    const [menuOpen, setMenuOpen] = useState<boolean>(false)

    return (
        <div className="absolute z-20 translate-x-3 translate-y-10 bg-white border-[1px] rounded-md shadow-lg min-w-[250px]" ref={ref}>
            <div className="flex justify-between items-center px-3 py-2">
                <span className="text-neutral-400 text-xs">{session?.user.email}</span>
                <div className="relative">
                    <button
                        className="ml-auto hover:bg-neutral-100 px-1 rounded-md"
                        onClick={() => setMenuOpen(prev => !prev)}
                    >
                        <FontAwesomeIcon
                            icon={faEllipsis}
                            className="text-neutral-400"
                        />
                    </button>
                    {menuOpen &&
                    <div className="absolute -translate-x-[35%] min-w-max bg-white border-[1px] shadow-lg rounded-md p-1.5">
                        <button className="flex px-2 py-1 w-full items-center gap-x-2 rounded-md hover:bg-neutral-200/60">
                            <FontAwesomeIcon
                                icon={faPlusSquare}
                                className="text-neutral-600 w-5"
                            />
                            <span className="text-sm">Join or create workspace</span>
                        </button>
                        <button
                            className="flex px-2 py-1 w-full items-center gap-x-2 rounded-md hover:bg-neutral-200/60"
                            onClick={() => signOut()}
                        >
                            <FontAwesomeIcon
                                icon={faCircleXmark}
                                className="text-neutral-600 w-5"
                            />
                            <span className="text-sm">Logout</span>
                        </button>
                    </div>
                    }
                </div>
            </div>
            {workspaces.map(workspace => (
                <button key={workspace.id} className="flex px-3 py-1 w-full items-center hover:bg-neutral-200/60">
                    <FontAwesomeIcon
                        icon={faGripVertical}
                        className="handle text-neutral-400 cursor-grab mr-2"
                    />
                    <div className="relative w-7 h-7">
                        <Image
                            src="/icons/notion_clone_logo.png"
                            alt="workspace image"
                            fill
                            sizes="100%"
                        />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm">{workspace.name}</p>
                        <p className="text-xs text-neutral-400 text-left">{workspace.users.length} member{workspace.users.length > 1 ? 's' : ''}</p>
                    </div>
                    <FontAwesomeIcon
                        icon={faCheck}
                        className="ml-auto pl-2 pr-1"
                    />
                </button>
            ))
            }
        </div>
    )
})

export default WorkspaceOverlay
