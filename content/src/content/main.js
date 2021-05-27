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
 * This is the entry point for the extension's "content" script, i.e. the script
 * that executes within every web page that the browser loads.
 *
 * It creates a single ruler and sets up event handlers to highlight the row
 * under the mouse cursor every time the mouse moves or the page scrolls.
 */
(function() {
    // Create the ruler.
    const ruler = new Ruler();

    // Track state.
    const mousePosition = { x: 0, y: 0 };

    // React to messages from the background and popup scripts.
    browser.runtime.onMessage.addListener(message => {
        switch (message.command) {
            case 'options':
                ruler.enableIf(message.enabled);
                ruler.setColor(message.color);
                ruler.setOpacity(message.opacity);
                break;
            default:
                break;
        }

    });

    // Handle mouse-move events.
    const originalOnMouseMove = document.onmousemove;
    document.onmousemove = function(e) {
        // Keep track of the mouse position.
        mousePosition.x = e.x;
        mousePosition.y = e.y;

        // Position the ruler to match the mouse position.
        ruler.positionAround(mousePosition.x, mousePosition.y);

        // Invoke any previous mouse move handler.
        if (originalOnMouseMove) {
            try { originalOnMouseMove(e); }
            catch(exception) { /* ignore; likely dead reference */ }
        }
    }

    // Handle scroll events.
    const originalOnScroll = document.onscroll;
    document.onscroll = function(e) {
        // Position the ruler to match the mouse position.
        ruler.positionAround(mousePosition.x, mousePosition.y);

        // Invoke any previous scroll handler.
        if (originalOnScroll) {
            try { originalOnScroll(e); }
            catch(exception) { /* ignore; likely dead reference */ }
        }
    }
})();