import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { getCsrfToken, signIn } from "next-auth/react"
import Image from "next/image";
import Link from "next/link";


export default function Login({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  async function handleGoogleSignin() {
    signIn("google", { callbackUrl: process.env.NEXT_PUBLIC_BASE_URL })
  }

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
            Log in
          </h1>
          <button
            type="button"
            onClick={handleGoogleSignin}
            className="flex justify-center items-center w-full border-[1px] rounded-md py-1.5 gap-x-1 font-medium hover:bg-neutral-200 hover:border-neutral-300"
          >
            <Image src={"/icons/google_icon.svg"} alt="Google Logo" width={20} height={20} />
            Continue with Google
          </button>

          <div role="separator" className="my-5 h-[1px] bg-neutral-200 w-full"></div>

          <div className="w-full mb-2">
            <label htmlFor="email" className="auth-input-label">Email</label>
            <input
              name="email"
              id="email"
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
          <button type="button" className="w-full bg-red-50 text-red-500 font-medium border-[1px] border-red-200 rounded-md py-2 mt-4 hover:bg-red-100 hover:border-red-300">
            Continue with email
          </button>

          <p className="mt-8 text-gray-400">
            don&apos;t have an account yet?&nbsp;
            <Link href={"/register"} className="text-blue-500 font-medium hover:text-blue-600">
              Sign up
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
