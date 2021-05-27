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
 * Range functions.  A range represents a 1-dimensional interval defined by
 * low and high values (inclusive.)
 */

/** Checks if a number is within a range (inclusive.) */
function rangeContains(value, low, high) {
    return value >= low && value <= high;
}

/** Gets the nearest value inside a range to a given value. */
function rangeClip(value, low, high) {
    return (value < low ? low : (value > high ? high : value));
}

/** Checks if a number is within a range or outside but near its boundaries. */
function rangeContainsOrIsNear(value, low, high, fraction) {
    const buffer = (high - low) * fraction;
    return rangeContains(value, low - buffer, high + buffer);
}

/**
 * Gets the distance from a value to the nearest end of a range.
 * Returns 0 if the value is inside the range.
 */
function rangeDistanceToValue(value, low, high) {
    return (rangeContains(value, low, high)
        ? 0
        : Math.min(Math.abs(value - low), Math.abs(value - high)));
}