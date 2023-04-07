import { useRef, useEffect, KeyboardEvent, useState, useMemo } from "react"
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
import ReactCodeMirror from "@uiw/react-codemirror"
import { Extension } from "@codemirror/state"
import { loadLanguage, langNames, LanguageName } from '@uiw/codemirror-extensions-langs';
import { githubLightInit } from "@uiw/codemirror-themes-all"
import { EditorView } from "@codemirror/view";
// type LangName = typeof langNames[number]

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

const EditableBlock = ({ block, updatePage, addNextBlock, deleteBlock, setCurrentSelectedBlock, numberedListOrder, dataPosition, setKey }) => {
    const [titleArray, setTitleArray] = useState<string[][]>(block.properties.title)
    const [title, setTitle] = useState<string>(titleConcatenate(block.properties.title))
    const contentEditableRef = useRef<HTMLElement>(null)
    const [tag, setTag] = useState<string>(typeMapTag[block.type])
    const [codeLanguage, setCodeLanguage] = useState<LanguageName | "plaintext">(block.properties?.language)
    const codeExtension: Extension[] = useMemo(() => {
        // remove outline when focused (https://github.com/uiwjs/react-codemirror/issues/355#issuecomment-1178993647)
        const removedOutlineStyle = EditorView.baseTheme({
            "&.cm-editor.cm-focused": {
                outline: "none"
              }
        })
        // load language if language is not plaintext
        if (codeLanguage && codeLanguage !== "plaintext") {
            return [removedOutlineStyle, loadLanguage(codeLanguage)]
        } else {
            return [removedOutlineStyle]
        }
    }, [codeLanguage])

    // for menu overlay + click away
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

    const onCodeChangeHandler = (value: string, viewUpdate: any) => {
        setTitleArray([[value]]) // for now can't have multiple format in code block
        setTitle(value)
        console.log(value, viewUpdate)
    }

    const onSelectHandler = () => {
        setCurrentSelectedBlock(contentEditableRef.current)
        // currentSelectedBlock.current = contentEditableRef.current
    }

    const handleDeleteLineBreak = (e: KeyboardEvent) => {
        const input = e.target as HTMLInputElement
        const countNewLine = input.innerText.match(/\n*$/g)[0].length // count number of new line at the end of text
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
                        const { left: previousBlockLeft, bottom: previousBlockBottom } = previousBlock.getBoundingClientRect()
                        const lastLinePreviousBlockOffsetTop = previousBlockBottom - parseInt(window.getComputedStyle(previousBlock).getPropertyValue("line-height"))
                        const possibleCaretLeft = caretLeft < previousBlockLeft ? previousBlockLeft : caretLeft
                        moveCaret(possibleCaretLeft, lastLinePreviousBlockOffsetTop)
                        console.log("[Move to]", possibleCaretLeft, lastLinePreviousBlockOffsetTop)
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
                        const { left: nextBlockLeft, top: nextBlockTop } = nextBlock.getBoundingClientRect()
                        const possibleCaretLeft = caretLeft < nextBlockLeft ? nextBlockLeft : caretLeft
                        moveCaret(possibleCaretLeft, nextBlockTop) // +5 for padding
                        console.log("[Move to]", possibleCaretLeft, nextBlockTop)
                    }
                }
                break
            }
            case "Enter": {
                if (!e.shiftKey && block.type !== "Code") {
                    e.preventDefault()
                    addNextBlock({
                        id: block.id,
                        contentEditableRef: contentEditableRef.current
                    }, {
                        actionSrc: "Enter",
                        // block.type not in ["Heading 1", "Heading 2", "Heading 3"]
                        blockType: ["Heading 1", "Heading 2", "Heading 3"].includes(block.type) ? "Text" : block.type,
                    })
                }
                break
            }
            case "Backspace": {
                handleDeleteLineBreak(e)
                const textBeforeCaret = e.target.textContent.substring(0, getCaretStart(contentEditableRef.current))

                if (!textBeforeCaret) {
                    e.preventDefault()
                    if (block.type === "Bulleted List" || block.type === "Numbered List") {
                        setTag(typeMapTag["Text"])
                    } else {
                        deleteBlock({
                            id: block.id,
                            contentEditableRef: contentEditableRef.current,
                        }, e.key)
                    }
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
        if (block.type !== "Code") {
            setTitle(titleConcatenate(block.properties.title))
        } else {
            setTitle(block.properties.title[0][0])
        }
        setTitleArray(block.properties.title)
        // setTag(typeMapTag[block.type])
    }, [block.properties.title])

    useEffect(() => {
        setCodeLanguage(block.properties.language)
    }, [block.properties.language])

    // update blocks in parent
    useEffect(() => {
        console.log("USEEFFECT 2: UpdatePage", `[${dataPosition}], [${block.id}]`)
        updatePage({
            ...block,
            type: getKeyByValue(typeMapTag, tag),
            properties: {
                ...block.properties,
                title: titleArray,
                language: codeLanguage
            }
        })
    }, [titleArray, tag, codeLanguage])

    // set caret to start after block type change
    useEffect(() => {
        const currentBlock = document.querySelector(`[data-position="${dataPosition}"]`) as HTMLElement
        if (block.type !== "Code") {
            setCaretToStart(currentBlock)
        }
    }, [block.type])



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
              onClick={(e) => {
                e.altKey ?
                addNextBlock({ id: block.id, contentEditableRef: contentEditableRef.current }, {actionSrc: "MenuAltClick"}) :
                addNextBlock({ id: block.id, contentEditableRef: contentEditableRef.current }, {actionSrc: "MenuClick"})
            }}
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
                <p>
                    <span className="text-neutral-100">Click</span> to add a block below
                </p>
                <p>
                    <span className="text-neutral-100">Alt-click</span> to add a block above
                </p>
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
          {!["Bulleted List", "Numbered List", "Code"].includes(block.type)  &&
            <div className="p-1 bg-neutral-100 w-full min-w-0">
                <ContentEditable
                    key={dataPosition}
                    innerRef={contentEditableRef}
                    html={title}
                    tagName={tag}
                    className="whitespace-pre-wrap break-words outline-none"
                    style={{wordBreak: "break-word"}}
                    onChange={onChangeHandler}
                    onKeyDown={onKeyDownHandler}
                    onFocus={onSelectHandler}
                    data-position={dataPosition}
                />
            </div>
            }
            {block.type === "Bulleted List" &&
                <div className="flex w-full p-1 bg-neutral-100 min-w-0">
                    <span className="mx-2 before:content-['•'] text-[1.5rem] leading-6 "></span>
                    <ContentEditable
                        key={dataPosition}
                        innerRef={contentEditableRef}
                        html={title}
                        tagName={"div"}
                        className="w-full whitespace-pre-wrap break-words outline-none"
                        style={{wordBreak: "break-word"}}
                        onChange={onChangeHandler}
                        onKeyDown={onKeyDownHandler}
                        onFocus={onSelectHandler}
                        data-position={dataPosition}
                    />
                </div>
            }
            {block.type === "Numbered List" &&
                <div className="flex w-full p-1 bg-neutral-100 min-w-0">
                    <span data-numbered-list-order={numberedListOrder + '.'} className="mx-2 before:content-[attr(data-numbered-list-order)]"></span>
                    <ContentEditable
                        key={dataPosition}
                        innerRef={contentEditableRef}
                        html={title}
                        tagName={"div"}
                        className="w-full whitespace-pre-wrap break-words outline-none"
                        style={{wordBreak: "break-word"}}
                        onChange={onChangeHandler}
                        onKeyDown={onKeyDownHandler}
                        onFocus={onSelectHandler}
                        data-position={dataPosition}
                    />
                </div>
            }
            {block.type === "Code" &&
                <div className="relative w-full min-w-0">
                    <select
                        className="absolute m-2 px-1 text-sm text-neutral-500 bg-transparent hover:bg-neutral-200 rounded-md outline-none"
                        value={codeLanguage ?? "plaintext"}
                        onChange={(e) => setCodeLanguage(e.target.value as LanguageName)}
                    >
                        <option value="plaintext">plaintext</option>
                        {langNames.map((langName, index) => (
                            <option key={index} value={langName}>{langName}</option>
                            ))
                        }
                    </select>

                    <div className="w-full p-8 pr-4 bg-neutral-100 ">
                        <ReactCodeMirror
                            value={title}
                            theme={githubLightInit({
                                settings: {
                                    background: "var(--bg-neutral-100)"
                                }
                            })}
                            basicSetup={{
                                lineNumbers: false,
                                highlightActiveLine: false,
                                foldGutter: false,
                            }}
                            extensions={codeExtension}
                            onChange={onCodeChangeHandler}
                        />
                    </div>
                </div>
                // <div className="flex w-full p-1 bg-neutral-100">
                //     <pre className="w-full">
                //     <ContentEditable
                //         key={dataPosition}
                //         innerRef={contentEditableRef}
                //         html={title}
                //         tagName={"code"}
                //         className="w-full whitespace-pre-wrap break-words outline-none language-javascript"
                //         style={{ wordBreak: "break-word" }} // workaround for break long words
                //         onChange={onChangeHandler}
                //         onKeyDown={onKeyDownHandler}
                //         onFocus={onSelectHandler}
                //         data-position={dataPosition}
                //     />
                //     </pre>
                // </div>
            }
        </div>
      </div>
    );
}

export default EditableBlock
