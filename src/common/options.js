class Options {
    constructor(url) {
        this.url = url;
        this.host = new URL(url).host;
    }

    get enabled() {
        return this.domainEnabled && this.pageEnabled;
    }

    async read() {
        this.domainEnabled = !!await this.readValue(this.host, true);
        this.pageEnabled = !!await this.readValue(this.url, true);

        await this.broadcast();
    }

    async write() {
        await this.writeValue(this.host, this.domainEnabled);
        await this.writeValue(this.url, this.pageEnabled);

        await this.broadcast();
    }

    async broadcast() {
        browser.tabs.sendMessage((await this.getCurrentTab()).id, {
            command: this.enabled ? 'enable' : 'disable'
        });
    }

    async readValue(key, fallback) {
        const container = await browser.storage.local.get([ key ]);
        const value = container[key];
        return value !== undefined ? value : fallback;
    }

    async writeValue(key, value) {
        let container = {};
        container[key] = value;
        await browser.storage.local.set(container);
    }

    async getCurrentTab() {
        return (await browser.tabs.query({ active: true, currentWindow: true }))[0];
    }
}