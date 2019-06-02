(function() {
    // constants
    const padding = { x: 4, y: 2 };
    const ELEMENTS_TO_HIGHLIGHT = new Set(['hg', 'img', 'svg', 'video']);

    // create the ruler
    const ruler = document.createElement('div');
    document.body.appendChild(ruler);
    ruler.className = 'ruler-ff-extension-ruler';

    // create the watermark
    const watermark = document.createElement('div');
    document.body.appendChild(watermark);
    watermark.className = 'ruler-ff-extension-watermark';

    // state
    const mousePosition = {
        x: 0,
        y: 0
    };
    const hoverElementRect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    let maxRulerPosition = 0;

    function elementOfNode(node) {
        for (let ancestor = node; ancestor; ancestor = ancestor.parentNode) {
            if (ancestor.nodeType === 1) {
                return ancestor;
            }
        }

        return null;
    }

    function rulerPositionFromPoint(x, y) {
        const caretInfo = caretInfoFromPoint(x, y);
        if (!caretInfo) {
            return null;
        }

        switch (caretInfo.node.nodeType) {
            case 1:
                const element = document.elementFromPoint(x, y);
                if (ELEMENTS_TO_HIGHLIGHT.has(element.nodeName.toLowerCase())) {
                    return {
                        node: element,
                        rect: hoverElementRect
                    };    
                } else {
                    return null;
                }
            case 3: return {
                    node: caretInfo.node,
                    rect: {
                        x: hoverElementRect.x,
                        y: caretInfo.rect.y,
                        width: hoverElementRect.width,
                        height: caretInfo.rect.height
                    }
                };
            default: return null;
        }
    }

    function trackHoverElement(element) {
        const safeElement = element || document.elementFromPoint(mousePosition.x, mousePosition.y);
        if (!safeElement) {
            return;
        }

        const rect = safeElement.getBoundingClientRect();
        hoverElementRect.x = rect.x;
        hoverElementRect.y = rect.y;
        hoverElementRect.width = rect.width;
        hoverElementRect.height = rect.height;
    }

    function positionElementAt(element, rect) {
        element.style.left = Math.round(rect.x) + 'px';
        element.style.top = Math.round(rect.y) + 'px';
        element.style.width = Math.round(rect.width) + 'px';
        element.style.height = Math.round(rect.height) + 'px';
    }

    function positionRuler() {
        const caretInfo = rulerPositionFromPoint(mousePosition.x, mousePosition.y);
        if (!caretInfo) {
            return;
        }

        const rect = caretInfo.rect;
        inflateRect(rect, padding.x, padding.y);
        positionElementAt(ruler, rect);

        maxRulerPosition = Math.max(maxRulerPosition, caretInfo.rect.y);
        // positionElementAt(
        //     watermark,
        //     hoverElementRect.x,
        //     maxRulerPosition,
        //     hoverElementRect.width,
        //     caretInfo.rect.height)

        // const element = elementOfNode(caretInfo.node);
        // if (element) {
        //     element.style.opacity = Math.max(0.75, 0.95 * parseFloat(element.style.opacity) || 1);
        // }
    }

    const originalOnMouseMove = document.onmousemove;
    document.onmousemove = function(e) {
        mousePosition.x = e.x;
        mousePosition.y = e.y;

        trackHoverElement(e.target);
        positionRuler();

        if (originalOnMouseMove) {
            originalOnMouseMove(e);
        }
    }

    const originalOnScroll = document.onscroll;
    document.onscroll = function(e) {
        trackHoverElement(null);
        positionRuler();

        if (originalOnScroll) {
            originalOnScroll(e);
        }
    }
})();