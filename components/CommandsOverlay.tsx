import { useState } from "react"
import { basicBlocks } from "../shared/blockType"

interface CommandsOverlayProps {
  text: string
}

const CommandsOverlay = ({ text }: CommandsOverlayProps) => {
  // activeIndex is the index of the command that is currently being hovered over
  const [activeIndex, setActiveIndex] = useState<Number>(0)

  const filteredCommandsByName = basicBlocks.filter((command) =>
    command.name.toLowerCase().includes(text.replaceAll("/", ""))
  )

  const filteredCommandsByKeywords = basicBlocks.filter((command) =>
    command.keywords.some((keyword) =>
      keyword.toLowerCase().includes(text.replaceAll("/", ""))
    )
  )

  // in ts, use Array.from(iterator) to convert Set to Array
  const filteredCommands = Array.from(
    new Set([...filteredCommandsByName, ...filteredCommandsByKeywords])
  )

  return (
    <div
      className="absolute z-10 mt-6 h-auto max-h-[250px] min-w-[250px] overflow-y-auto
                 rounded-sm border-[1px] border-slate-200 bg-slate-50 p-3 shadow-xl"
    >
      {filteredCommands.map((command, index) => (
        <div
          className={`p-2 hover:cursor-pointer ${
            index === activeIndex && "bg-slate-200/75"
          }`}
          key={command.name}
          onMouseOver={() => setActiveIndex(index)}
        >
          <p className="text-sm font-semibold">{command.name}</p>
          <p className="text-xs text-neutral-400">{command.description}</p>
        </div>
      ))}

      {filteredCommands.length === 0 && (
        <p className="px-2 text-sm text-neutral-400">No results</p>
      )}
    </div>
  )
}

export default CommandsOverlay
