const DEFAULT_ICON = {
    "48": "/icons/ruler-48.png",
    "96": "/icons/ruler-96.png",
    "128": "/icons/ruler-128.png"
};
const DISABLED_ICON = {
    "48": "/icons/ruler-disabled-48.png",
    "96": "/icons/ruler-disabled-96.png",
    "128": "/icons/ruler-disabled-128.png"
};

/** Updates the extension's icon to reflect its enabled state. */
async function updateIcon(enable) {
    const tab = await getCurrentTab();
    const tabId = tab && tab.id;
    if (tabId != null) {
        await browser.pageAction.setIcon({
            path: enable ? DEFAULT_ICON : DISABLED_ICON,
            tabId: tabId
        });
    }
}

// Read and apply the page's options when it loads.
browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (tab.status === 'complete' && tab.active) {
        // Read the options.  This broadcasts them to the content script too.
        const options = new Options(tab.url);
        await options.read();

        // Update the extension's icon to reflect its enabled state.
        await updateIcon(options.enabled);
    }
});

// Respond to messages from the options popup.
browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    switch(message.command) {
        case 'enable':
            await updateIcon(true);
            break;
        case 'disable':
            await updateIcon(false);
            break;
        default:
            break;
    }
});