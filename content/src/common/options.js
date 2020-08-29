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

/** Represents the user-selected options for a given page. */
class Options {
    constructor(url) {
        this.url = url;
        this.host = new URL(url).host;
    }

    /** Should the extension be enabled for the page? */
    get enabled() {
        return this.domainEnabled && this.pageEnabled;
    }

    /** Reads the options from local storage. */
    async read() {
        this.domainEnabled = !!await this.readValue(this.host, true);
        this.pageEnabled = !!await this.readValue(this.url, true);

        // Broadcast the option values throughout the extension.
        await this.broadcast();
    }

    /** Writes the options to local storage. */
    async write() {
        await this.writeValue(this.host, this.domainEnabled);
        await this.writeValue(this.url, this.pageEnabled);

        // Broadcast the option values throughout the extension.
        await this.broadcast();
    }

    /** Broadcasts the option values throughout the extension. */
    async broadcast() {
        const message = {
            command: this.enabled ? 'enable' : 'disable'
        };

        // Send the new values to the background and popup scripts.
        try { await browser.runtime.sendMessage(message); }
        catch (exception) { /* ignore any failures to receive */ }

        // Send the new values to the current browser tab.
        const tab = await getCurrentTab();
        const tabId = tab && tab.id;
        if (tabId != null) {
            try { await browser.tabs.sendMessage(tabId, message); }
            catch (exception) { /* ignore any failures to receive */ }
        }
    }

    /** Reads a single value from local storage. */
    async readValue(key, fallback) {
        const container = await browser.storage.local.get([ key ]);
        const value = container[key];
        return value !== undefined ? value : fallback;
    }

    /** Writes a single value to local storage. */
    async writeValue(key, value) {
        let container = {};
        container[key] = value;
        await browser.storage.local.set(container);
    }
}