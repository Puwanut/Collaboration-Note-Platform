import "../styles/globals.css"
import "@fortawesome/fontawesome-svg-core/styles.css" // import Font Awesome CSS
import 'react-tooltip/dist/react-tooltip.css' // import react-tooltip CSS
import 'react-toastify/dist/ReactToastify.css'; // import react-toastify CSS
import { config } from "@fortawesome/fontawesome-svg-core"
import { AppProvider } from "../context/AppContext"
// import { SessionProvider } from "next-auth/react"
import { UserProvider } from "../context/UserContext";
config.autoAddCss = false // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

function MyApp({
  Component,
  pageProps,
  // pageProps: { session, ...pageProps }
}) {
  return (
    // <SessionProvider session={session}>
    <UserProvider initialUser={pageProps?.user}>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </UserProvider>
    // </SessionProvider>
  )
}

export default MyApp
