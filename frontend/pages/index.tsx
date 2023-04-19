import { GetServerSidePropsContext } from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { useAppContext } from "../context/AppContext";
import { useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function App({ workspaces }) {

  const { setWorkspaces, setCurrentWorkspace } = useAppContext()

  useEffect(() => {
    setWorkspaces(workspaces)
    setCurrentWorkspace(workspaces[0])
  }, [])

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

  const workspaces = await res.json()

  return {
    props: {
      session,
      workspaces
    }
  }
}
