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
import { useRouter } from "next/router";

export default function Page({ workspaces }) {

  const { data: session } = useSession()
  const router = useRouter()
  const { pid } = router.query
  const { setWorkspaces, setCurrentWorkspace, setCurrentPage } = useAppContext()

  // for user who directly access page url
  useEffect(() => {
    if (workspaces) {
      setWorkspaces(workspaces)
      setCurrentWorkspace(workspaces[0])
    }
  }, [])

  useEffect(() => {
    const fetchPage = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/${pid}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${session?.user.accessToken}`
            }
        })
        const page = await res.json()
        setCurrentPage(page)
    }
    fetchPage()
  }, [pid])

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

  // access token expired (tobe improved with refresh token)
  if (res.status === 403) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  const workspaces = await res.json()

  return {
    props: {
      session,
      workspaces
    }
  }
}
