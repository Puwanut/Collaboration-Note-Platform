import { GetServerSidePropsContext } from "next";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Workspace from "../components/Workspace";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default function App() {

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
    props: { session }
  }
}

// export async function getServerSideProps(context) {
//   const session = await getServerSession(context.req, context.res, authOptions)
//   if (!session) {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       }
//     }
//   }
//   return {
//     props: {
//       session
//     }
//   }
// }
