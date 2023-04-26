import { Block } from "./block"

export interface PageMinimalData {
    id: string
    title: string
    icon?: string
    isFavorite?: boolean
}

export interface Page extends PageMinimalData {
    cover?: string
    blocks: Block[]
}
