import { useEffect, useState } from "react"
// import { ReactSortable } from "react-sortablejs"
import Topbar from "./Topbar"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faGripVertical } from "@fortawesome/free-solid-svg-icons"
// import CommandsOverlay from "./CommandsOverlay"
import { v4 as uuidv4 } from "uuid"
import EditableBlock from "./EditableBlock"
import { getCaretStart, setCaretToEnd, setCaretToPosition } from "../lib/setCaret"

interface IEditableBlock {
  id: string
  content: string
  tag: string
}

interface ICurrentBlock {
  id: string
  contentEditableRef: HTMLElement
}

const initialBlock: IEditableBlock = {
  id: uuidv4(),
  content: "",
  tag: "div"
}


const Workspace = () => {
  // const [markdown, setMarkdown] = useState<any>("")
  const [isTop, setIsTop] = useState<boolean>(true)
  // const [commandText, setCommandText] = useState<string>("")
  const [blocks, setBlocks] = useState<IEditableBlock[]>([initialBlock])
  // const [showCommands, setShowCommands] = useState(false)
  const [currentSelectedBlock, setCurrentSelectedBlock] = useState<HTMLElement>()
  const [key, setKey] = useState<string>("")

  // const handleEdit = (e: FormEvent) => {
  //   const target = e.target as HTMLInputElement
  //   setMarkdown(target.innerText)
  //   setCommandText(target.innerText)
  //   // set cursor position next to the user's input
  //   if (target.innerText.startsWith("/")) {
  //     setShowCommands(true)
  //   } else {
  //     setShowCommands(false)
  //   }
  // }

  // Send update function to EditableBlock
  const updatePageHandler = (updatedBlock: IEditableBlock) => {
    const updatedBlocks = blocks.map(block => {
      if (block.id === updatedBlock.id) {
        return {
          ...block,
          content: updatedBlock.content,
          tag: updatedBlock.tag
        }
      }
      else {
        return block
      }
    })
    setBlocks(updatedBlocks)
  }

  const addBlockHandler = (currentBlock: ICurrentBlock) => {
    console.log("++++++++ ADDBLOCK ++++++++")
    const currentCaretPosition = getCaretStart(currentBlock.contentEditableRef)
    const newBlock = {
      id: uuidv4(),
      content: currentBlock.contentEditableRef.textContent.substring(currentCaretPosition),
      tag: "div"
    }
    const currentBlockIndex = blocks.findIndex((block) => block.id === currentBlock.id)

    setBlocks(prevState => {
      const updatedCurrentBlock = {
        ...prevState[currentBlockIndex],
        content: prevState[currentBlockIndex].content.substring(0, currentCaretPosition)
      }
      return [
        ...prevState.slice(0, currentBlockIndex),
        updatedCurrentBlock,
        newBlock,
        ...prevState.slice(currentBlockIndex + 1)
      ]
    })
    // for set focus to new block
    setCurrentSelectedBlock(currentBlock.contentEditableRef)
  }

  const deleteBlockHandler = (currentBlock: ICurrentBlock, key: string) => {
    console.log("-------- DELETE BLOCK --------")
    const previousBlock = currentBlock.contentEditableRef.previousElementSibling as HTMLElement
    const nextBlock = currentBlock.contentEditableRef.nextElementSibling as HTMLElement
    const currentBlockIndex = blocks.findIndex((b) => b.id === currentBlock.id)
    const currentCaretPosition = getCaretStart(currentBlock.contentEditableRef)
    if (key === "Backspace" && previousBlock) { // delete current block and bring text to previous block
      setBlocks((prevState) => {
        const updatedPreviousBlock = {
          ...prevState[currentBlockIndex - 1],
          content: prevState[currentBlockIndex - 1].content + prevState[currentBlockIndex].content
        }
        return [
          ...prevState.slice(0, currentBlockIndex - 1),
          updatedPreviousBlock,
          ...prevState.slice(currentBlockIndex + 1),
        ]
      })
      setCaretToEnd(previousBlock)
    } else if (key === "Delete" && nextBlock) { // delete next block and bring text to current block
      setBlocks(prevState => {
        const currentUpdatedBlock = {
          ...prevState[currentBlockIndex],
          content: prevState[currentBlockIndex].content + prevState[currentBlockIndex + 1].content
        }
        return [
          ...prevState.slice(0, currentBlockIndex),
          currentUpdatedBlock,
          ...prevState.slice(currentBlockIndex + 2)
        ]
      })
      setCaretToPosition(currentBlock.contentEditableRef, currentCaretPosition)
    }

  }

  // when user press enter, focus to next block
  useEffect(() => {
    if (key === "Enter") {
      (currentSelectedBlock.nextElementSibling as HTMLElement).focus()
    }
  }, [blocks.length])

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
          <div className="disable-global space-y-2">
            {blocks.map((block, index) => {
              return (
              <EditableBlock
                key={index}
                id={block.id}
                tag={block.tag}
                content={block.content}
                updatePage={updatePageHandler}
                addNextBlock={addBlockHandler}
                deleteBlock={deleteBlockHandler}
                setCurrentSelectedBlock={setCurrentSelectedBlock}
                setKey={setKey}
              />
            )})}
          </div>



          {/* <ReactSortable
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
                className="group flex border-cyan-200"
              >
                <FontAwesomeIcon
                  icon={faGripVertical}
                  className="handle mt-2 mr-2 p-1 text-neutral-400 opacity-0
                              duration-150
                              hover:bg-slate-200
                              focus:outline-none group-hover:opacity-100
                              " // group-hover is active when the parent is hovered
                />
                <span className={"flex-1 p-2"}>
                  {showCommands && <CommandsOverlay text={commandText} />}
                  <div className="disable-global">
                    <div
                      contentEditable
                      onInput={handleEdit}
                      // onKeyDown={handleNewBlock}
                      className="editable relative outline-none"
                      placeholder="Press '/' for commands..."
                    ></div>
                  </div>
                </span>
              </div>
            ))}
          </ReactSortable> */}
        </div>
      </div>
    </div>
  )
}

export default Workspace
