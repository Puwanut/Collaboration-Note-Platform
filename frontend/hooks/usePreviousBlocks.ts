import { useEffect, useRef } from "react";
import { Block } from "../types/block"

const usePreviousBlocks = (blocks: Block[]) => {
    const ref = useRef<Block[]>()
    const titlesLength = useRef<number[]>([])
    useEffect(() => {
        titlesLength.current = blocks?.map(block => {
            return block.properties.title?.reduce((count, text) => count + text[0].length, 0)
        })
        ref.current = blocks
    })
    return [ref.current, titlesLength.current] as const
    }

export default usePreviousBlocks
