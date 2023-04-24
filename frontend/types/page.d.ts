import { Block } from "./block"

export interface PageWithOutBlocks {
    id: string
    title: string
    icon?: string
    cover?: string
    isFavorite: boolean
}

export interface PageWithBlocks extends PageWithOutBlocks {
    blocks: Block[]
}
