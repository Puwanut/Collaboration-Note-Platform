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
import { usePrevious } from "react-use";

export default function Page({ workspaces }) {

  const { data: session } = useSession()
  const router = useRouter()
  const { pid } = router.query
  const { setWorkspaces, currentWorkspaceId, setCurrentWorkspaceId, currentWorkspaceData, setCurrentWorkspaceData, currentPage, setCurrentPage } = useAppContext()
  const previousWorkspaceId = usePrevious<string>(currentWorkspaceId)

  const fetchWorkspaceData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workspaces/${currentWorkspaceId}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${session?.user.accessToken}`
        }
    })
    const data = await res.json()
    setCurrentWorkspaceData(data)
    if (previousWorkspaceId !== "") {
      router.push(`/${data.pages[0].id}`, undefined, { shallow: true })
    }
    return data
  }

  const fetchPageData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/${pid}`, {
        method: 'GET',
        headers: {
            authorization: `Bearer ${session?.user.accessToken}`
        }
    })
    const page = await res.json()
    setCurrentPage(page)
    setCurrentWorkspaceId(page.workspaceId)
    const pageNoAnyBlocks = page.blocks.length === 0
    if (pageNoAnyBlocks) {
      const titleDiv = document.getElementById("page-title-workspace")
      titleDiv.focus()
    }
  }

  // set workspaces list for user who directly access page url
  useEffect(() => {
    if (workspaces) {
      console.log("setworkspaces", workspaces)
      setWorkspaces(workspaces)
    }
  }, [])

  useEffect(() => {
    fetchPageData()
  }, [pid])

  // on workspace change, fetch workspace data and set first page of workspaec as current page
  useEffect(() => {
    if (currentWorkspaceId) {
      fetchWorkspaceData()
    }
  }, [currentWorkspaceId])

  // Sync current page to current workspace data
  useEffect(() => {
    if (currentWorkspaceData && currentPage) {
      setCurrentWorkspaceData(prev => {
        const foundCurrentPage = prev.pages.find(page => page.id === currentPage.id)
        if (foundCurrentPage) {
            return prev
        }
        return { ...prev, pages: [...prev.pages, {id: currentPage.id, title: currentPage.title}]}
      })
    }
  }, [currentPage])

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

  // if user directly access page url, fetch workspaces list
  // for user who come from index page, workspace list is already fetched
  const directlyAccessPageUrl = context.req.headers.referer !== `${process.env.NEXT_PUBLIC_BASE_URL}/`
  if (directlyAccessPageUrl) {
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

  return {
    props: {
      session
    }
  }

}
