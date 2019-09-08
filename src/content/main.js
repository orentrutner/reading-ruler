(function() {
    // create the ruler
    const ruler = new Ruler();

    // state
    const mousePosition = { x: 0, y: 0 };

    // react to messages from the popup
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

    // handle mouse-move events
    const originalOnMouseMove = document.onmousemove;
    document.onmousemove = function(e) {
        mousePosition.x = e.x;
        mousePosition.y = e.y;

        ruler.positionAround(mousePosition.x, mousePosition.y);

        if (originalOnMouseMove) {
            try { originalOnMouseMove(e); }
            catch(exception) { /* ignore; likely dead reference */}
        }
    }

    // handle scroll events
    const originalOnScroll = document.onscroll;
    document.onscroll = function(e) {
        ruler.positionAround(mousePosition.x, mousePosition.y);

        if (originalOnScroll) {
            try { originalOnScroll(e); }
            catch(exception) { /* ignore; likely dead reference */}
        }
    }
})();