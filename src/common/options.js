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