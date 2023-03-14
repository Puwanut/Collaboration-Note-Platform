import Sidebar from "../components/Sidebar";
import Workspace from "../components/Workspace";

export default function App() {
  return (
    <div>
        <div className="flex">
          <Sidebar />
          <Workspace />
        </div>
    </div>
  )
}
