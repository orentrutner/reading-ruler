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

/** Gets the DOM node at a page coordinate and its bounding rectangle. */
function caretFromPoint(x, y) {
    if (document.caretPositionFromPoint) {
        const position = document.caretPositionFromPoint(x, y);
        return {
            node: position.offsetNode,
            offset: position.offset,
            rect: position.getClientRect()
        };
    } else if (document.caretRangeFromPoint) {
        const range = document.caretRangeFromPoint(x, y);
        return (range
            ? {
                node: range.commonAncestorContainer,
                offset: range.startOffset,
                rect: range.getBoundingClientRect()
              }
            : null);
    } else {
        return null;
    }
}
