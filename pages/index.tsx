import dynamic from "next/dynamic";
import Sidebar from "../components/Sidebar";
// import Workspace from "../components/Workspace";

export default function App() {

  const Workspace = dynamic(() => import('../components/Workspace'), {
    ssr: false,
  })

  return (
    <div>
        <div className="flex">
          <Sidebar />
          <Workspace />
        </div>
    </div>
  )
}
