// import { GetServerSidePropsContext } from "next";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Workspace from "../components/Workspace";
// import { authOptions } from "./api/auth/[...nextauth]";
// import { getServerSession } from "next-auth/next";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/router";
import { fetcher } from "../lib/fetcher";
import { User } from "../shared/user.type";
import { useEffect } from "react";
// import Cookies from "js-cookie";
import Cookies from 'cookies'
import { GetServerSidePropsContext } from "next";
import { getCookie, getCookies } from "cookies-next";
import { fetcherSSR } from "../lib/fetcherSSR";

export default function App() {

  const {user} = useUser()

  // const getMe = async () => {
  //   const [error, user] = await fetcher<User>(`${process.env.NEXT_PUBLIC_API_URL}/users/me`)
  //   if (!error && user) setUser(user)
  //   else router.push('/')
  // }

  // useEffect(() => {
  //   if (!user) getMe()
  //   console.log(user)
  // })

  return (
    <div className="flex">
      {user ? <p>{user.username}</p> : <p>loading</p>}
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar />
        <Workspace />

      </div>
    </div>
  )

}


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const [error, user] = await fetcherSSR<User>(context.req, context.res, `${process.env.NEXT_PUBLIC_API_URL}/users/me`)
  if (error || !user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }


  return {
    props: {
      user
    }
  }

}



// export async function getServerSideProps(context: GetServerSidePropsContext){
//   const session = await getServerSession(context.req, context.res, authOptions)

//   if(!session){
//     return {
//       redirect : {
//         destination: '/login',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: { session }
//   }
// }

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
