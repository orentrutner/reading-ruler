class Ruler {
    ELEMENTS_TO_HIGHLIGHT = new Set(['hg', 'img', 'svg', 'video']);
    PADDING = { x: 4, y: 2 };

    enabled = true;
    element = null;
    lastPosition = null;
    isVisible = true;

    constructor() {
        const PREFIX = 'ruler-ff-extension-';
        const RULER_ID = PREFIX + 'ruler';

        this.element = document.getElementById(RULER_ID)
        if (!this.element) {
            this.element = document.createElement('div');
            this.element.id = RULER_ID;
            this.element.className = RULER_ID;
            document.body.appendChild(this.element);
        }
    }

    // Public methods

    /** Enables the ruler.  It will stay enabled until explicitly disabled. */
    enable() {
        this.enabled = true;
        this.show();
    }

    /** Disables the ruler.  It will stay disabled until explicitly enabled. */
    disable() {
        this.enabled = false;
        this.hide();
    }

    /** Show the ruler. */
    show() {
        if (!this.isVisible) {
            this.element.style.opacity = 0.2;
            this.isVisible = true;
        }
    }

    /** Hide the ruler. */
    hide() {
        if (this.isVisible) {
            this.element.style.opacity = 0;
            this.isVisible = false;
        }
    }

    /** Position and show the ruler on the text row around a mouse coordinate. */
    positionAround(x, y) {
        // Do nothing if disabled.
        if (!this.enabled) {
            return;
        }

        // Find the row bounds.
        const bounds = this.boundsAroundPoint(x, y);
        if (!bounds) {
            this.hide();
            return;
        }

        // Make sure the ruler is visible.
        this.show();

        // Position the ruler.
        inflateRect(bounds, this.PADDING.x, this.PADDING.y);
        this.positionAt(bounds);
    }

    // Private methods

    positionAt(rect) {
        if (rectsAreEqual(rect, this.lastPosition)) {
            return;
        }

        this.element.style.left = Math.round(rect.x) + 'px';
        this.element.style.top = Math.round(rect.y) + 'px';
        this.element.style.width = Math.round(rect.width) + 'px';
        this.element.style.height = Math.round(rect.height) + 'px';

        this.lastPosition = rect;
    }

    boundsAroundPoint(x, y) {
        const caretInfo = caretInfoFromPoint(x, y);
        if (!caretInfo || !caretInfo.node || !rangeContainsOrIsNear(y, caretInfo.rect.top, caretInfo.rect.bottom, 1)) {
            return null;
        }

        const rowRect = this.textRowBoundsAround(x, y);

        switch (caretInfo.node.nodeType) {
            case 1: // element
                const element = caretInfo.node;
                if (this.ELEMENTS_TO_HIGHLIGHT.has(element.nodeName.toLowerCase())) {
                    return rowRect;
                } else {
                    return null;
                }
            case 3: // text
                return {
                    x: rowRect.x,
                    y: caretInfo.rect.y,
                    width: rowRect.width,
                    height: caretInfo.rect.height
                };
            default: return null;
        }
    }

    textRowBoundsAround(x, y) {
        const element = document.elementFromPoint(x, y);
        const elementRect = element.getBoundingClientRect();

        return elementRect;
    }
}
