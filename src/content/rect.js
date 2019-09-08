function rectIsEmpty(rect) {
    return rect.width <= 0 || rect.height <= 0;
}

function inflateRect(rect, x, y) {
    rect.x -= x;
    rect.y -= y;
    rect.width += 2 * x;
    rect.height += 2 * y;
}