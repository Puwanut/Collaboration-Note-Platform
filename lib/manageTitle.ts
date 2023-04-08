import { escapeUTF8, decodeHTML } from "entities"
import * as htmlparser2 from "htmlparser2"

export const titleConcatenate = (titleArray: string[][]) => {
    if (titleArray) {
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
    return ""
}

export const titleParser = (htmlString: string): string[][] => {
    const newTitleArray = []
    let currentTag = ""
    // parse html to array
    const parser = new htmlparser2.Parser({
        onopentag: (tagname) => {
            currentTag = tagname
        },
        ontext: (text) => {
            newTitleArray.push(!currentTag ? [decodeHTML(text)] : [decodeHTML(text), currentTag])
        },
        onclosetag: () => {
            currentTag = ""
        }
    }, { decodeEntities: false }) // to prevent html entities from being decoded (e.g. &lt; to <)
    parser.write(htmlString)
    parser.end()
    return newTitleArray
}
