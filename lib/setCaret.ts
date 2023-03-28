// Get caret position in contenteditable div
export const getCaretStart = (element: HTMLElement) => {
    let caretOffset = 0
    const doc = element.ownerDocument
    const win = doc.defaultView
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

export const setCaretToStart = (element: HTMLElement) => {
    const range = document.createRange()
    const selection = window.getSelection()
    range.selectNodeContents(element)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
    element.focus()
}

export const setCaretToaPosition = (element: HTMLElement, caretPosition: number) => {
    const selection = document.getSelection()
    // const range = document.createRange()
    selection.collapse(element, 0)
    console.log(caretPosition)
    for (let i = 0; i < caretPosition; i++) {
        selection.modify("move", "forward", "character")
    }

    // const sel = window.getSelection()
    // const range = document.createRange()
    // // loop through all child nodes and add their lengths to the total
    // let totalLength = 0
    // for (let i = 0; i < element.childNodes.length - 1; i++) {
    //     totalLength += element.childNodes[i].textContent.length
    // }
    // console.log(totalLength, caretPosition - totalLength, element.childNodes.length, element.childNodes)
    // range.setStart(element.childNodes[element.childNodes.length - 1], caretPosition - totalLength)
    // range.collapse(true)
    // sel.removeAllRanges()
    // sel.addRange(range)
    // element.focus()
}


// export const setCaretToPosition = (element: HTMLElement, caretPosition: number) => {
//     const range = document.createRange()
//     const selection = window.getSelection()
//     range.setStart(element.childNodes[0], caretPosition)
//     range.collapse(true)
//     selection.removeAllRanges()
//     selection.addRange(range)
//     element.focus()
// }

// element type which have childNodes:
export function setCaretToPosition(element, caretPosition) {

  // Loop through all child nodes
  for (let node of element.childNodes) {
    if (node.nodeType == 3) {
      // we have a text node
      if (node.length >= caretPosition) {
        // finally add our range
        let range = document.createRange(),
          sel = window.getSelection();
        range.setStart(node, caretPosition);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        element.focus();
        return -1; // we are done
      } else {
        caretPosition -= node.length;
      }
    } else {
      caretPosition = setCaretToPosition(node, caretPosition);
      if (caretPosition == -1) {
        return -1; // no need to finish the for loop
      }
    }
  }
  return caretPosition; // needed because of recursion stuff
}
