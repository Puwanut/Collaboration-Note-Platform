import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppContext } from "../context/AppContext";
import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import Link from "next/link";

const Topbar = () => {
  // const { data: session } = useSession();
  const { user } = useUser()
  const { leftSidebarOpen, handleToggleSidebar } = useAppContext();


  return (
    <div className="sticky z-10 flex h-12  items-center bg-slate-100 px-4">
      <FontAwesomeIcon
        icon={faBars}
        size="lg"
        className={`${
          leftSidebarOpen && "!hidden"
        } cursor-pointer hover:bg-slate-200`}
        onClick={handleToggleSidebar}
      />
      {
        user ? (
          <button type="button" className="ml-auto"
            >{user.email}
          </button>
        )
        : (
          <Link href="/login" className="ml-auto">
            <button>
              Sign in
            </button>
          </Link>
        )
      }
    </div>
  )
}

export default Topbar;
