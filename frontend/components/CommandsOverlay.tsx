import { Dispatch, SetStateAction, forwardRef, useCallback, useEffect, useMemo, useState } from "react"
import { basicBlocks } from "../shared/blockType"
import Image from "next/image"
import { Coordinate } from "../types/coordinate"

interface ICommandsOverlayProps {
  coordinate: Coordinate
  // eslint-disable-next-line no-unused-vars
  handleTagSelection: (type: string) => void
  setCommandOverlayOpen: Dispatch<SetStateAction<boolean>>
}

const notFoundLimit: number = 3

const CommandsOverlay = forwardRef<HTMLDivElement, ICommandsOverlayProps>(function CommandsOverlay({
  coordinate,
  handleTagSelection,
  setCommandOverlayOpen
}, ref) {
  // activeIndex is the index of the command that is currently being hovered over
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [userCommand, setUserCommand] = useState<string>("")
  const [notFoundCount, setNotFoundCount] = useState<number>(0)

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
        document.getElementsByClassName("command-active")[0]?.scrollIntoView({ block: "center"}) // optional just in case nothing is active
        break
      case "ArrowDown":
        e.preventDefault()
        setActiveIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
        document.getElementsByClassName("command-active")[0]?.scrollIntoView({ block: "center"})
        break
      case "Backspace":
        if (userCommand.length > 1) {
          setUserCommand(prev => prev.slice(0, -1))
        } else {
          setCommandOverlayOpen(false)
        }
        break
      case "Enter":
        e.preventDefault()
        handleTagSelection(filteredCommands[activeIndex]?.name)
        break
      case "Escape":
        e.preventDefault()
        setCommandOverlayOpen(false)
        break
      default:
        // add key to userCommand
        setUserCommand(prev => prev + e.key)
        // always set activeIndex to 0 when user type
        setActiveIndex(0)
        if (filteredCommands.length === 0) {
          setNotFoundCount(prev => prev + 1)
        } else {
          setNotFoundCount(0)
        }
    }
  }, [userCommand, handleTagSelection, filteredCommands, activeIndex, setCommandOverlayOpen])

   useEffect(() => {
    if (notFoundCount > notFoundLimit) {
      setCommandOverlayOpen(false)
    }
  }, [notFoundCount, setCommandOverlayOpen])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
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
          onClick={() => handleTagSelection(command.name)}
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
