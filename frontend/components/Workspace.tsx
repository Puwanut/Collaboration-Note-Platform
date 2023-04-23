import { KeyboardEvent, useEffect, useState } from "react"
import { ReactSortable } from "react-sortablejs"
import { v4 as uuidv4 } from "uuid"
import EditableBlock from "./EditableBlock"
import { getCaretStart, isCaretOnBottomOfTitle, setCaretToEnd, setCaretToStart } from "../lib/setCaret"
import Head from "next/head"
import usePrevious from "../hooks/usePrevious"
import { LanguageName } from "@uiw/codemirror-extensions-langs"
import { titleSlice } from "../lib/manageTitle"
import { useAppContext } from "../context/AppContext"
import ContentEditable from "react-contenteditable"
import { useDebounce } from "react-use"
import { useSession } from "next-auth/react"
import { moveCaret } from "../lib/setCaret"

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
  const { currentPage, setCurrentPage, setCurrentWorkspaceData } = useAppContext()
  const { data: session } = useSession()
  const [pageTitle, setPageTitle] = useState<string>(currentPage?.title ?? "")
  const [isTop, setIsTop] = useState<boolean>(true)
  const [blocks, setBlocks] = useState<IEditableBlock[]>(currentPage?.blocks ?? [])
  const [currentSelectedBlock, setCurrentSelectedBlock] = useState<HTMLElement>(null)
  const [key, setKey] = useState<KeyboardEvent>(null)
  const [previousBlocks, titlesLength] = usePrevious(blocks)

  const titleKeyDownHandler = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Enter": {
        e.preventDefault()
        setBlocks((prevState) => {
          const newBlock = {
            id: uuidv4(),
            type: "Text",
            properties: {
              title: [],
            },
          };
          return [newBlock, ...prevState]
        });
        break
      }
      case "ArrowDown": {
        if (isCaretOnBottomOfTitle()) {
          e.preventDefault()
          const firstBlock = (document.querySelector(`[data-position="0"]`) as HTMLElement).getBoundingClientRect()
          const currentCaretPosition = document.getSelection().getRangeAt(0).getBoundingClientRect()
          moveCaret(currentCaretPosition.x, firstBlock.y)
        }
        break
      }
      case "ArrowRight": {
        const titleDiv = document.getElementById("page-title-workspace")
        if (titleDiv.innerText.length === getCaretStart(titleDiv)) {
          e.preventDefault()
          const firstBlock = (document.querySelector(`[data-position="0"]`) as HTMLElement).getBoundingClientRect()
          moveCaret(firstBlock.x, firstBlock.y)
        }
        break
      }
    }
  }


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
    if (currentPage) {
      setBlocks(currentPage.blocks)
      setPageTitle(currentPage.title)
    }
  }, [currentPage])

  useDebounce(async () => {
    // to Update Page Title among components
    setCurrentPage(prevState => {
      return { ...prevState, title: pageTitle, blocks: blocks }
    })
    // to Update Page Title in sidebar (after change page)
    setCurrentWorkspaceData(prev => ({
      ...prev,
      pages: prev.pages.map(page => page.id === currentPage.id ? { ...page, title: pageTitle } : page)
    }))
    // to Update Page in database
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/${currentPage.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.user.accessToken}`,
      },
      body: JSON.stringify({
        title: pageTitle,
        blocks: blocks,
      }),
    })
  }, 500, [pageTitle, blocks])

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        // height = 100vh - 3rem (topbar height)
        id="page-workspace"
        className={`pt-20 pb-24 h-[calc(100vh-3rem)] overflow-y-auto scroll-smooth
                ${isTop ? "overscroll-auto" : "overscroll-none"}`}
        onScroll={(e) =>
          e.currentTarget.scrollTop == 0 ? setIsTop(true) : setIsTop(false)
        }
      >
        <div className="mx-auto pl-2 pr-8 max-w-screen-md">
          <ContentEditable
            id="page-title-workspace"
            tagName="h1"
            html={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            onKeyDown={(e) => titleKeyDownHandler(e)}
            className="ml-16 mb-5 text-5xl font-bold leading-tight whitespace-pre-wrap outline-none cursor-text empty:before:content-[attr(data-placeholder)] empty:before:text-neutral-200"
            data-placeholder="Untitled"
          />
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
