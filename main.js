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
            z-index: 9999;

            pointer-events: none;
            transition: all 0.1s;
        }
    `));

    // create the ruler
    const ruler = document.createElement('div');
    document.body.appendChild(ruler);
    ruler.className = 'ruler-ff-extension-ruler';

    // state
    const mousePosition = {
        x: 0,
        y: 0
    };
    const elementRect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

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
        elementRect.x = rect.x;
        elementRect.y = rect.y;
        elementRect.width = rect.width;
        elementRect.height = rect.height;
    }

    function positionRuler() {
        const caretInfo = caretInfoFromPoint(mousePosition.x, mousePosition.y);
        if (!caretInfo || caretInfo.node.nodeType !== 3) {
            return;
        }

        ruler.style.left = Math.round(elementRect.x - padding.x) + 'px';
        ruler.style.width = Math.round(elementRect.width + 2 * padding.x) + 'px';

        ruler.style.top = Math.round(caretInfo.rect.y - padding.y) + 'px';
        ruler.style.height = Math.round(caretInfo.rect.height + 2 * padding.y) + 'px';
    }

    document.onmousemove = function(e) {
        mousePosition.x = e.x;
        mousePosition.y = e.y;

        trackHoverElement(e.target);
        positionRuler();
    }

    document.onscroll = function(e) {
        trackHoverElement(null);
        positionRuler();
    }
})();