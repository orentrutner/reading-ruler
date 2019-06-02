function caretInfoFromPoint(x, y) {
    if (document.caretPositionFromPoint) {
        const position = document.caretPositionFromPoint(x, y);
        return {
            node: position.offsetNode,
            rect: position.getClientRect()
        };
    } else if (document.caretRangeFromPoint) {
        const range = document.caretRangeFromPoint(x, y);
        return range
            ? {
                node: range.commonAncestorContainer,
                rect: range.getBoundingClientRect()
              }
            : null;
    }
}
