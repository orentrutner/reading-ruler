function rectIsEmpty(rect) {
    return rect.width <= 0 || rect.height <= 0;
}

function rectsAreEqual(rect1, rect2) {
    return (rect1 === rect2
        || (rect1 && rect2
            && rect1.x === rect2.x
            && rect1.y === rect2.y
            && rect1.width === rect2.width
            && rect1.height === rect2.height));
}

function inflateRect(rect, x, y) {
    rect.x -= x;
    rect.y -= y;
    rect.width += 2 * x;
    rect.height += 2 * y;
}