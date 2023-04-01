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
// export const setCaretToEnd = (element: HTMLElement) => {
//     const range = document.createRange()
//     const selection = window.getSelection()
//     range.selectNodeContents(element)
//     range.collapse(false)
//     selection.removeAllRanges()
//     selection.addRange(range)
//     element.focus()
// }

export const setCaretToEnd = (element: HTMLElement) => {
    // /*
    // arg: element is contenteditable element
    // in element will contain text node e.g. "Hello World" or <b>Bold</b> or <i>"line1" "line2"</i>
    // this function will move caret to the end of "LAST" text node (last child of element)
    // ENSURE That caret will be "INSIDE" of last child of element
    // */
    const range = document.createRange()
    const selection = window.getSelection()
    if (element.innerText) {
      if (element.lastChild.nodeType === Node.TEXT_NODE) {
        range.setStart(element.lastChild, element.lastChild.textContent.length)
      } else {
        range.setStart(element.lastElementChild.lastChild, element.lastElementChild.lastChild.textContent.length)
      }
    }
    range.collapse(true)
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

// export const setCaretToaPosition = (element: HTMLElement, caretPosition: number) => {
//     const selection = document.getSelection()
//     // const range = document.createRange()
//     selection.collapse(element, 0)
//     console.log(caretPosition)
//     for (let i = 0; i < caretPosition; i++) {
//         selection.modify("move", "forward", "character")
//     }

//     // const sel = window.getSelection()
//     // const range = document.createRange()
//     // // loop through all child nodes and add their lengths to the total
//     // let totalLength = 0
//     // for (let i = 0; i < element.childNodes.length - 1; i++) {
//     //     totalLength += element.childNodes[i].textContent.length
//     // }
//     // console.log(totalLength, caretPosition - totalLength, element.childNodes.length, element.childNodes)
//     // range.setStart(element.childNodes[element.childNodes.length - 1], caretPosition - totalLength)
//     // range.collapse(true)
//     // sel.removeAllRanges()
//     // sel.addRange(range)
//     // element.focus()
// }


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

// function getTextNodesIn(node) {
//   var textNodes = [];
//   if (node.nodeType == 3) {
//       textNodes.push(node);
//   } else {
//       var children = node.childNodes;
//       for (var i = 0, len = children.length; i < len; ++i) {
//           textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
//       }
//   }
//   return textNodes;
// }

// export function setSelectionRange(el, start, end) {
//   if (document.createRange && window.getSelection) {
//       var range = document.createRange();
//       range.selectNodeContents(el);
//       var textNodes = getTextNodesIn(el);
//       var foundStart = false;
//       var charCount = 0, endCharCount;

//       for (var i = 0, textNode; textNode = textNodes[i++]; ) {
//           endCharCount = charCount + textNode.length;
//           if (!foundStart && start >= charCount
//                   && (start < endCharCount ||
//                   (start == endCharCount && i <= textNodes.length))) {
//               range.setStart(textNode, start - charCount);
//               foundStart = true;
//           }
//           if (foundStart && end <= endCharCount) {
//               range.setEnd(textNode, end - charCount);
//               break;
//           }
//           charCount = endCharCount;
//       }

//       var sel = window.getSelection();
//       sel.removeAllRanges();
//       sel.addRange(range);
//   } else if (document.selection && document.body.createTextRange) {
//       var textRange = document.body.createTextRange();
//       textRange.moveToElementText(el);
//       textRange.collapse(true);
//       textRange.moveEnd("character", end);
//       textRange.moveStart("character", start);
//       textRange.select();
//   }
// }

export const getCaretInfo = (): Record<string, number> => {
    // Get Caret Coordinates
    const selection = document.getSelection()
    const range = selection.getRangeAt(0)
    const { caretTop, caretLeft } = getCaretCoordinates()

    // Get Nearest Parent Element (ancestor)
    let parentNode = range.commonAncestorContainer

    // Find Parent Element which has data-position attribute
    let contentEditableElement: HTMLElement;
    if (parentNode.nodeType !== Node.TEXT_NODE) {
      // 3 is Text Nodetype (true if caret on start or end of line which occurs when movecaret <- -> to other block)
      contentEditableElement = parentNode.parentElement.lastElementChild as HTMLElement
    } else {
      // find next ancestor until found contenteditable element (which has data-position attribute)
      contentEditableElement = parentNode.parentElement as HTMLElement
      while (!contentEditableElement.hasAttribute("data-position")) {
          contentEditableElement = contentEditableElement.parentElement
      }
    }

     // Get Parent Element Height
    const parentOffsetHeight = contentEditableElement.offsetHeight

    // Get Caret Position inside Parent Element (offset from top)
    const caretOffsetTop = caretTop - contentEditableElement.offsetTop

    // Get Line Height of text in Parent Element (slice(0, -2) to remove "px")
    const lineHeight = parseInt(window.getComputedStyle(contentEditableElement).getPropertyValue("line-height").slice(0, -2))

    return { caretOffsetTop, lineHeight, parentOffsetHeight, caretTop, caretLeft }

}

export const getCaretCoordinates = (): Record<string, number> => {
    const selection = document.getSelection()
    const range = selection.getRangeAt(0)
    const parentNode = range.commonAncestorContainer
    if (parentNode.nodeType !== Node.TEXT_NODE) {
      const contentEditableElement = parentNode.parentElement.lastElementChild as HTMLElement
      const caretLeft = contentEditableElement.offsetLeft + 5
      const caretTop = contentEditableElement.offsetTop + contentEditableElement.offsetHeight/2
      return { caretLeft, caretTop }
    } else {
      const rect = range.getClientRects()
      const rectIndex = rect.length - 1
      return { caretLeft: rect[rectIndex].left, caretTop: rect[rectIndex].top }
    }

    // // range.getBoundingClientRect() returns DOMRect which all values are 0 if caret on Non-Text Node
    // // handle caret at start or end of line
    // if (parentNode.nodeType !== Node.TEXT_NODE) { // if parent node is not text node, use contenteditable as a caret coordinates
    //   let contentEditableElement = parentNode.parentElement.lastElementChild as HTMLElement
    //   let caretAtEnd = false
    //   if (caretStart !== null && contentEditableElement.innerText.length === caretStart) {
    //     caretAtEnd = true
    //   }
    //   let caretTop, caretLeft: number
    //   // if caret at end of line, use last child element as a caret coordinates
    //   // else caret at start of line, use first child element as a caret coordinates
    //   if (caretAtEnd) {
    //     console.log("End of line")
    //     const parentOfTextNode = contentEditableElement.lastElementChild as HTMLElement
    //     const textnode = parentOfTextNode.lastChild as HTMLElement
    //     caretTop = contentEditableElement.offsetTop
    //     caretLeft = contentEditableElement.offsetLeft + contentEditableElement.offsetWidth
    //   } else {
    //     console.log("Start of line")
    //     caretTop = contentEditableElement.offsetTop + 5
    //     caretLeft = contentEditableElement.offsetLeft + 5
    //   }
    //   console.log("Caret in GetCaretCoordinates", caretLeft, caretTop)
    //   return { caretLeft, caretTop }
    // }
    // else { // if parent node is text node, use range as a caret coordinates
      // const rect = range.getBoundingClientRect()
      // return { caretLeft: rect.left, caretTop: rect.top }
    // }
}

export const isCaretOnTop = (): boolean => {
    const { caretOffsetTop, lineHeight } = getCaretInfo()
    return caretOffsetTop - lineHeight < 0
}

export const isCaretOnBottom = (): boolean => {
    const { caretOffsetTop, lineHeight, parentOffsetHeight } = getCaretInfo()
    return 2 * lineHeight + caretOffsetTop > parentOffsetHeight
}

export const moveCaret = (x, y) => {
  let sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(document.caretRangeFromPoint(x, y))
}


// export function getCaretCoordinates() {
//   var sel = window.getSelection()
//   if (sel.rangeCount) {
//     var range = sel.getRangeAt(0);
//     var caretRange = range.cloneRange();
//     caretRange.collapse(true);
//     var rect = caretRange.getClientRects()[0];
//     var parentElement = caretRange.startContainer.parentElement;
//     while (parentElement.style && parentElement.style.display === 'block') {
//       parentElement = parentElement.parentElement;
//     }
//     var parentRect = parentElement.getBoundingClientRect();
//     return {
//       left: rect.left - parentRect.left,
//       top: rect.top - parentRect.top
//     };
//   }
//   return null;
// }
