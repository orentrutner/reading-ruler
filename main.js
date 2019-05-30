(function() {
    // constants
    const padding = {
        x: 4,
        y: 2
    };

    // ruler style
    const style = document.createElement('style');
    document.head.appendChild(style);
    style.appendChild(document.createTextNode(`
        .ruler-ff-extension-ruler {
            background-color: steelblue;
            border-radius: 4px;
            opacity: 0.2;

            position: fixed;
            z-index: 2147483646;

            pointer-events: none;
            transition: all 0.1s;
        }
        .ruler-ff-extension-watermark {
            border-bottom: 2px solid red;

            position: fixed;
            z-index: 2147483647;

            pointer-events: none;
            transition: all 0.1s;
        }
    `));

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

    function positionElementAt(element, left, top, width, height) {
        element.style.left = Math.round(left) + 'px';
        element.style.top = Math.round(top) + 'px';
        element.style.width = Math.round(width) + 'px';
        element.style.height = Math.round(height) + 'px';
    }

    function positionRuler() {
        const caretInfo = caretInfoFromPoint(mousePosition.x, mousePosition.y);
        if (!caretInfo || caretInfo.node.nodeType !== 3) {
            return;
        }

        positionElementAt(
            ruler,
            hoverElementRect.x - padding.x,
            caretInfo.rect.y - padding.y,
            hoverElementRect.width + 2 * padding.x,
            caretInfo.rect.height + 2 * padding.y);

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