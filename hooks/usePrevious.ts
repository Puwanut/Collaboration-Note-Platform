import { useEffect, useRef } from "react";
import { IEditableBlock } from "../components/Workspace";

const usePrevious = (blocks: IEditableBlock[]) => {
    const ref = useRef<IEditableBlock[]>()
    const titlesLength = useRef<number[]>([])
    useEffect(() => {
        titlesLength.current = blocks.map(block => {
            return block.properties.title?.reduce((count, text) => count + text[0].length, 0)
        })
        ref.current = blocks
    })
    return [ref.current, titlesLength.current] as const
    }

export default usePrevious;
