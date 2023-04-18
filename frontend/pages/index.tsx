import { GetServerSidePropsContext } from "next";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Workspace from "../components/Workspace";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import OverlayContainer from "../components/OverlayContainer";

export default function App() {

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
  console.log(workspaces)

  return {
    props: {
      session,
      workspaces
    }
  }
}
