import { PageWithOutBlocks } from "./page"

export interface Workspace {
    id: string
    name: string
    _count: {
        pages: number
        users: number
    }
}

export interface WorkspaceData {
    id: string
    name: string
    pages: PageWithOutBlocks[]
}
