import "../styles/globals.css"
import "@fortawesome/fontawesome-svg-core/styles.css" // import Font Awesome CSS
import 'react-tooltip/dist/react-tooltip.css' // import react-tooltip CSS
import 'react-toastify/dist/ReactToastify.css'; // import react-toastify CSS
import { config } from "@fortawesome/fontawesome-svg-core"
import { AppProvider } from "../context/AppContext"
import { SessionProvider } from "next-auth/react"
config.autoAddCss = false // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}) {
  return (
    <SessionProvider session={session}>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </SessionProvider>
  )
}

export default MyApp
