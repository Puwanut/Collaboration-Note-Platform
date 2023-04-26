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

// titleSlice function
// input
// titleArray: [["normal"], ["testbold", "b"], ["testitalic", "i"]]
// start: 10
// end: null
// output
// [["bold", "b"], ["testitalic", "i"]]

// input
// titleArray: [["normal"], ["testbold", "b"], ["testitalic", "i"]]
// start: 0
// end: 10
// output
// [["normal"], ["test", "b"]]

export const titleSlice = (titleArray: string[][], start: number, end?: number) => {
    let currentLength = 0
    const titleUpdatedArray = [...titleArray]
    for (let index = 0; index < titleArray.length; index++) {
      const textArray = titleArray[index] // ['456']
      const textLength = textArray[0].length
      // Slice title for new block
      if (currentLength + textLength > start && end === undefined) { // 3 >= 10
        const format = textArray?.[1]
        if (format) {
          titleUpdatedArray[index] = [textArray[0].substring(start - currentLength), format]
        } else {
          titleUpdatedArray[index] = [textArray[0].substring(start - currentLength)]
        }
        return titleUpdatedArray.slice(index)
      }
      // Slice title for current block
      else if (currentLength + textLength >= end && end !== undefined) {
        const format = textArray?.[1]
        if (format) {
          titleUpdatedArray[index] = [textArray[0].substring(0, end - currentLength), format]
        } else {
          titleUpdatedArray[index] = [textArray[0].substring(0, end - currentLength)]
        }
        return titleUpdatedArray.slice(0, index + 1)
      }
      currentLength += textLength
    }
    return []
  }
