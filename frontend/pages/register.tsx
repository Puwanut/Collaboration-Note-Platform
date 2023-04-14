import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup"
// import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify"

export interface IRegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, // at least 1 lowercase, 1 uppercase, 1 number
      "Password must contain at least 1 lowercase, 1 uppercase, 1 number"
    )
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be less than 20 characters"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Password does not match")
})


export default function Register() {

  // const router = useRouter()

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleOnSubmit
  })

  async function handleOnSubmit(values: IRegisterFormValues) {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      }
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/register`, options)
        .then(res => res.json())
        .then((data) => {
          if (data.status === 'ok') {
            toast(data.message, { type: "success" })
            // router.push(process.env.NEXT_PUBLIC_BASE_URL)
          } else {
            toast(data.message, { type: "error" })
            formik.resetForm()
          }
        })

  }

  return (
    <>
      <Head>
        <title>Notion Clone - Register</title>
      </Head>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={true}
      />
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
        <form
          onSubmit={formik.handleSubmit}
          className="max-w-xs mx-auto pb-20 h-full flex flex-col items-center justify-center"
        >
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
              className={`auth-input ${formik.touched.username && formik.errors.username ? "border-red-500" : ""}`}
              {...formik.getFieldProps("username")}
            />
            {(formik.touched.username && formik.errors.username) &&
              <p className="text-red-500 text-sm mt-1">{formik.errors.username}</p>
            }
          </div>
          <div className="w-full mb-2">
            <label htmlFor="username" className="auth-input-label">Email</label>
            <input
              name="email"
              id="email"
              type="email"
              placeholder="Enter your email address..."
              className={`auth-input ${formik.touched.email && formik.errors.email ? "border-red-500" : ""}`}
              {...formik.getFieldProps("email")}
            />
            {(formik.touched.email && formik.errors.email) &&
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            }
          </div>
          <div className="w-full mb-2">
            <label htmlFor="password" className="auth-input-label">Password</label>
            <input
              name="password"
              id="password"
              type="password"
              placeholder="Enter your password..."
              className={`auth-input ${formik.touched.password && formik.errors.password ? "border-red-500" : ""}`}
              {...formik.getFieldProps("password")}
            />
            {(formik.touched.password && formik.errors.password) &&
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            }
          </div>
          <div className="w-full mb-2">
            <label htmlFor="confirm-password" className="auth-input-label">Confirm Password</label>
            <input
              name="confirm-password"
              id="confirm-password"
              type="password"
              placeholder="Confirm your password..."
              className={`auth-input ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : ""}`}
              {...formik.getFieldProps("confirmPassword")}
            />
            {(formik.touched.confirmPassword && formik.errors.confirmPassword) &&
              <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
            }
          </div>
          <button type="submit" className="w-full bg-red-50 text-red-500 font-medium border-[1px] border-red-200 rounded-md py-2 mt-4 hover:bg-red-100 hover:border-red-300">
            Sign up
          </button>

          <p className="mt-8 text-gray-400">
            Already have an account?&nbsp;
            <Link href={"/login"} className="text-blue-500 font-medium hover:text-blue-600">
              Sign in
            </Link>
          </p>

        </form>
      </div>
    </>
  );
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   return {
//     props: {
//       // providers: await providers(context),
//       csrfToken: await getCsrfToken(context),
//     },
//   }
// }
