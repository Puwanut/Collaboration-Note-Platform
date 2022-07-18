import Topbar from "./Topbar";

const Workspace = () => {


    return (
        // <div className="p-7 text-2xl font-semibold flex-1 h-screen container"></div>
        <div className="flex-1">
            <Topbar />

            <div className="mt-16 container mx-auto">
                <h1 className="text-5xl font-bold mb-5">Home Page</h1>
                <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Ipsam quisquam aliquam cupiditate ab saepe dolorum doloremque doloribus
                    eligendi repellendus deserunt voluptas laboriosam unde ut quae dicta,
                    minima placeat quo commodi!
                </p>

            </div>


        </div>
    )
}

export default Workspace;