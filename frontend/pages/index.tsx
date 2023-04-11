import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Workspace from "../components/Workspace";

export default function App() {

  return (
    <>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 min-w-0">
            <Topbar />
            <Workspace />
          </div>
        </div>
    </>
  )
}
