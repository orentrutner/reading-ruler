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

/*
 * Caret functions.  A caret represents a text position between two characters,
 * including the DOM node, the text offset and the bounding rectangle.
 */

/**
 * Gets the caret for the nearest text position to the given coordinates.
 * Looks first in the DOM node under the coordinates, then horizontally around
 * it using up to the given number of sample points.
 */
function caretAtOrNear(x, y, sampleCount) {
    return caretAt(x, y) || caretNear(x, y, sampleCount);
}

/**
 * Gets the caret for the nearest text position to the given coordinates.
 * Checks horizontally around the coordinates for the nearest match, using up to
 * the given number of sample points.
 */
 function caretNear(x, y, sampleCount) {
    const bodyWidth = document.body.clientWidth;
    var nearestCaret = null;
    var nearestCaretDistance = Number.MAX_VALUE;

    // Scan up to all sample points from left to right.
    for (var i = 0; i < sampleCount; ++i) {
        // Get the caret nearest the next sample point.
        const nextCaret = caretAt((i + 1) * bodyWidth / (sampleCount + 2), y);

        if (nextCaret) {
            // Check how close the caret is to the coordinates.
            const nextCaretDistance = rangeDistanceToValue(x, nextCaret.rect.x, nextCaret.rect.x + nextCaret.rect.width);
            if (nearestCaretDistance > nextCaretDistance) {
                // Getting closer to the coordinate?  Great! -- keep track of
                // the closest caret so far.
                nearestCaret = nextCaret;
                nearestCaretDistance = nextCaretDistance;
            } else if (nearestCaret) {
                // No getting any closer?  The remaining sample points won't get
                // use any closer either.  Return the nearest caret so far.
                return nearestCaret;
            }
        }
    }

    // Looks like the last caret found was the closest.
    return nearestCaret;
}

/**
 * Gets the caret for the nearest text position to the given coordinates.
 * Looks only in the DOM node under the coordinates.
 */
 function caretAt(x, y) {
    // Get the nearest caret to the given coordinates.
    var caretInfo = caretFromPoint(x, y);
    if (!caretInfo) {
        return null;
    }

    // When in doubt, browsers assume you want the end of the previous row.
    // But we prefer to have the exact row under the coordinate.
    if (y > caretInfo.rect.bottom) {
        caretInfo = caretNext(caretInfo);
    }

    return (caretInfo && rangeContainsOrIsNear(y, caretInfo.rect.top, caretInfo.rect.bottom, 1)
        ? caretInfo
        : null);
}

/**
 * Gets the following caret position to the given caret.
 * Returns the original caret position if there isn't a following one.
 */
function caretNext(caretInfo) {
    try {
        // Create a range for the following position. This can fail if there
        // is no following position.
        const nextCaretRange = document.createRange();
        nextCaretRange.setStart(caretInfo.node, caretInfo.offset + 1);

        // Return the caret at the location of the range.
        const nextCaretRect = nextCaretRange.getBoundingClientRect();
        return caretFromPoint(nextCaretRect.x, nextCaretRect.y);
    } catch (exception) {
        // Failed -- return the original caret.
        return caretInfo;
    }
}