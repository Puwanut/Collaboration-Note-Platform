import { useRef, useEffect, KeyboardEvent, useState, useMemo, useCallback, MouseEvent } from "react"
import ContentEditable, { ContentEditableEvent } from "react-contenteditable"
import { getCaretCoordinates, getCaretStart, isCaretOnBottom, isCaretOnTop, moveCaret, setCaretToEnd, setCaretToStart } from "../lib/setCaret"
import { faGripVertical, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { titleConcatenate, titleParser } from "../lib/manageTitle"
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
import CommandsOverlay from "./CommandsOverlay"



const EditableBlock = ({ block, updateBlocks, addNextBlock, deleteBlock, setCurrentSelectedBlock, numberedListOrder, dataPosition, setKey }) => {
    // common states and refs
    const [titleArray, setTitleArray] = useState<string[][]>(block.properties?.title)
    const [titleArrayBackup, setTitleArrayBackup] = useState<string[][]>([])
    const title = useMemo(() => titleConcatenate(titleArray), [titleArray])
    const contentEditableRef = useRef<HTMLElement>(null)
    const [tag, setTag] = useState<string>(typeMapTag[block.type])

    // state for To-do block
    const [toDoChecked, setToDoChecked] = useState<boolean>(block.properties?.checked)

    // state and extension for Code block
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
    const codeLanguageOptions = useMemo(() => (
        langNames.sort().map((langName, index) => (
            <option key={index} value={langName}>{langName}</option>
        ))
    ), [])

    // state and ref for MenuOverlay
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // state for CommandOverlay
    const [commandOverlayOpen, setCommandOverlayOpen] = useState<boolean>(false)
    const isCommandOverlayOpen = useRef<boolean>(false) // workaround for react-contenteditable's onkeydown event
    const commandOverlayRef = useRef<HTMLDivElement>(null)
    const commandOverlayCoordinate = useMemo(() => {
        if (commandOverlayOpen) {
            const caretCoordinates = getCaretCoordinates()
            const contentEditableRect = contentEditableRef.current?.getBoundingClientRect()
            const windowHeight = window.innerHeight
            // if caret Coordinates too close to bottom of window, move overlay to top of caret
            if (caretCoordinates.caretTop > windowHeight / 2) {
                return {
                    x: caretCoordinates.caretLeft - contentEditableRect?.left + 90,
                    y: caretCoordinates.caretTop - contentEditableRect?.top
                }
            }
            return {
                x: caretCoordinates.caretLeft - contentEditableRect?.left + 90,
                y: caretCoordinates.caretTop - contentEditableRect?.top
            }
        }
    }, [commandOverlayOpen])

    const onPlusClickHandler = (e: MouseEvent) => {
      if (e.altKey) {
        addNextBlock(
          { id: block.id, contentEditableRef: contentEditableRef.current },
          { actionSrc: "MenuAltClick" }
        );
      } else {
        addNextBlock(
          { id: block.id, contentEditableRef: contentEditableRef.current },
          { actionSrc: "MenuClick" }
        );
      }
    }

    const onChangeHandler = (e: ContentEditableEvent) => {
        // prevent <br> from being added to contentEditable after deleting text until line is blank
        // and ensure that line still present even if no any text in line
        const newText = e.target.value.replace("<br>", "\n")
        const newTitleArray = titleParser(newText)
        setTitleArray(newTitleArray) // to update current title properties
        // setTitle(newText) // to update text in contentEditable (for same caret position)
    }

    const onCodeChangeHandler = (value: string) => {
        setTitleArray([[value]]) // for now can't have multiple format in code block
    }

    const onSelectHandler = () => {
        setCurrentSelectedBlock(contentEditableRef.current)
        // currentSelectedBlock.current = contentEditableRef.current
    }

    const onSelectCommandHandler = useCallback((type: string) => {
        if (type) {
            if ((titleArrayBackup.length === 0 || titleArrayBackup[0][0] === "") && block.type !== type) {
                // if line is empty and not same type, restore title and set tag of current block
                setTitleArray([])
                setTag(typeMapTag[type])
            } else {
                // if line is not empty, restore current block and add new block
                setTitleArray(titleArrayBackup)
                addNextBlock({
                    id: block.id,
                    contentEditableRef: contentEditableRef.current
                }, {
                    actionSrc: "CommandSelect",
                    blockType: type,
                })
            }
            setCommandOverlayOpen(false)
        }
    }, [addNextBlock, block.id, titleArrayBackup])

    const handleDeleteLineBreak = (e: KeyboardEvent) => {
        const input = e.target as HTMLInputElement
        const countNewLine = input.innerText.match(/\n*$/g)[0].length // count number of new line at the end of text
        if (input.innerText.endsWith("\n\n") && countNewLine === 2) {
            e.preventDefault()
            setTitleArray(titleParser(e.currentTarget.innerHTML.replace("\n\n", "")))
        }
    }

    const onKeyDownHandler = (e: KeyboardEvent) => {
        setKey(e)
        switch (e.key) {
            case "/": {
                setCommandOverlayOpen(true)
                break
            }
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
                if (isCaretOnTop() && !isCommandOverlayOpen.current) {
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
                if (isCaretOnBottom() && !isCommandOverlayOpen.current) {
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
                if (!e.shiftKey && !isCommandOverlayOpen.current) {
                    e.preventDefault()
                    addNextBlock({
                        id: block.id,
                        contentEditableRef: contentEditableRef.current
                    }, {
                        actionSrc: "Enter",
                        // continue next block with same type of current block
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
                    if (tag !== "div") {
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
        setTitleArray(block.properties.title)
    }, [block.properties.title])

    useEffect(() => {
        setCodeLanguage(block.properties.language)
    }, [block.properties.language])

   // update blocks in parent
    useEffect(() => {
        // to be improved
        updateBlocks({
            ...block,
            type: getKeyByValue(typeMapTag, tag),
            properties: {
                title: titleArray,
                checked: toDoChecked,
                language: codeLanguage
            }
        })
    }, [titleArray, toDoChecked, codeLanguage, tag])

    // set caret to start after block type change
    useEffect(() => {
        const currentBlock = document.querySelector(`[data-position="${dataPosition}"]`) as HTMLElement
        // to be improved
        if (block.type !== "Code") {
            setCaretToStart(currentBlock)
        }
    }, [block.type])

    useEffect(() => {
        isCommandOverlayOpen.current = commandOverlayOpen
        if (commandOverlayOpen) {
            setTitleArrayBackup(titleArray)
        }
    }, [commandOverlayOpen])

    // Close menu when clicking outside
    useClickAway(menuRef, () =>
        setMenuOpen(false)
    )

    // Close command overlay when clicking outside
    useClickAway(commandOverlayRef, () =>
        setCommandOverlayOpen(false)
    )

    return (
      <>
        <div
            data-block-id={block.id}
            className={`relative
            ${block.type === "Heading 1" && "mb-1 mt-8"}
            ${block.type === "Heading 2" && "mb-px mt-6"}
            ${block.type === "Heading 3" && "mb-px mt-4"}
            `}
            >
            {commandOverlayOpen && (
                <CommandsOverlay
                    coordinate={commandOverlayCoordinate}
                    setCommandOverlayOpen={setCommandOverlayOpen}
                    handleTagSelection={onSelectCommandHandler}
                    ref={commandOverlayRef}
                />
            )}
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
                    onClick={(e) => onPlusClickHandler(e)}
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

            {["Text", "Heading 1", "Heading 2", "Heading 3"].includes(block.type)  &&
                <div className="p-1 w-full min-w-0">
                    <ContentEditable
                        key={dataPosition}
                        innerRef={contentEditableRef}
                        html={title}
                        tagName={tag}
                        className="whitespace-pre-wrap break-words outline-none
                                   empty:before:content-[attr(data-placeholder)] before:text-neutral-400 before:cursor-text
                                   empty:before:focus:content-[attr(data-placeholder-onfocus)]"
                        style={{wordBreak: "break-word"}}
                        onChange={onChangeHandler}
                        onKeyDown={onKeyDownHandler}
                        onFocus={onSelectHandler}
                        // onBlur={onBlurHandler}
                        data-position={dataPosition}
                        data-placeholder={tag === "div" ? (dataPosition === 0 ? "Press '/' for commands..." : "") : getKeyByValue(typeMapTag, tag)} // block.tag won't work because it's not updated yet
                        data-placeholder-onfocus={tag === "div" ? "Press '/' for commands..." : getKeyByValue(typeMapTag, tag)}
                    />
                </div>
                }
                {block.type === "Bulleted List" &&
                    <div className="flex w-full p-1 min-w-0">
                        <span className="mx-2 before:content-['•'] text-[1.5rem] leading-6 "></span>
                        <ContentEditable
                            key={dataPosition}
                            innerRef={contentEditableRef}
                            html={title}
                            tagName={"div"}
                            className="w-full whitespace-pre-wrap break-words outline-none
                                empty:before:content-[attr(data-placeholder)] empty:before:focus:content-[attr(data-placeholder-onfocus)]
                                before:text-neutral-400 before:cursor-text"
                            style={{wordBreak: "break-word"}}
                            onChange={onChangeHandler}
                            onKeyDown={onKeyDownHandler}
                            onFocus={onSelectHandler}
                            // onBlur={onBlurHandler}
                            data-position={dataPosition}
                            data-placeholder="List"
                            data-placeholder-onfocus="Press '/' for commands..."

                        />
                    </div>
                }
                {block.type === "Numbered List" &&
                    <div className="flex w-full p-1 min-w-0">
                        <span data-numbered-list-order={numberedListOrder + '.'} className="mx-2 before:content-[attr(data-numbered-list-order)]"></span>
                        <ContentEditable
                            key={dataPosition}
                            innerRef={contentEditableRef}
                            html={title}
                            tagName={"div"}
                            className="w-full whitespace-pre-wrap break-words outline-none
                                empty:before:content-[attr(data-placeholder)] empty:before:focus:content-[attr(data-placeholder-onfocus)]
                                before:text-neutral-400 before:cursor-text"
                            style={{wordBreak: "break-word"}}
                            onChange={onChangeHandler}
                            onKeyDown={onKeyDownHandler}
                            onFocus={onSelectHandler}
                            // onBlur={onBlurHandler}
                            data-position={dataPosition}
                            data-placeholder="List"
                            data-placeholder-onfocus="Press '/' for commands..."
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
                            {codeLanguageOptions}
                        </select>

                        <div className="w-full p-8 pr-4 bg-neutral-100 ">
                            <ReactCodeMirror
                                key={dataPosition}
                                value={title}
                                theme={githubLightInit({
                                    settings: {
                                        background: "transparent",
                                    }
                                })}
                                basicSetup={{
                                    lineNumbers: false,
                                    highlightActiveLine: false,
                                    foldGutter: false,
                                }}
                                extensions={codeExtension}
                                onChange={onCodeChangeHandler}
                                // data-position={dataPosition}
                            />
                        </div>
                    </div>
                }
                {block.type === "To-do List" &&
                    <div className="flex w-full p-1 min-w-0">
                        <input
                            type="checkbox"
                            className="ml-1 mr-2 accent-blue-500 w-5 h-6 cursor-pointer"
                            checked={toDoChecked ?? false}
                            onChange={(e) => setToDoChecked(e.target.checked)}
                        />
                        <ContentEditable
                            key={dataPosition}
                            innerRef={contentEditableRef}
                            html={title}
                            tagName={"div"}
                            className={`w-full whitespace-pre-wrap break-words outline-none
                                empty:before:content-[attr(data-placeholder)] empty:before:focus:content-[attr(data-placeholder-onfocus)]
                                before:text-neutral-400 before:cursor-text
                                ${toDoChecked ? "line-through text-neutral-400" : ""}
                            `}
                            style={{wordBreak: "break-word"}}
                            onChange={onChangeHandler}
                            onKeyDown={onKeyDownHandler}
                            onFocus={onSelectHandler}
                            // onBlur={onBlurHandler}
                            data-position={dataPosition}
                            data-placeholder="To-do"
                            data-placeholder-onfocus="Press '/' for commands..."
                        />
                    </div>
                }
            </div>
        </div>
      </>
    );
}

export default EditableBlock
