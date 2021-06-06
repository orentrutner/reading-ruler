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

/** A ruler visualizer that darkens the page except for the ruler row. */
class NegativeVisualizer {
    constructor() {
        const PREFIX = '--reading-ruler-';
        const TOP_ID = PREFIX + 'top';
        const BOTTOM_ID = PREFIX + 'bottom';

        this.opacity = 0.2;
        this.isVisible = true;

        this.topElement = document.getElementById(TOP_ID)
        if (!this.topElement) {
            this.topElement = document.createElement('div');
            this.topElement.id = TOP_ID;
            this.topElement.className = TOP_ID;
            document.body.appendChild(this.topElement);
        }

        this.bottomElement = document.getElementById(BOTTOM_ID)
        if (!this.bottomElement) {
            this.bottomElement = document.createElement('div');
            this.bottomElement.id = BOTTOM_ID;
            this.bottomElement.className = BOTTOM_ID;
            document.body.appendChild(this.bottomElement);
        }
    }

    /** Shows the ruler. */
    show() {
        if (!this.isVisible) {
            this.topElement.style.opacity = this.opacity;
            this.bottomElement.style.opacity = this.opacity;
            this.isVisible = true;
        }
    }

    /** Hides the ruler. */
    hide() {
        if (this.isVisible) {
            this.topElement.style.opacity = 0;
            this.bottomElement.style.opacity = 0;
            this.isVisible = false;
        }
    }

    /** Temporarily hides the ruler. */
    stash() {
        this.topElement.style.opacity = this.opacity;
        this.bottomElement.style.opacity = this.opacity;
        if (this.lastPosition) {
            const y = this.lastPosition.y + this.lastPosition.height / 2;
            this.positionAt({
                x: this.lastPosition.x,
                y: y,
                width: this.lastPosition.width,
                height: 0
            });
        }
    }

    /** Sets the ruler's color. */
    setColor(color) {
        // Do nothing.
    }

    /** Sets the ruler's opacity. */
    setOpacity(newOpacity) {
        this.opacity = newOpacity;
        if (this.isVisible) {
            this.topElement.style.opacity = newOpacity;
            this.bottomElement.style.opacity = newOpacity;
        }
    }

    /** Position and size the ruler to cover a specific rectangle. */
    positionAt(rect) {
        const inflatedRect = { ...rect };

        this.topElement.style.left = '0px';
        this.topElement.style.top = '0px';
        this.topElement.style.width = window.innerWidth + 'px';
        this.topElement.style.height = Math.round(inflatedRect.y) + 'px';

        this.bottomElement.style.left = '0px';
        this.bottomElement.style.top = Math.round(inflatedRect.y + inflatedRect.height) + 'px';
        this.bottomElement.style.width = window.innerWidth + 'px';
        this.bottomElement.style.height = Math.round(window.innerHeight - inflatedRect.y - inflatedRect.height) + 'px';

        this.lastPosition = rect;
    }
}
