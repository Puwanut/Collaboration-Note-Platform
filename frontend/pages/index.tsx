// import { useSession } from "next-auth/react";
import { getSession, useSession } from "next-auth/react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Workspace from "../components/Workspace";
// import { authOptions } from "./api/auth/[...nextauth]";
// import { getServerSession } from "next-auth";

export default function App() {

  const { data: session } = useSession()

  if (session)
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

export async function getServerSideProps({ req }){
  const session = await getSession({ req })

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
