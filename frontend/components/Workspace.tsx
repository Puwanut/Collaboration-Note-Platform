import { useEffect, useState } from "react"
import { ReactSortable } from "react-sortablejs"
import { v4 as uuidv4 } from "uuid"
import EditableBlock from "./EditableBlock"
import { getCaretStart, setCaretToEnd, setCaretToStart } from "../lib/setCaret"
import Head from "next/head"
import usePrevious from "../hooks/usePrevious"
import { LanguageName } from "@uiw/codemirror-extensions-langs"
import { titleSlice } from "../lib/manageTitle"
import { useAppContext } from "../context/AppContext"


export interface IEditableBlock {
  id: string
  type: string
  properties: {
    title: string[][] // [["text", "bold"], ["text", "italic"]
    checked?: boolean
    language?: LanguageName | "plaintext"
  }
  children?: string[]
  parent?: string
}

interface ICurrentBlock {
  id: string
  contentEditableRef: HTMLElement
}

const Workspace = () => {
  const { currentPage } = useAppContext()
  const [isTop, setIsTop] = useState<boolean>(true)
  const [blocks, setBlocks] = useState<IEditableBlock[]>(currentPage?.blocks ?? [])
  const [currentSelectedBlock, setCurrentSelectedBlock] = useState<HTMLElement>(null)
  const [key, setKey] = useState<KeyboardEvent>(null)
  const [previousBlocks, titlesLength] = usePrevious(blocks)

  // Send update function to EditableBlock
  const updateBlocksHandler = (updatedBlock: IEditableBlock) => {
    console.log("update page")
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

  const addBlockHandler = (currentBlock: ICurrentBlock, options: Record<string, string>) => {
    console.log("++++++++ ADDBLOCK ++++++++")
    const currentBlockIndex = blocks.findIndex((block) => block.id === currentBlock.id)
    if (options.actionSrc === "Enter") {
      const currentCaretPosition = getCaretStart(currentBlock.contentEditableRef)
      setCurrentSelectedBlock(currentBlock.contentEditableRef)
      setBlocks(prevState => {
        const newBlock = {
          id: uuidv4(),
          type: options.blockType,
          properties: {
            title: titleSlice(prevState[currentBlockIndex].properties.title, currentCaretPosition)
          },
          children: [],
          parent: null
        }
        const updatedCurrentBlock = {
          ...prevState[currentBlockIndex],
          properties: {
            ...prevState[currentBlockIndex].properties,
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
    } else if (options.actionSrc === "MenuClick" || options.actionSrc === "CommandSelect") {
      setCurrentSelectedBlock(currentBlock.contentEditableRef)
      setBlocks(prevState => {
        const newBlock = {
          id: uuidv4(),
          type: options.blockType ?? "Text",
          properties: {
            title: []
          },
          children: [],
          parent: null
        }
        return [
          ...prevState.slice(0, currentBlockIndex+1),
          newBlock,
          ...prevState.slice(currentBlockIndex+1)
        ]
      })
    } else if (options.actionSrc === "MenuAltClick") {
      setCurrentSelectedBlock(
        document.querySelector(`[data-position="${currentBlockIndex - 1}"]`) as HTMLElement ??
        currentBlock.contentEditableRef
      ) // Workaround for focus to previous block (not working on first block)
      setBlocks(prevState => {
        const newBlock = {
          id: uuidv4(),
          type: options?.blockType ?? "Text",
          properties: {
            title: []
          },
          children: [],
          parent: null
        }
        return [
          ...prevState.slice(0, currentBlockIndex),
          newBlock,
          ...prevState.slice(currentBlockIndex)
        ]
      })
    }
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

  const getNumberedListOrder = (currentBlockIndex: number): number => {
    const beforeBlocks = blocks.slice(0, currentBlockIndex).reverse()
    let counter = 1
    for (let i = 0; i < beforeBlocks.length; i++) {
      if (beforeBlocks[i].type === "Numbered List") {
        counter++
      } else {
        break
      }
    }
    return counter
  }

  // Handle Caret Position
  useEffect(() => {
    // console.log("[CURRENT]", currentSelectedBlock)
    // console.log(previousBlocks, previousBlocks?.length, blocks?.length)
    const currentBlockPosition = currentSelectedBlock?.getAttribute("data-position")
    // when user press enter, focus to next block
    if (previousBlocks && previousBlocks.length + 1 === blocks?.length) {
      const nextBlock = document.querySelector(`[data-position="${parseInt(currentBlockPosition) + 1}"]`) as HTMLElement
      if (nextBlock) {
        setCurrentSelectedBlock(nextBlock)
        setCaretToStart(nextBlock)
        nextBlock.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
    else if (previousBlocks && previousBlocks.length - 1 === blocks?.length){
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

  }, [blocks])


  // Mockup initial blocks
  // useEffect(() => {
  //   const initialBlock: IEditableBlock = {
  //     id: uuidv4(),
  //     type: "Text",
  //     properties: {
  //       title: [["<script>bold</script>"], ["testbold", "b"], ["testitalic very long long long long long long long long text", "i"]
  //       , ["testitalic very long long long long long long long long text", "i"]
  //     ]
  //     },
  //     children: [],
  //     parent: null
  //   }

  //   const initialBlock2: IEditableBlock = {
  //     id: uuidv4(),
  //     type: "Numbered List",
  //     properties: {
  //       title: [["stronger", "b"], ["aeeng", "i"]]
  //     },
  //     children: [],
  //     parent: null
  //   }

  //   const initialBlock3: IEditableBlock = {
  //     id: uuidv4(),
  //     type: "Numbered List",
  //     properties: {
  //       title: [["simpleText"]]
  //     },
  //     children: [],
  //     parent: null
  //   }

  //   const initialBlock4: IEditableBlock = {
  //     id: uuidv4(),
  //     type: "Code",
  //     properties: {
  //       title: [["const a = 1\nconst b = 2\nconsole.log(a+b)"]],
  //       language: "javascript"
  //     },
  //     children: [],
  //     parent: null
  //   }

  //   const initialBlock5: IEditableBlock = {
  //     id: uuidv4(),
  //     type: "Text",
  //     properties: {
  //       title: [[""]],
  //     },
  //     children: [],
  //     parent: null
  //   }
  //   setBlocks([initialBlock, initialBlock2, initialBlock3, initialBlock4, initialBlock5])
  // }, [])

  useEffect(() => {
    setBlocks(currentPage?.blocks)
  }, [currentPage])

  return (
    <>
      <Head>
        <title>Notion Clone By Puwanut</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        // height = 100vh - 3rem (topbar height)
        className={`pt-20 pb-24 h-[calc(100vh-3rem)] overflow-y-auto scroll-smooth
                ${isTop ? "overscroll-auto" : "overscroll-none"}`}
        onScroll={(e) =>
          e.currentTarget.scrollTop == 0 ? setIsTop(true) : setIsTop(false)
        }
      >
        <div className="mx-auto pl-2 pr-8 max-w-screen-md">
          <h1 id="page-title" className="ml-16 mb-5 text-5xl font-bold">
            {currentPage?.title}
            <hr className="mt-5" />
          </h1>
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
              {
              blocks?.map((block, index) => {
                const numberedListOrder = getNumberedListOrder(index)
                return (
                  <EditableBlock
                    key={block.id}
                    block={block}
                    updateBlocks={updateBlocksHandler}
                    addNextBlock={addBlockHandler}
                    deleteBlock={deleteBlockHandler}
                    setCurrentSelectedBlock={setCurrentSelectedBlock}
                    numberedListOrder={numberedListOrder}
                    dataPosition={index}
                    setKey={setKey}
                  />
              )})}
            </ReactSortable>
          </div>

        </div>
      </div>
    </>
  );
}

export default Workspace
