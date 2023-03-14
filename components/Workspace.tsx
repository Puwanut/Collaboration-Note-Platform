import { FormEvent, useEffect, useState } from "react"
import { ReactSortable } from "react-sortablejs"
import Topbar from "./Topbar"
import ReactMarkdown from "react-markdown"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGripVertical } from "@fortawesome/free-solid-svg-icons"
import CommandsOverlay from "./CommandsOverlay"

interface ItemType {
  id: number
  name: string
}

const Workspace = () => {
  const [markdown, setMarkdown] = useState("")
  const [isTop, setIsTop] = useState(true)
  const [data, setData] = useState<string>("")
  const [block, setBlock] = useState<ItemType[]>([
    { id: 1, name: "Workbook 1" },
    { id: 2, name: "Workbook 2" },
    { id: 3, name: "Workbook 3" },
    { id: 4, name: "Workbook 4" },
    { id: 5, name: "Workbook 5" },
  ])
  const [showCommands, setShowCommands] = useState(false)

  // const handleMarkdown = (e) => {
  //   if (e.key === "Enter") {
  //     setMarkdown(markdown + "\n")
  //   }
  //   console.log(markdown)
  // }

  const handleEdit = (e: FormEvent) => {
    const target = e.target as HTMLInputElement
    setMarkdown(target.innerText)
    setData(target.innerText)
    if (target.innerText.startsWith("/")) {
      setShowCommands(true)
    } else {
      setShowCommands(false)
    }
  }

  // const handleNewBlock = (e) => {
  //   if (e.key === "Enter") {
  //     setData([...data, { id: data.length + 1, name: "" }])
  //   }
  // }

  useEffect(() => {
    console.log(block)
  }, [block])

  return (
    <div className={`flex-1`}>
      <Topbar />
      <div className={`mt-12 h-[calc(100vh-3rem)] overflow-y-auto scroll-smooth
                ${isTop ? "overscroll-auto" : "overscroll-none"}`}
        onScroll={(e) =>
          e.currentTarget.scrollTop == 0 ? setIsTop(true) : setIsTop(false)
        }
      >
        <div className="container mb-16 px-4 pt-8 pb-4 lg:max-w-screen-md">
          <h1 className="mb-5 text-5xl font-bold">Home Page</h1>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam
            quisquam aliquam cupiditate ab saepe dolorum doloremque doloribus
            eligendi repellendus deserunt voluptas laboriosam unde ut quae
            dicta, minima placeat quo commodi! Lorem ipsum dolor, sit amet
            consectetur adipisicing elit. Ipsam quisquam aliquam cupiditate ab
            saepe dolorum doloremque doloribus eligendi repellendus deserunt
            voluptas laboriosam unde ut quae dicta, minima placeat quo commodi!
          </p>
          <br />

          {showCommands && <CommandsOverlay text={data} />}
          <div className="disable-global">
            <div
              contentEditable
              onInput={handleEdit}
              // onKeyDown={handleNewBlock}
              className="editable relative outline-none"
              placeholder="Press '/' for commands..."
            ></div>
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>

          <ReactSortable
            list={block}
            setList={setBlock}
            // group="groupName"
            animation={200}
            delayOnTouchOnly={true}
            delay={100}
            swapThreshold={0.65}
            fallbackOnBody={true}
            handle=".handle"
            ghostClass="drop-indicator"
            fallbackTolerance={5}
            // onEnd={handleDragEnd}
          >
            {block.map((item) => (
              <div
                key={item.id}
                className="group flex items-center border-cyan-200"
              >
                <FontAwesomeIcon
                  icon={faGripVertical}
                  className="handle mr-2 p-1 text-neutral-400 opacity-0
                              duration-150
                              hover:bg-slate-200
                              focus:outline-none group-hover:opacity-100
                              " // group-hover is active when the parent is hovered
                />
                <span className={"flex-1 p-2"}>
                  {item.id + ": " + item.name}
                </span>
              </div>
            ))}
          </ReactSortable>
        </div>
      </div>
    </div>
  )
}

export default Workspace
