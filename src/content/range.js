/** Checks if a number is within a range (inclusive.) */
function rangeContains(value, low, high) {
    return value >= low && value <= high;
}

function rangeContainsOrIsNear(value, low, high, fraction) {
    const buffer = (high - low) * fraction;
    return rangeContains(value, low - buffer, high + buffer);
}