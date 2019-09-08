browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (tab.status === 'complete' && tab.active) {
        const options = new Options(tab.url);
        await options.read();
    }
});
