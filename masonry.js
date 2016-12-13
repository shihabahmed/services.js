var masonry = (function(j) {
    function initMasonry(_container) {
        if (!j().masonry)
            return;

        var container = _container;
        container.masonry();

        container.find('img').load(function() {
            container.masonry({
                itemSelector: '.item'
            });
        });
    }

    function destroyMasonry(container) {
        container.masonry('destroy');
    }

    return {
        // Initialize the grid
        init: function(container) {
            initMasonry(j(container));
        },

        // Resets the grid
        resizeGrid: function(container) {
            initMasonry(j(container));
        },

        // Rearranges the grid with new items
        update: function(container, newItems) {
            j(container).masonry('appended', newItems);
        },

        // Removes grid layout functionality
        destroy: function(container) {
            destroyMasonry(j(container));
        }
    }
})(jQuery);