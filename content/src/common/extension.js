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

/** Gets the currently active browser tab. */
async function getCurrentTab() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    return (tabs && tabs.length && tabs.length > 0
        ? tabs[0]
        : null);
}

/** Broadcasts a message throughout the add-on. */
async function broadcast(message) {
    const normalizedMessage = typeof message === 'string'
        ? { command: message }
        : message;

    // Send the message to the background and popup scripts.
    try { await browser.runtime.sendMessage(normalizedMessage); }
    catch (exception) { /* ignore any failures to receive */ }

    // Send the message to the current browser tab.
    const tabId = (await getCurrentTab())?.id;
    if (tabId != null) {
        try { await browser.tabs.sendMessage(tabId, normalizedMessage); }
        catch (exception) { /* ignore any failures to receive */ }
    }
}
