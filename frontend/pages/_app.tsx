import "../styles/globals.css"
import "@fortawesome/fontawesome-svg-core/styles.css" // import Font Awesome CSS
import 'react-tooltip/dist/react-tooltip.css' // import react-tooltip CSS
import 'react-toastify/dist/ReactToastify.css'; // import react-toastify CSS
import { config } from "@fortawesome/fontawesome-svg-core"
import { AppProvider } from "../context/AppContext"
import { SessionProvider } from "next-auth/react"
import { OverlayProvider } from "../context/OverlayContext";
config.autoAddCss = false // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}) {
  return (
    <SessionProvider session={session}>
      <OverlayProvider>
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
      </OverlayProvider>
    </SessionProvider>
  )
}

export default MyApp
