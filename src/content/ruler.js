class Ruler {
    ELEMENTS_TO_HIGHLIGHT = new Set(['hg', 'img', 'svg', 'video']);
    PADDING = { x: 4, y: 2 };

    enabled = true;

    constructor() {
        const PREFIX = 'ruler-ff-extension-';
        const RULER_ID = PREFIX + 'ruler';

        this.element = document.getElementById(RULER_ID);
        if (!this.element) {
            this.element = document.createElement('div');
            this.element.id = RULER_ID;
            this.element.className = RULER_ID;
            document.body.appendChild(this.element);
        }
    }

    enable() {
        this.enabled = true;
        this.show();
    }

    disable() {
        this.enabled = false;
        this.hide();
    }

    show() {
        this.element.style.opacity = 0.2;
    }

    hide() {
        this.element.style.opacity = 0;
    }

    positionAround(x, y) {
        if (!this.enabled) {
            return;
        }

        const bounds = this.boundsAroundPoint(x, y);
        if (!bounds) {
            this.hide();
            return;
        }

        this.show();

        inflateRect(bounds, this.PADDING.x, this.PADDING.y);
        this.positionAt(bounds);
    }

    positionAt(rect) {
        this.element.style.left = Math.round(rect.x) + 'px';
        this.element.style.top = Math.round(rect.y) + 'px';
        this.element.style.width = Math.round(rect.width) + 'px';
        this.element.style.height = Math.round(rect.height) + 'px';
    }

    boundsAroundPoint(x, y) {
        const caretInfo = caretInfoFromPoint(x, y);
        if (!caretInfo || !caretInfo.node) {
            return null;
        }

        const rowRect = this.textRowBoundsAround(x, y);
        if (!rangeContains(y, rowRect.top, rowRect.bottom)) {
            return null;
        }

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
