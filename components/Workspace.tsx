import { useEffect, useState } from "react"
import { ReactSortable } from "react-sortablejs"
import Topbar from "./Topbar"
// import CommandsOverlay from "./CommandsOverlay"/
import { v4 as uuidv4 } from "uuid"
import EditableBlock from "./EditableBlock"
import { getCaretStart, setCaretToEnd, setCaretToStart } from "../lib/setCaret"
import Head from "next/head"
import usePrevious from "../hooks/usePrevious"


export interface IEditableBlock {
  id: string
  type: string
  properties: {
    title: string[][] // [["text", "bold"], ["text", "italic"]
    checked?: boolean
  }
  children?: string[]
  parent?: string
}

interface ICurrentBlock {
  id: string
  contentEditableRef: HTMLElement
}



// const initialBlock: IEditableBlock = {
//   id: uuidv4(),
//   type: "text",
//   properties: {
//     title: []
//   },
//   children: [],
//   parent: null
// }

// titleSlice function
// input
// titleArray: [["normal"], ["testbold", "b"], ["testitalic", "i"]]
// start: 10
// end: null
// output
// [["bold", "b"], ["testitalic", "i"]]

// input
// titleArray: [["normal"], ["testbold", "b"], ["testitalic", "i"]]
// start: 0
// end: 10
// output
// [["normal"], ["test", "b"]]


const titleSlice = (titleArray: string[][], start: number, end?: number) => {
  let currentLength = 0
  const titleUpdatedArray = [...titleArray]
  for (let index = 0; index < titleArray.length; index++) {
    const textArray = titleArray[index] // ['456']
    const textLength = textArray[0].length
    // Slice title for new block
    if (currentLength + textLength > start && end === undefined) { // 3 >= 10
      const format = textArray?.[1]
      if (format) {
        titleUpdatedArray[index] = [textArray[0].substring(start - currentLength), format]
      } else {
        titleUpdatedArray[index] = [textArray[0].substring(start - currentLength)]
      }
      return titleUpdatedArray.slice(index)
    }
    // Slice title for current block
    else if (currentLength + textLength >= end && end !== undefined) {
      const format = textArray?.[1]
      if (format) {
        titleUpdatedArray[index] = [textArray[0].substring(0, end - currentLength), format]
      } else {
        titleUpdatedArray[index] = [textArray[0].substring(0, end - currentLength)]
      }
      return titleUpdatedArray.slice(0, index + 1)
    }
    currentLength += textLength
  }
  return []
}

