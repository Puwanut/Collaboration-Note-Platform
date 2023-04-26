import { LanguageName } from "@uiw/codemirror-extensions-langs"

export interface Block {
  id: string
  type: string
  properties: {
    title: string[][] // [["text", "bold"], ["text", "italic"]
    checked?: boolean
    language?: LanguageName | "plaintext"
  }
  children?: string[]
  parent?: string
}

export interface CurrentBlock {
    id: string
    contentEditableRef: HTMLElement
}
