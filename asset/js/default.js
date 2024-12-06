(function($) {

    function fixIframeAspect() {
        $('iframe').each(function () {
            var aspect = $(this).attr('height') / $(this).attr('width');
            $(this).height($(this).width() * aspect);
        });
    }

    function framerateCallback(callback) {
        var waiting = false;
        callback = callback.bind(this);
        return function () {
            if (!waiting) {
                waiting = true;
                window.requestAnimationFrame(function () {
                    callback();
                    waiting = false;
                });
            }
        }
    }

    var toggleChildNav = function(childMenu, childToggle, expandString, collapseString) {
        childMenu.toggleClass('open');
        childToggle.toggleClass('open');
        if (childMenu.hasClass('open')) {
            childToggle.attr('aria-label', collapseString);
        } else {
            childToggle.attr('aria-label', expandString);
        }
    };

    var closeChildNav = function(childMenu, childToggle, expandString) {
        childMenu.removeClass('open');
        childToggle.removeClass('open');
        childToggle.attr('aria-label', expandString);
    };

    var openChildNav = function(childMenu, childToggle, collapseString) {
        childMenu.addClass('open');
        childToggle.addClass('open');
        childToggle.attr('aria-label', collapseString);
    };

    $(document).ready(function() {
        var navElement = $('header nav');
        var expandString = Omeka.jsTranslate('Expand');
        var collapseString = Omeka.jsTranslate('Collapse');

        navElement.addClass('closed');

        navElement.click(function() {
            $(this).toggleClass('open').toggleClass('closed');
        });
        

        navElement.find('ul ul').each(function(){
          var childMenu = $(this);
          var parentItem = childMenu.parent('li');
          var toggleButton = $('<button type="button" class="child-toggle"></button>');
          toggleButton.attr('aria-label', expandString);
          parentItem.addClass('parent');
          parentItem.children('a').first().wrap('<div class="parent-link"></div>');
          parentItem.find('.parent-link').append(toggleButton);
        });
        
        navElement.on('click', '.child-toggle', function(e) {
          e.stopPropagation();
          var childToggle = $(this);
          var childMenu = childToggle.parents('.parent').first().find('ul').first();
          toggleChildNav(childMenu, childToggle, expandString, collapseString);
        });

        navElement.on('mouseenter', '.parent', function() {            
            $(this).find('.child-toggle').addClass('open');
        });

        navElement.on('mouseleave', '.parent', function() {            
            $(this).find('.child-toggle').removeClass('open');
        });

        navElement.on('keydown', '.open li:last-child a:only-child', function(e) {
            if (e.keyCode = "Tab" && !e.shiftKey) {
                var parentLi = $(this).parents('.parent');
                e.preventDefault();
                var childMenu = $(this).parents('ul');
                var childToggle = parentLi.find('.child-toggle');
                closeChildNav(childMenu, childToggle, expandString);
                parentLi.next().find('a').first().focus();
            }
        });
        
        // Maintain iframe aspect ratios
        $(window).on('load resize', framerateCallback(fixIframeAspect));
        fixIframeAspect();
    });
})(jQuery);
