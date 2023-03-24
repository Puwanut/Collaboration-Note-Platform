import { useRef, useEffect, KeyboardEvent, useState } from "react"
import ContentEditable, { ContentEditableEvent } from "react-contenteditable"
import { getCaretStart, setCaretToPosition } from "../lib/setCaret"

const EditableBlock = ({ id, content, tag, updatePage, addNextBlock, deleteBlock, setCurrentSelectedBlock, setKey }) => {
    // const contentRef = useRef(content)
    const [contentText, setContentText] = useState(content)
    const contentEditableRef = useRef<HTMLElement>(null)

    const onChangeHandler = (e: ContentEditableEvent) => {
        // contentRef.current = e.target.value
        setContentText(e.target.value)
    }

    const onClickHandler = () => {
        // console.log(contentEditableRef.current)
        setCurrentSelectedBlock(contentEditableRef.current)
    }

    const onKeyDownHandler = (e: KeyboardEvent) => {
        setKey(e.key)
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
                        id: id,
                        contentEditableRef: contentEditableRef.current,
                    })
                }
                break
            }
            case "Backspace": {
                const textBeforeCaret = e.target.textContent.substring(0, getCaretStart(contentEditableRef.current))
                if (!textBeforeCaret) {
                    e.preventDefault()
                    deleteBlock({
                        id: id,
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
                        id: id,
                        contentEditableRef: contentEditableRef.current,
                    }, e.key)
                }
                break
            }

        }
    }


    useEffect(() => {
        setContentText(content)
    }, [content])

    useEffect(() => {
        updatePage({ id, content: contentText, tag })
    }, [contentText, tag])



    return (
        <ContentEditable
            className="bg-slate-100 outline-none h-auto"
            innerRef={contentEditableRef} // forwards the ref to the DOM node
            html={contentText}
            tagName={tag}
            onChange={onChangeHandler}
            onKeyDown={onKeyDownHandler}
            onClick={onClickHandler}
        />
    )
}

export default EditableBlock
