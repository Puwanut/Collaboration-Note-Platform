import { escapeUTF8 } from "entities"

export const titleConcatenate = (titleArray: string[][]) => {
    const text = titleArray.map((textArray) => {
        const textType = textArray?.[1]
        const textContent = escapeUTF8(textArray[0]).replace(/&apos;/g, "'").replace(/&quot;/g, '"')
        if (textType) {
            return `<${textType}>${textContent}</${textType}>`
        }
        return textContent
    })
    return text.join("")
}
