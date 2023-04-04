import { useRef, useEffect, KeyboardEvent, useState } from "react"
import ContentEditable, { ContentEditableEvent } from "react-contenteditable"
import { getCaretCoordinates, getCaretStart, isCaretOnBottom, isCaretOnTop, moveCaret, setCaretToEnd, setCaretToStart } from "../lib/setCaret"
import * as htmlparser2 from "htmlparser2"
import { decodeHTML } from "entities"
import { faGripVertical, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { titleConcatenate } from "../lib/titleConcatenate"
import { Tooltip } from "react-tooltip"
import MenuOverlay from "./MenuOverlay"
import { typeMapTag } from "../shared/blockType"
import { getKeyByValue } from "../lib/getKeyByValue"
import { useClickAway } from "react-use"

// const titleConcatenate = (titleArray: string[][]) => {
//     const text = titleArray.map((textArray) => {
//         const textType = textArray?.[1]
//         const textContent = escapeUTF8(textArray[0]).replace(/&apos;/g, "'").replace(/&quot;/g, '"')
//         if (textType) {
//             return `<${textType}>${textContent}</${textType}>`
//         }
//         return textContent
//     })
//     return text.join("")
// }

const EditableBlock = ({ block, updatePage, addNextBlock, deleteBlock, setCurrentSelectedBlock, dataPosition, setKey }) => {
    const [titleArray, setTitleArray] = useState<string[][]>(block.properties.title)
    const [title, setTitle] = useState<string>(titleConcatenate(block.properties.title))
    const contentEditableRef = useRef<HTMLElement>(null)
    const [tag, setTag] = useState<string>(typeMapTag[block.type])

    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const menuRef = useRef<HTMLDivElement>(null)

    const titleParser = (htmlString: string): string[][] => {
        const newTitleArray = []
        let currentTag = ""
        // parse html to array
        const parser = new htmlparser2.Parser({
            onopentag: (tagname) => {
                currentTag = tagname
            },
            ontext: (text) => {
                newTitleArray.push(!currentTag ? [decodeHTML(text)] : [decodeHTML(text), currentTag])
            },
            onclosetag: () => {
                currentTag = ""
            }
        }, { decodeEntities: false }) // to prevent html entities from being decoded (e.g. &lt; to <)
        parser.write(htmlString)
        parser.end()
        return newTitleArray
    }

    const onChangeHandler = (e: ContentEditableEvent) => {
        // prevent <br> from being added to contentEditable after deleting text until line is blank
        // and ensure that line still present even if no any text in line
        const newText = e.target.value.replace("<br>", "\n")

        const newTitleArray = titleParser(newText)
        setTitleArray(newTitleArray) // to update current title properties
        setTitle(newText) // to update text in contentEditable (for same caret position)
    }

    const onSelectHandler = () => {
        setCurrentSelectedBlock(contentEditableRef.current)
        // currentSelectedBlock.current = contentEditableRef.current
    }

    const handleDeleteLineBreak = (e: KeyboardEvent) => {
        const input = e.target as HTMLInputElement
        const countNewLine = input.innerText.match(/\n*$/g)[0].length
        if (input.innerText.endsWith("\n\n") && countNewLine === 2) {
            e.preventDefault()
            setTitleArray(titleParser(e.currentTarget.innerHTML.replace("\n\n", "")))
            setTitle(e.currentTarget.innerHTML.replace("\n\n", ""))
        }
    }

    const onKeyDownHandler = (e: KeyboardEvent) => {
        setKey(e)
        switch (e.key) {
            case "ArrowLeft": {
                // if caret is at start of block, move caret to end of previous block
                // else do default behaviour
                const isCaretAtStart = getCaretStart(contentEditableRef.current) === 0
                if (isCaretAtStart) {
                    e.preventDefault()
                    const previousBlock = document.querySelector(`[data-position="${dataPosition - 1}"]`) as HTMLElement
                    if (previousBlock) {
                        setCaretToEnd(previousBlock)
                        console.log("[Move to end]")
                    }
                }
                break
            }
            case "ArrowRight": {
                // if caret is at end of block, move caret to start of next block
                // else do default behaviour
                console.log(e.currentTarget.textContent.length, getCaretStart(contentEditableRef.current))
                if (getCaretStart(contentEditableRef.current) === e.target.textContent.length) {
                    e.preventDefault()
                    const nextBlock = document.querySelector(`[data-position="${dataPosition + 1}"]`) as HTMLElement
                    if (nextBlock) {
                        setCaretToStart(nextBlock)
                        console.log("[Move to start]")
                    }
                }
                break
            }
            case "ArrowUp": {
                // if caret is on top of block, move caret to same x of previous block
                // else do default behaviour
                if (isCaretOnTop()) {
                    console.log("Top")
                    e.preventDefault()
                    const previousBlock = document.querySelector(`[data-position="${dataPosition - 1}"]`) as HTMLElement
                    if (previousBlock) {
                        const { caretLeft } = getCaretCoordinates()
                        const { bottom: previousBlockBottom } = previousBlock.getBoundingClientRect()
                        const lastLinePreviousBlockOffsetTop = previousBlockBottom + 5 - parseInt(window.getComputedStyle(previousBlock).getPropertyValue("line-height"))
                        moveCaret(caretLeft, lastLinePreviousBlockOffsetTop)
                        console.log("[Move to]", caretLeft, lastLinePreviousBlockOffsetTop)
                    }
                }
                break
            }
            case "ArrowDown": {
                // if caret is on bottom of block, move caret to same x of next block
                // else do default behaviour
                if (isCaretOnBottom()) {
                    console.log("Bottom")
                    e.preventDefault()
                    const nextBlock = document.querySelector(`[data-position="${dataPosition + 1}"]`) as HTMLElement
                    if (nextBlock) {
                        const { caretLeft } = getCaretCoordinates() // true to get Caret coordinates from last text node
                        const { top: nextBlockTop } = nextBlock.getBoundingClientRect()
                        moveCaret(caretLeft, nextBlockTop + 5) // +5 for padding
                        console.log("[Move to]", caretLeft, nextBlockTop + 5)
                    }
                }
                break
            }
            case "Enter": {
                if (!e.shiftKey) {
                    e.preventDefault()
                    addNextBlock({
                        id: block.id,
                        contentEditableRef: contentEditableRef.current
                    })
                }
                break
            }
            case "Backspace": {
                handleDeleteLineBreak(e)
                const textBeforeCaret = e.target.textContent.substring(0, getCaretStart(contentEditableRef.current))
                if (!textBeforeCaret) {
                    e.preventDefault()
                    deleteBlock({
                        id: block.id,
                        contentEditableRef: contentEditableRef.current,
                    }, e.key)
                }
                break
            }
            case "Delete": {
                handleDeleteLineBreak(e)
                const endOfLine = getCaretStart(contentEditableRef.current) === e.target.textContent.length
                if (endOfLine) {
                    e.preventDefault()
                    deleteBlock({
                        id: block.id,
                        contentEditableRef: contentEditableRef.current,
                    }, e.key)
                }
                break
            }
            default: {
                break
            }
        }
    }

    // update when block is changed
    useEffect(() => {
        // console.log("USEEFFECT: Set Title",  `[${dataPosition}]`,block.id)
        setTitle(titleConcatenate(block.properties.title))
        setTitleArray(block.properties.title)
        // setTag(typeMapTag[block.type])
    }, [block.properties.title])


    // update blocks in parent
    useEffect(() => {
        console.log("USEEFFECT 2: UpdatePage", `[${dataPosition}], [${block.id}]`)
        updatePage({
            ...block,
            type: getKeyByValue(typeMapTag, tag),
            properties: {
                ...block.properties,
                title: titleArray
            }
        })
    }, [titleArray, tag])

    // Close menu when clicking outside
    useClickAway(menuRef, () =>
        setMenuOpen(false)
    )

    return (
      <div
        data-block-id={block.id}
        className={`relative
        ${block.type === "Heading 1" && "mb-1 mt-8"}
        ${block.type === "Heading 2" && "mb-px mt-6"}
        ${block.type === "Heading 3" && "mb-px mt-4"}
    `}
      >
        {menuOpen && (
          <MenuOverlay
            activeBlockType={block.type}
            setTag={setTag}
            setMenuOpen={setMenuOpen}
            deleteBlock={() => deleteBlock({ id: block.id, contentEditableRef: contentEditableRef.current })}
            ref={menuRef}
          />
        )}
        <div className="group/button mb-1 flex w-full">
          <div className="mr-2 flex space-x-1 text-neutral-400 opacity-0 duration-150 group-hover/button:opacity-100">
            <FontAwesomeIcon
              icon={faPlus}
              className="cursor-grab p-1.5 outline-none duration-150 hover:bg-slate-100" // group-hover is active when the parent is hovered
              data-tooltip-id="tooltip-add-block"
              data-tooltip-delay-show={200}
            />
            <FontAwesomeIcon
              icon={faGripVertical}
              className="handle cursor-grab p-1.5 outline-none duration-150 hover:bg-slate-100" // group-hover is active when the parent is hovered
              data-tooltip-id="tooltip-menu"
              data-tooltip-delay-show={200}
              onClick={() => setMenuOpen((prev) => !prev)}
            />
            <Tooltip id="tooltip-add-block" className="z-20" place="bottom" noArrow>
              <div className="text-center text-xs font-bold text-neutral-400">
                <span className="text-neutral-100">Click</span> to add a block
              </div>
            </Tooltip>
            <Tooltip id="tooltip-menu" className="z-20" place="bottom" noArrow>
              <div className="text-center text-xs font-bold text-neutral-400">
                <p>
                  <span className="text-neutral-100">Drag</span> to move
                </p>
                <p>
                  <span className="text-neutral-100">Click</span> to open menu
                </p>
              </div>
            </Tooltip>
          </div>
          <ContentEditable
            key={dataPosition} // to rerender when dataPosition changes
            className="w-full whitespace-pre-wrap break-words bg-slate-100 p-1 outline-none"
            style={{ wordBreak: "break-word" }} // workaround for break long words
            innerRef={contentEditableRef} // forwards the ref to the DOM node
            html={title}
            tagName={tag}
            onChange={onChangeHandler}
            onKeyDown={onKeyDownHandler}
            onFocus={onSelectHandler}
            data-position={dataPosition}
          />
        </div>
      </div>
    );
}

export default EditableBlock
