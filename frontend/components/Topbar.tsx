import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppContext } from "../context/AppContext";
import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect } from "react";

const Topbar = () => {
  const { data: session } = useSession();
  const { leftSidebarOpen, handleToggleSidebar } = useAppContext();

  useEffect(() => {
    console.log(session)
  }, [session])

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
        session ? (
          <button
            className="ml-auto"
            onClick={() => signOut()}>{session.user.email}
          </button>
        )
        : (
          <button
            className="ml-auto"
            onClick={() => signIn()}>Sign in
          </button>
        )
      }
    </div>
  )
}

export default Topbar;
