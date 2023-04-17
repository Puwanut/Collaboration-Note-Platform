import { getServerSession } from "next-auth";
// import { useRouter } from "next/router";
import { authOptions } from "../api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import Workspace from "../../components/Workspace";

export default function Page() {
    // const router = useRouter();
    // const { wid: workspaceId, pid: pageId } = router.query

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 min-w-0">
                <Topbar />
                <Workspace />
            </div>
        </div>
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

    return {
      props: {
        session
      }
    }
  }
