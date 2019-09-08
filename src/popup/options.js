document.addEventListener('DOMContentLoaded', async () => {
    const tab = (await browser.tabs.query({ active: true, currentWindow: true }))[0];
    const url = new URL(tab.url);
    const host = url.host;

    const options = await browser.storage.local.get([ host, url.href ])
    let domainEnabled = options[host] !== undefined ? !!options[host] : true;
    let pageEnabled = options[url.href] !== undefined ? !!options[url.href] : true;

    // initialize and react to changes on the enable-for-domain checkbox
    const enableForDomainCheckbox = document.getElementById('enableForDomain');
    enableForDomainCheckbox.checked = options[host] !== undefined ? !!options[host] : true;
    enableForDomainCheckbox.addEventListener('change', async e => {
        domainEnabled = e.target.checked;
        let pair = {};
        pair[host] = domainEnabled;
        await browser.storage.local.set(pair);

        browser.tabs.sendMessage(tab.id, {
            command: domainEnabled && pageEnabled ? 'enable' : 'disable'
        });
    });

    // initialize and react to changes on the enable-for-page checkbox
    const enableForPageCheckbox = document.getElementById('enableForPage');
    enableForPageCheckbox.checked = options[url.href] !== undefined ? !!options[url.href] : true;
    enableForPageCheckbox.addEventListener('change', async e => {
        pageEnabled = e.target.checked;
        let pair = {};
        pair[url.href] = pageEnabled;
        await browser.storage.local.set(pair);

        browser.tabs.sendMessage(tab.id, {
            command: domainEnabled && pageEnabled ? 'enable' : 'disable'
        });
    });
}, false);
