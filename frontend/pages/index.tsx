import { GetServerSidePropsContext } from "next";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Workspace from "../components/Workspace";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import OverlayContainer from "../components/OverlayContainer";
import { useAppContext } from "../context/AppContext";
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

export default function App({ workspaces }) {

  const { setWorkspaces, setCurrentWorkspace } = useAppContext()
  const { data: session } = useSession()

  useEffect(() => {
    setWorkspaces(workspaces)
    setCurrentWorkspace(workspaces[0])
  }, [])

  // Auto signout when another tab signout
  useEffect(() => {
    if (!session?.user) {
        signOut()
    }
  }, [session])

  return (
    <>
      <OverlayContainer />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Topbar />
          <Workspace />
        </div>
      </div>
    </>
  )

}

export async function getServerSideProps(context: GetServerSidePropsContext){
  const session = await getServerSession(context.req, context.res, authOptions)

  if(!session){
    return {
      redirect : {
        destination: '/login',
        permanent: false
      }
    }
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workspaces`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${session?.user.accessToken}`
    }
  })

  const workspaces = await res.json()

  return {
    props: {
      session,
      workspaces
    }
  }
}
