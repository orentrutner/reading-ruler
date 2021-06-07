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

/** A ruler visualizer that highlights text with color. */
class HighlightVisualizer {
    constructor() {
        const PREFIX = '--reading-ruler-';
        const RULER_ID = PREFIX + 'ruler';

        this.opacity = 0.2;
        this.isVisible = false;

        this.element = document.getElementById(RULER_ID)
        if (!this.element) {
            this.element = document.createElement('div');
            this.element.id = RULER_ID;
            this.element.className = RULER_ID;
            document.body.appendChild(this.element);
        }
    }

    /** Shows the ruler. */
    show() {
        if (!this.isVisible) {
            this.element.style.opacity = this.opacity;
            this.isVisible = true;
        }
    }

    /** Hides the ruler. */
    hide() {
        if (this.isVisible) {
            this.element.style.opacity = 0;
            this.isVisible = false;
        }
    }

    /** Temporarily hides the ruler. */
    stash() {
        this.hide();
    }

    /** Sets the ruler's color. */
    setColor(color) {
        this.element.style.backgroundColor = color;
    }

    /** Sets the ruler's opacity. */
    setOpacity(newOpacity) {
        this.opacity = newOpacity;
        if (this.isVisible) {
            this.element.style.opacity = newOpacity;
        }
    }

    /** Position and size the ruler to cover a specific rectangle. */
    positionAt(rect) {
        this.element.style.left = Math.round(rect.x) + 'px';
        this.element.style.top = Math.round(rect.y) + 'px';
        this.element.style.width = Math.round(rect.width) + 'px';
        this.element.style.height = Math.round(rect.height) + 'px';
    }
}
