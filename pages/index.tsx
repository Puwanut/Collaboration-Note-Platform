import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Workspace from "../components/Workspace";

export default function App() {

  // fetch data from backend here

  return (
    <>
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <Topbar />
            <Workspace />
          </div>
        </div>
    </>
  )
}
