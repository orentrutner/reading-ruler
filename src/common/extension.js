/** Gets the currently active browser tab. */
async function getCurrentTab() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    return (tabs && tabs.length && tabs.length > 0
        ? tabs[0]
        : null);
}