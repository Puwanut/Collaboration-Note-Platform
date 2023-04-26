export interface Page {
    id: string
    title: string
    icon?: string
    cover?: string
    blocks: Array<Block>
}

export interface Block {
    id: string
    type: string
    properties: {
        title: Array<Array<string>>
        checked?: boolean
        language?: string
    }
    children?: Array<Block>
    parent?: string
}
