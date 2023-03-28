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
    const rect = range.getBoundingClientRect()

    // Get Nearest Parent Element (ancestor)
    let parentElement = range.commonAncestorContainer.parentElement as HTMLElement

    // find next ancestor until found contenteditable element (which has data-position attribute)
    while (parentElement.attributes.getNamedItem('data-position') === null) {
        parentElement = parentElement.parentElement
    }

    // Get Parent Element Coordinates
    const parentRect = parentElement.getBoundingClientRect()

    // Get Parent Element Height
    const parentOffsetHeight = parentElement.offsetHeight

    // Get Caret Position inside Parent Element (offset from top)
    const caretOffsetTop = rect.top - parentRect.top

    // Get Line Height of text in Parent Element
    const lineHeight = parseInt(window.getComputedStyle(parentElement).getPropertyValue("line-height").slice(0, -2))

    return { caretOffsetTop, lineHeight, parentOffsetHeight }

}

export const isCaretOnTop = (): boolean => {
    const { caretOffsetTop, lineHeight } = getCaretInfo()
    return caretOffsetTop - lineHeight < 0
}

export const isCaretOnBottom = (): boolean => {
    const { caretOffsetTop, lineHeight, parentOffsetHeight } = getCaretInfo()
    return 2 * lineHeight + caretOffsetTop > parentOffsetHeight
}

// export function getCaretCoordinates() {
//   var sel = window.getSelection();
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
