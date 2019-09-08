document.addEventListener('DOMContentLoaded', async () => {
    const tab = (await browser.tabs.query({ active: true, currentWindow: true }))[0];
    const url = new URL(tab.url);
    const host = url.host;

    const options = await browser.storage.local.get([ host, url.href ])

    const enableForDomainCheckbox = document.getElementById('enableForDomain');
    enableForDomainCheckbox.checked = options[host] !== undefined ? !!options[host] : true;
    enableForDomainCheckbox.addEventListener('change', async e => {
        let pair = {};
        pair[host] = e.target.checked;
        await browser.storage.local.set(pair);
    });

    const enableForPageCheckbox = document.getElementById('enableForPage');
    enableForPageCheckbox.checked = options[url.href] !== undefined ? !!options[url.href] : true;
    enableForPageCheckbox.addEventListener('change', async e => {
        let pair = {};
        pair[url.href] = e.target.checked;
        await browser.storage.local.set(pair);
    });
}, false);
