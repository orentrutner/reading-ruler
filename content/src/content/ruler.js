/*
 * Copyright 2020-2021 Oren Trutner
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
 * Represents a "ruler" that highlights a row of text.
 * A ruler uses a single absolutely-positioned, semi-transparent DOM element to
 * highlight the row of text underneath it.
 */
class Ruler {
    constructor() {
        this.enabled = false;   // enabled unless the user turned it off
        this.active = false;    // temporarily inactive when the mouse exits the window
        this.appearance = 'ruler';
        this.visualizer = new HighlightVisualizer();
        this.latestRowBounds = null;
        this.latestPosition = null;
        this.options = {};
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

    /** Activates the ruler, if it was temporarily deactivated. */
    activate() {
        this.active = true;
        this.show();
    }

    /** Temporarily deactivates the ruler. */
    deactivate() {
        this.active = false;
        this.hide();
    }

    /** Checks if the ruler should be visible in its current state. */
    isVisible() {
        return this.enabled && this.active;
    }

    /** Sets the ruler's appearance. */
    setAppearance(newAppearance) {
        if (this.appearance === newAppearance) {
            return;
        }

        // Keep the new appearance.
        this.appearance = newAppearance;

        // Hide the old visualizer.
        if (this.visualizer) {
            this.visualizer.hide();
        }

        // Create and initialize a new visualizer to match the new appearance.
        this.visualizer = Ruler.VISUALIZER_BY_APPEARANCE[newAppearance] || Ruler.VISUALIZER_BY_APPEARANCE["ruler"];
        this.visualizer.setColor(this.options.color);
        this.visualizer.setOpacity(this.options.opacity);

        // Show and position the new visualizer.
        this.show();
        this.positionAtLatest();
    }

    /** Sets the ruler's color. */
    setColor(newColor) {
        this.options.color = newColor;
        this.visualizer.setColor(newColor);
    }

    /** Sets the ruler's opacity. */
    setOpacity(newOpacity) {
        this.options.opacity = newOpacity;
        this.visualizer.setOpacity(newOpacity);
    }

    /**
     * Position and show the ruler on the text row around a mouse coordinate.
     * As a performance optimization, only makes a change if the coordinate
     * exited the previously highlighted row.
     */
    positionAroundIfRowExited(x, y) {
        if (!this.enabled || (this.latestRowBounds && rectContains(this.latestRowBounds, x, y))) {
            return;
        }

        this.positionAround(x, y)
    }

    /** Position and show the ruler on the text row around a mouse coordinate. */
    positionAround(x, y) {
        // Do nothing if disabled.
        if (!this.enabled) {
            return;
        }

        // Find the row bounds.
        const rowBounds = this.latestRowBounds = this.boundsAroundPoint(x, y);
        if (!rowBounds) {
            this.stash();
            return;
        }

        // Make sure the ruler is visible.
        this.activate();
        this.show();

        // Position the ruler.
        inflateRect(rowBounds, Ruler.PADDING.x, Ruler.PADDING.y);
        this.positionAt(rowBounds);
    }

    // Private methods

    /** Show the ruler. */
    show() {
        if (this.isVisible()) {
            this.visualizer.show();
        }
    }

    /** Hide the ruler. */
    hide() {
        this.visualizer.hide();
    }

    /** Temporarily hide the ruler. */
    stash() {
        this.visualizer.stash();
        this.latestPosition = null;
    }

    /**
     * Position the visualizer in the latest position it was in.
     * This is useful after changing visualizers.
     */
    positionAtLatest() {
        if (this.latestPosition) {
            this.visualizer.positionAt(this.latestPosition);
        }
    }

    /** Position and size the ruler to cover a specific rectangle. */
    positionAt(rect) {
        if (!rectsAreEqual(rect, this.latestPosition)) {
            this.visualizer.positionAt(rect);
            this.latestPosition = rect;
        }
    }

    /**
     * Gets the bounds of the DOM element to highlight at a given mouse
     * coordinate.  Returns null if the element at that location shouldn't be
     * highlighted.
     */
    boundsAroundPoint(x, y) {
        // Find the DOM element at the given coordinate.
        const caretInfo = caretAtOrNear(x, y, Ruler.SAMPLE_COUNT);
        if (!caretInfo || !caretInfo.node) {
            return null;
        }

        // Get the shape of the DOM element.
        const element = this.ancestorBlockElement(caretInfo.node.parentElement, 3);
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

    /**
     * Gets the nearest ancestor block element of a given element.
     * Scans up to the given number of levels.
     * Returns null if the root of the DOM tree is reached, or the last ancestor
     * looked at if no block ancestor is found within the limit.
     */
    ancestorBlockElement(element, levels) {
        for (var level = 0;
            level < levels && element;
            ++level, element = element.parentElement) {

            if (window.getComputedStyle(element).display === 'block') {
                return element;
            }
        }

        return element;
    }
}

Ruler.SAMPLE_COUNT = 5;
Ruler.ELEMENTS_TO_HIGHLIGHT = new Set(['hg', 'img', 'svg', 'video']);
Ruler.PADDING = { x: 4, y: 2 };
Ruler.VISUALIZER_BY_APPEARANCE = {
    "ruler": new HighlightVisualizer(),
    "negative": new NegativeVisualizer()
};