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
    var elementRect;

    function positionRuler() {
        const caretPosition = document.caretPositionFromPoint(mousePosition.x, mousePosition.y);
        if (caretPosition.offsetNode.nodeType !== 3) {
            return;
        }

        const caretRect = caretPosition.getClientRect();

        ruler.style.left = Math.round(elementRect.x - padding.x) + 'px';
        ruler.style.width = Math.round(elementRect.width + 2 * padding.x) + 'px';

        ruler.style.top = Math.round(caretRect.y - padding.y) + 'px';
        ruler.style.height = Math.round(caretRect.height + 2 * padding.y) + 'px';
    }

    document.onmousemove = function(e) {
        mousePosition.x = e.x;
        mousePosition.y = e.y;

        elementRect = e.target.getBoundingClientRect();

        positionRuler();
    }

    document.onscroll = function(e) {
        positionRuler();
    }
})();