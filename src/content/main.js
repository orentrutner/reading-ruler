(function() {
    // Create the ruler.
    const ruler = new Ruler();

    // Track state.
    const mousePosition = { x: 0, y: 0 };

    // React to messages from the background and popup scripts.
    browser.runtime.onMessage.addListener(message => {
        switch (message.command) {
            case 'enable':
                ruler.enable();
                break;
            case 'disable':
                ruler.disable();
                break;
            default:
                break;
        }
    });

    // Handle mouse-move events.
    const originalOnMouseMove = document.onmousemove;
    document.onmousemove = function(e) {
        // Keep track of the mouse position.
        mousePosition.x = e.x;
        mousePosition.y = e.y;

        // Position the ruler to match the mouse position.
        ruler.positionAround(mousePosition.x, mousePosition.y);

        // Invoke any previous mouse move handler.
        if (originalOnMouseMove) {
            try { originalOnMouseMove(e); }
            catch(exception) { /* ignore; likely dead reference */}
        }
    }

    // Handle scroll events.
    const originalOnScroll = document.onscroll;
    document.onscroll = function(e) {
        // Position the ruler to match the mouse position.
        ruler.positionAround(mousePosition.x, mousePosition.y);

        // Invoke any previous scroll handler.
        if (originalOnScroll) {
            try { originalOnScroll(e); }
            catch(exception) { /* ignore; likely dead reference */}
        }
    }
})();