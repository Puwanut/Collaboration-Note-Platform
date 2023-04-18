import { faCircleXmark, faEllipsis, faPlusSquare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { signOut, useSession } from "next-auth/react"
import { useState, forwardRef } from "react"

const WorkspaceOverlay = forwardRef<HTMLDivElement>(function WorkspaceOverlay(_, ref) {

    const { data: session } = useSession()
    const [menuOpen, setMenuOpen] = useState<boolean>(false)

    return (
        <div className="absolute z-20 translate-x-3 translate-y-10 p-2 bg-white shadow-lg min-w-[250px]" ref={ref}>
            <div className="flex justify-between items-center mx-2">
                <span className="text-neutral-400 text-xs">{session?.user.email}</span>
                <div className="relative">
                    <button
                        className="ml-auto hover:bg-neutral-100 px-1 rounded-md"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <FontAwesomeIcon
                            icon={faEllipsis}
                            className="text-neutral-400"
                        />
                    </button>
                    {menuOpen &&
                    <div className="absolute -translate-x-[35%] min-w-max bg-white shadow-lg rounded-md p-1.5">
                        <button className="flex px-2 py-1 w-full items-center gap-x-2 hover:bg-neutral-200/60">
                            <FontAwesomeIcon
                                icon={faPlusSquare}
                                className="text-neutral-600 w-5"
                            />
                            <span className="text-sm">Join or create workspace</span>
                        </button>
                        <button
                            className="flex px-2 py-1 w-full items-center gap-x-2 hover:bg-neutral-200/60"
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
        </div>
    )
})

export default WorkspaceOverlay
