/*
 * Copyright 2020 Oren Trutner
 *
 * This file is part of Reading Ruler.
 *
 * Reading Ruler is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Reading Ruler is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Reading Ruler.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Represents a "ruler" that highlights a line of text.
 * A ruler uses a single absolutely-positioned, semi-transparent DOM element to
 * highlight the line of text underneath it.
 */
class Ruler {
    constructor() {
        const PREFIX = '--reading-ruler-';
        const RULER_ID = PREFIX + 'ruler';

        this.enabled = true;
        this.element = null;
        this.lastPosition = null;
        this.isVisible = true;

        this.element = document.getElementById(RULER_ID)
        if (!this.element) {
            this.element = document.createElement('div');
            this.element.id = RULER_ID;
            this.element.className = RULER_ID;
            document.body.appendChild(this.element);
        }
    }

    // Public methods

    /** Enables or disables the ruler, based on the given input. */
    enableIf(enable) {
        if (enable) {
            this.enable();
        } else {
            this.disable();
        }
    }

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

    /**Sets the ruler's color. */
    setColor(color) {
        this.element.style.backgroundColor = color;
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
        inflateRect(bounds, Ruler.PADDING.x, Ruler.PADDING.y);
        this.positionAt(bounds);
    }

    // Private methods

    /** Position and size the ruler to cover a specific rectangle. */
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

    /**
     * Gets the bounds of the DOM element to highlight at a given mouse
     * coordinate.  Returns null if the element at that location shouldn't be
     * highlighted.
     */
    boundsAroundPoint(x, y) {
        // Find the DOM element at the given coordinate.
        const caretInfo = caretInfoFromPoint(x, y);
        if (!caretInfo || !caretInfo.node || !rangeContainsOrIsNear(y, caretInfo.rect.top, caretInfo.rect.bottom, 1)) {
            return null;
        }

        // Get the shape of the DOM element.
        const element = document.elementFromPoint(x, y);
        const elementRect = element.getBoundingClientRect();

        // Position and size the ruler to highlight the DOM element.
        switch (caretInfo.node.nodeType) {
            case 1: // A non-text highlight-worthy element
                // Highlight the entire element.
                const element = caretInfo.node;
                if (Ruler.ELEMENTS_TO_HIGHLIGHT.has(element.nodeName.toLowerCase())) {
                    return elementRect;
                } else {
                    return null;
                }
            case 3: // text
                // Highlight just the row under the mouse, not the entire
                // paragraph.
                return {
                    x: elementRect.x,
                    y: caretInfo.rect.y,
                    width: elementRect.width,
                    height: caretInfo.rect.height
                };
            default: return null;
        }
    }
}

Ruler.ELEMENTS_TO_HIGHLIGHT = new Set(['hg', 'img', 'svg', 'video']);
Ruler.PADDING = { x: 4, y: 2 };
