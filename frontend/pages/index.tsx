import { GetServerSidePropsContext } from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { useAppContext } from "../context/AppContext";
import { useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Workspace } from "../types/workspace";

interface IAppProps {
  workspaces: Workspace[]
}

export default function App({ workspaces }: IAppProps) {

  const { data: session } = useSession()
  const router = useRouter()
  const { setWorkspaces, setCurrentWorkspaceId, currentWorkspaceId, setCurrentWorkspaceData } = useAppContext()

  useEffect(() => {
    setWorkspaces(workspaces)
    setCurrentWorkspaceId(workspaces[0].id)
  }, [])

  // fetch current workspace data and set current page
  useEffect(() => {
    if (currentWorkspaceId) {
      const fetchWorkspaceData = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workspaces/${currentWorkspaceId}`, {
            method: 'GET',
            headers: {
              authorization: `Bearer ${session?.user.accessToken}`
            }
        })
        const data = await res.json()
        setCurrentWorkspaceData(data)
        router.push(`/${data.pages[0].id}`)
      }
      fetchWorkspaceData()
    }
  }, [currentWorkspaceId])

  return (
    <>
      <LoadingSpinner />
    </>
  );

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
