import { useRef, useEffect, KeyboardEvent, useState } from "react"
import ContentEditable, { ContentEditableEvent } from "react-contenteditable"
import { getCaretStart, setCaretToPosition } from "../lib/setCaret"
import * as htmlparser2 from "htmlparser2"
import { decodeHTML } from "entities"
import { faGripVertical, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { titleConcatenate } from "../lib/titleConcatenate"

const typeMapTag = {
    "text": "div",
    "h1": "h1",
    "h2": "h2",
    "h3": "h3",
    "img": "img",
}

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

const EditableBlock = ({ block, updatePage, addNextBlock, deleteBlock, setCurrentSelectedBlock, dataPosition }) => {
    const [titleArray, setTitleArray] = useState<string[][]>(block.properties.title)
    const [title, setTitle] = useState<string>(titleConcatenate(block.properties.title))
    const contentEditableRef = useRef<HTMLElement>(null)
    const [tag] = useState<string>(typeMapTag[block.type])

    const onChangeHandler = (e: ContentEditableEvent) => {
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
        parser.write(e.target.value)
        parser.end()
        setTitleArray(newTitleArray) // to update current title properties
        setTitle(e.target.value) // to update text in contentEditable (for same caret position)
    }

    const onSelectHandler = () => {
        setCurrentSelectedBlock(contentEditableRef.current)
        // currentSelectedBlock.current = contentEditableRef.current
    }

    const onKeyDownHandler = (e: KeyboardEvent) => {
        switch (e.key) {
            case "ArrowUp": {
                e.preventDefault()
                const previousBlock = contentEditableRef.current.previousElementSibling as HTMLElement
                if (previousBlock) {
                    setCaretToPosition(previousBlock, Math.min(e.target.textContent.length, previousBlock.textContent.length))
                }
                break
            }
            case "ArrowDown": {
                e.preventDefault()
                const nextBlock = contentEditableRef.current.nextElementSibling as HTMLElement
                if (nextBlock) {
                    setCaretToPosition(nextBlock, Math.min(e.target.textContent.length, nextBlock.textContent.length))
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

    // update when Parent rerenders
    useEffect(() => {
        console.log("USEEFFECT: Set Title",  `[${dataPosition}]`,block.id)
        setTitle(titleConcatenate(block.properties.title))
        // setTag(typeMapTag[block.type])
    }, [block.properties.title])


    // update blocks in parent
    useEffect(() => {
        console.log("USEEFFECT 2: Update block.properties.title on titleArray change")
        updatePage({
            ...block,
            type: "text",
            properties: {
                ...block.properties,
                title: titleArray
            }
        })
    }, [titleArray])

    return (
      <div className="group flex mb-1">
        <div className="mr-2 space-x-1 text-neutral-400 opacity-0 duration-150 focus:outline-none group-hover:opacity-100">
          <FontAwesomeIcon
            icon={faPlus}
            className="p-1.5 duration-150 hover:bg-slate-100" // group-hover is active when the parent is hovered
          />
          <FontAwesomeIcon
            icon={faGripVertical}
            className="handle p-1.5 duration-150 hover:bg-slate-100" // group-hover is active when the parent is hovered
          />
        </div>
        <ContentEditable
          key={dataPosition} // to rerender when dataPosition changes
          className="flex-1 p-1 overflow-hidden whitespace-pre-wrap bg-slate-100 outline-none"
          innerRef={contentEditableRef} // forwards the ref to the DOM node
          html={title}
          tagName={tag}
          onChange={onChangeHandler}
          onKeyDown={onKeyDownHandler}
          onFocus={onSelectHandler}
          data-position={dataPosition}
        />
      </div>
    );
}

export default EditableBlock