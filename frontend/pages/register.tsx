import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { getCsrfToken } from "next-auth/react"
import Image from "next/image";
import Link from "next/link";


export default function SignIn({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <div className="max-w-screen-lg mx-auto h-screen mt-4">

        {/* Topbar Section */}
        <nav className="flex items-center mx-4">
          <div className="relative w-7 h-7">
            <Image
              src="/icons/notion_clone_logo.png"
              alt="Notion Clone Logo"
              fill
              sizes="100%"
            />
          </div>
          <h1 className="ml-3 text-lg font-medium">
            Notion clone by Puwanut
          </h1>
        </nav>

        {/* Center Section */}
        <div className="max-w-xs mx-auto pb-20 h-full flex flex-col items-center justify-center">
          <h1 className="mb-8 text-5xl font-bold">
            Register
          </h1>
          <div className="w-full mb-2">
            <label htmlFor="username" className="auth-input-label">Username</label>
            <input
              name="username"
              id="username"
              type="text"
              placeholder="Enter your username..."
              className="auth-input"
            />
          </div>
          <div className="w-full mb-2">
            <label htmlFor="username" className="auth-input-label">Email</label>
            <input
              name="username"
              id="username"
              type="email"
              placeholder="Enter your email address..."
              className="auth-input"
            />
          </div>
          <div className="w-full mb-2">
            <label htmlFor="password" className="auth-input-label">Password</label>
            <input
              name="password"
              id="password"
              type="password"
              placeholder="Enter your password..."
              className="auth-input"
            />
          </div>
          <div className="w-full mb-2">
            <label htmlFor="confirm-password" className="auth-input-label">Confirm Password</label>
            <input
              name="confirm-password"
              id="confirm-password"
              type="password"
              placeholder="Confirm your password..."
              className="auth-input"
            />
          </div>
          <button type="button" className="w-full bg-red-50 text-red-500 font-medium border-[1px] border-red-200 rounded-md py-2 mt-4 hover:bg-red-100 hover:border-red-300">
            Sign up
          </button>

          <p className="mt-8 text-gray-400">
            Already have an account?&nbsp;
            <Link href={"/login"} className="text-blue-500 font-medium hover:text-blue-600">
              Sign in
            </Link>
          </p>

        </div>
      </div>
      <form method="post" action="/api/auth/callback/credentials">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        {/* <label>
          Username
          <input name="username" type="text" />
        </label>
        <label>
          Password
          <input name="password" type="password" />
        </label>
        <button type="submit">Sign in</button> */}
      </form>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      // providers: await providers(context),
      csrfToken: await getCsrfToken(context),
    },
  }
}