const Workspace = () => {
  // const [markdown, setMarkdown] = useState<any>("")
  const [isTop, setIsTop] = useState<boolean>(true)
  // const [commandText, setCommandText] = useState<string>("")
  const [blocks, setBlocks] = useState<IEditableBlock[]>([])
  // const [showCommands, setShowCommands] = useState(false)
  const [currentSelectedBlock, setCurrentSelectedBlock] = useState<HTMLElement>(null)
  // const currentSelectedBlock = useRef<HTMLElement>(null) // useRef for unnessary re-render
  const [key, setKey] = useState<KeyboardEvent>(null)
  const [previousBlocks, titlesLength] = usePrevious(blocks)

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

    setBlocks(prevState => {
      const updatedBlocks = prevState.map(block => {
        if (block.id === updatedBlock.id) {
          return updatedBlock
        } else {
          return block
        }
      })
      return updatedBlocks
    })
    // console.log("[WORKSPACE] UPDATE BLOCKS")
  }

  const addBlockHandler = (currentBlock: ICurrentBlock) => {
    console.log("++++++++ ADDBLOCK ++++++++")
    const currentCaretPosition = getCaretStart(currentBlock.contentEditableRef)
    const currentBlockIndex = blocks.findIndex((block) => block.id === currentBlock.id)
    setBlocks(prevState => {
      const newBlock = {
        id: uuidv4(),
        type: "text",
        properties: {
          title: titleSlice(prevState[currentBlockIndex].properties.title, currentCaretPosition)
        },
        children: [],
        parent: null
      }
      const updatedCurrentBlock = {
        ...prevState[currentBlockIndex],
        properties: {
          title: titleSlice(prevState[currentBlockIndex].properties.title, 0, currentCaretPosition)
        }
      }
      return [
        ...prevState.slice(0, currentBlockIndex),
        updatedCurrentBlock,
        newBlock,
        ...prevState.slice(currentBlockIndex + 1)
      ]
    })
    setCurrentSelectedBlock(currentBlock.contentEditableRef)
    // currentSelectedBlock.current = currentBlock.contentEditableRef
    // for set focus to new block
  }

  const deleteBlockHandler = (currentBlock: ICurrentBlock, key?: string) => {
    console.log("-------- DELETE BLOCK --------")
    const currentBlockIndex = blocks.findIndex((b) => b.id === currentBlock.id)
    // const currentCaretPosition = getCaretStart(currentBlock.contentEditableRef)
    const previousBlock = document.querySelector(`[data-position="${currentBlockIndex - 1}"]`) as HTMLElement
    const nextBlock = document.querySelector(`[data-position="${currentBlockIndex + 1}"]`) as HTMLElement
    if (key === "Backspace" && previousBlock) { // delete current block and bring text to previous block
      setBlocks(prevState => {
        const updatedPreviousBlock = {
          ...prevState[currentBlockIndex - 1],
          properties: {
            title: [...prevState[currentBlockIndex - 1].properties.title, ...prevState[currentBlockIndex].properties.title]
          }
        }
        return [
          ...prevState.slice(0, currentBlockIndex - 1),
          updatedPreviousBlock,
          ...prevState.slice(currentBlockIndex + 1),
        ]
      })
    } else if (key === "Delete" && nextBlock) { // delete next block and bring text to current block
      setBlocks(prevState => {
        const currentUpdatedBlock = {
          ...prevState[currentBlockIndex],
          properties: {
            title: [...prevState[currentBlockIndex].properties.title, ...prevState[currentBlockIndex + 1].properties.title]
          }
        }
        return [
          ...prevState.slice(0, currentBlockIndex),
          currentUpdatedBlock,
          ...prevState.slice(currentBlockIndex + 2)
        ]
      })
    } else if (!key) { // delete current block from menu
      setBlocks(prevState => {
        return [
          ...prevState.slice(0, currentBlockIndex),
          ...prevState.slice(currentBlockIndex + 1)
        ]
      })
    }
  }

  // Handle Caret Position
  useEffect(() => {
    // console.log("[CURRENT]", currentSelectedBlock)
    // console.log(previousBlocks, previousBlocks?.length, blocks?.length)
    const currentBlockPosition = currentSelectedBlock?.getAttribute("data-position")
    // when user press enter, focus to next block
    if (previousBlocks && previousBlocks.length + 1 === blocks.length) {
      const nextBlock = document.querySelector(`[data-position="${parseInt(currentBlockPosition) + 1}"]`) as HTMLElement
      if (nextBlock) {
        setCurrentSelectedBlock(nextBlock)
        setCaretToStart(nextBlock)
      }
    }
    else if (previousBlocks && previousBlocks.length - 1 === blocks.length){
      if (key?.key === "Backspace") {
        const previousBlockIndex = parseInt(currentBlockPosition) - 1
        const previousBlock = document.querySelector(`[data-position="${previousBlockIndex}"]`) as HTMLElement
        if (previousBlock) {
          console.log("[PREV]", previousBlock, titlesLength)
          setCurrentSelectedBlock(previousBlock)
          // if (titlesLength[previousBlockIndex] === 0) {
          setCaretToEnd(previousBlock)
          // }
          // else {
          //   setSelectionRange(previousBlock, titlesLength[previousBlockIndex], titlesLength[previousBlockIndex])
          // }
        }
      } // key === "Delete" setCaretToStart
    }

  }, [blocks, previousBlocks])

  // Mockup initial blocks
  useEffect(() => {
    const initialBlock: IEditableBlock = {
      id: uuidv4(),
      type: "Text",
      properties: {
        title: [["<script>bold</script>"], ["testbold", "b"], ["testitalic very long long long long long long long long text", "i"]
        , ["testitalic very long long long long long long long long text", "i"]
      ]
      },
      children: [],
      parent: null
    }

    const initialBlock2: IEditableBlock = {
      id: uuidv4(),
      type: "Text",
      properties: {
        title: [["stronger", "b"], ["aeeng", "i"]]
      },
      children: [],
      parent: null
    }
    setBlocks([initialBlock, initialBlock2])
  }, [])


  return (
    <div className={`flex-1`}>
      <Head>
        <title>Notion Clone By Puwanut</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Topbar />
      <div
        className={`mt-12 h-[calc(100vh-3rem)] overflow-y-auto scroll-smooth
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
          <div className="revert-global">
            <ReactSortable
              list={blocks}
              setList={setBlocks}
              // group="groupName"
              animation={200}
              delayOnTouchOnly={true}
              delay={100}
              swapThreshold={0.65}
              fallbackOnBody={true}
              handle=".handle"
              ghostClass="drop-indicator"
              fallbackTolerance={10}
              id="SortableList"
              // onEnd={handleDragEnd}
            >
              {blocks.map((block, index) => {
                return (
                // {showCommands && <CommandsOverlay text={commandText} />}
                <EditableBlock
                  key={block.id}
                  block={block}
                  updatePage={updatePageHandler}
                  addNextBlock={addBlockHandler}
                  deleteBlock={deleteBlockHandler}
                  setCurrentSelectedBlock={setCurrentSelectedBlock}
                  dataPosition={index}
                  setKey={setKey}
                />
              )})}
            </ReactSortable>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Workspace
