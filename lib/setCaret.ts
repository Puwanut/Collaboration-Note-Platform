// Get caret position in contenteditable div
export const getCaretStart = (element: HTMLElement) => {
    let caretOffset = 0
    const doc = element.ownerDocument
    const win = doc.defaultView || doc.parentWindow
    let sel
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection()
        if (sel.rangeCount > 0) {
            const range = win.getSelection().getRangeAt(0)
            const preCaretRange = range.cloneRange()
            preCaretRange.selectNodeContents(element)
            preCaretRange.setEnd(range.endContainer, range.endOffset)
            caretOffset = preCaretRange.toString().length
        }
    } else if ((sel = doc.selection) && sel.type != "Control") {
        const textRange = sel.createRange()
        const preCaretTextRange = doc.body.createTextRange()
        preCaretTextRange.moveToElementText(element)
        preCaretTextRange.setEndPoint("EndToEnd", textRange)
        caretOffset = preCaretTextRange.text.length
    }
    return caretOffset
}

// set Caret to end of previous block
export const setCaretToEnd = (element: HTMLElement) => {
    const range = document.createRange()
    const selection = window.getSelection()
    range.selectNodeContents(element)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
    element.focus()
}

export const setCaretToPosition = (element: HTMLElement, caretPosition: number) => {
    const range = document.createRange()
    const selection = window.getSelection()
    range.selectNodeContents(element)
    range.collapse(true)
    if (element.innerText) {
        range.setStart(element.childNodes[0], caretPosition)
        range.setEnd(element.childNodes[0], caretPosition)
    }
    selection.removeAllRanges()
    selection.addRange(range)
    element.focus()
}

export const setCaretToStart = (element: HTMLElement) => {
    const range = document.createRange()
    const selection = window.getSelection()
    range.selectNodeContents(element)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
    element.focus()
}


