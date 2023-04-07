import { Dispatch, SetStateAction, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { basicBlocks, typeMapTag } from "../shared/blockType"
import Image from "next/image"

interface ICommandsOverlayProps {
  text: string
  coordinate: { x: number, y: number }
  setTag: Dispatch<SetStateAction<string>>
  setCommandOverlayOpen: Dispatch<SetStateAction<boolean>>
}

const notFoundLimit: number = 3

const CommandsOverlay = forwardRef<HTMLDivElement, ICommandsOverlayProps>(function CommandsOverlay({
  text,
  coordinate,
  setTag,
  setCommandOverlayOpen
}, ref) {
  // activeIndex is the index of the command that is currently being hovered over
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [userCommand, setUserCommand] = useState<string>("/")
  const [countCharCommand, setCountCharCommand] = useState(0)
  const [notFoundCount, setNotFoundCount] = useState(0)
  const prevCharLength = useRef(text.length)

  // filter when userCommand changes only
  const filteredCommandsByName = useMemo(() => basicBlocks.filter((command) =>
    command.name.toLowerCase().includes(userCommand.replaceAll("/", ""))
  ), [userCommand])

  const filteredCommandsByKeywords = useMemo(() => basicBlocks.filter((command) =>
    command.keywords.some((keyword) =>
      keyword.toLowerCase().includes(userCommand.replaceAll("/", ""))
    )
  ), [userCommand])

  // in ts, use Array.from(iterator) to convert Set to Array
  const filteredCommands = useMemo(() => Array.from(
    new Set([...filteredCommandsByName, ...filteredCommandsByKeywords])
  ), [filteredCommandsByName, filteredCommandsByKeywords])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault()
        setActiveIndex(prev => Math.max(0, prev - 1))
        document.getElementsByClassName("command-active")[0].scrollIntoView({ block: "center"})
        break
      case "ArrowDown":
        e.preventDefault()
        setActiveIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
        document.getElementsByClassName("command-active")[0].scrollIntoView({ block: "center"})
        break
      case "Enter":
        e.preventDefault()
        console.log(filteredCommands)
        setTag(typeMapTag[filteredCommands[activeIndex].name])
        // setCommandOverlayOpen(false)
        break
      case "Escape":
        e.preventDefault()
        setCommandOverlayOpen(false)
        break
      default:
        break
    }
  }, [filteredCommands, setTag, activeIndex, setCommandOverlayOpen])

  useEffect(() => {
    // count char for slice userCommand
    if (text.length > prevCharLength.current) {
      setCountCharCommand(prev => prev + 1)
    } else if (text.length < prevCharLength.current) {
      setCountCharCommand(prev => prev - 1)
    }

    // auto close when not found command over limit
    if (filteredCommands.length === 0) {
      if (text.length < prevCharLength.current) {
        setNotFoundCount((prev) => prev - 1);
      } else {
        setNotFoundCount((prev) => prev + 1);
      }
    } else {
      setNotFoundCount(0);
    }

    prevCharLength.current = text.length
  }, [text])

  useEffect(() => {
    setUserCommand(text.slice(0, countCharCommand))
  }, [countCharCommand])

  useEffect(() => {
    setUserCommand("/")
  }, [])

  useEffect(() => {
    console.log("userCommand", userCommand)
    if (userCommand === "") {
      setCommandOverlayOpen(false)
    } else {
      setCommandOverlayOpen(true)
    }
  }, [userCommand])

  useEffect(() => {
    if (notFoundCount > notFoundLimit) {
      setCommandOverlayOpen(false)
    }
  }, [notFoundCount])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <div
      className="absolute z-10 mt-6 h-auto max-h-[250px] min-w-[250px] overflow-y-auto
                 rounded-sm border-[1px] border-slate-200 bg-slate-50 p-3 shadow-xl"
      style={{ left: coordinate.x, top: coordinate.y }}
      ref={ref}
    >
      {filteredCommands.map((command, index) => (
        <div
          className={`flex p-2 hover:cursor-pointer gap-x-2 ${
            index === activeIndex && "command-active bg-slate-200/75"
          }`}
          key={command.name}
          onMouseOver={() => setActiveIndex(index)}
          onClick={() => setTag(typeMapTag[command.name])}
        >
          <div className="relative h-9 w-9 rounded-md border-[1px]">
            <Image
              src={`${command.thumbnail}`}
              fill
              sizes="100%"
              alt={`${command.name} thumbnail`}
            />
          </div>
          <div>
            <p className="text-sm font-semibold">{command.name}</p>
            <p className="text-xs text-neutral-400">{command.description}</p>
          </div>
        </div>
      ))}

      {filteredCommands.length === 0 && (
        <p className="px-2 text-sm text-neutral-400">No results</p>
      )}
    </div>
  )
})

export default CommandsOverlay
