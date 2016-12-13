var Service = {};

Service.WindowLoad = (function() {
    var windowLoad_fn = {},
        fn, fnName, params = [];

    return {
        // Add a function with params (optional and provided as comma seperated values) to run once window loaded.
        add: function(fn, params) {
            fnName = fn.name;
            params = Array.prototype.slice.apply(arguments).slice(1);
            windowLoad_fn[fn.name] = {
                fn: fn,
                params: params
            };
        },

        // Returns the list of functions attached to WindowLoad.
        list: function() {
            return Object.keys(windowLoad_fn).map(function(name) {
                return {
                    name: name,
                    fn: windowLoad_fn[name].fn
                };
            });
        },

        // Remove a function from the list of functions to run when once window loaded.
        remove: function(fn) {
            fn = (typeof fn === 'string' ? fn : '');
            delete windowLoad_fn[fn];
        },

        // Call all the functions attached to WindowLoad using add().
        call: function() {
            var fnNames = Object.keys(windowLoad_fn),
                fnLength = fnNames.length;
            if (fnLength > 0) {
                for (var i = 0; i < fnLength; i++) {
                    fnName = windowLoad_fn[fnNames[i]];
                    if (typeof fnName.fn === 'function') {
                        fnName.fn.apply(this, fnName.params);
                    }
                }
            } else {
                console.log('No function has been bound to the window load event.');
            }
        }
    }
})();

Service.WindowResize = (function() {
    var windowResize_fn = {},
        fn, fnName, params = [];

    return {
        // Add a function with params (optional and provided as comma seperated values) to run once window is resized.
        add: function(fn, params) {
            fnName = fn.name;
            params = Array.prototype.slice.apply(arguments).slice(1);
            windowResize_fn[fn.name] = {
                fn: fn,
                params: params
            };
        },

        // Returns the list of functions attached to WindowResize.
        list: function() {
            return Object.keys(windowResize_fn).map(function(name) {
                return {
                    name: name,
                    fn: windowResize_fn[name].fn
                };
            });
        },

        // Remove a function from the list of functions to run when once window is resized.
        remove: function(fn) {
            fn = (typeof fn === 'string' ? fn : '');
            delete windowResize_fn[fn];
        },

        // Call all the functions attached to WindowResize using add().
        call: function() {
            var fnNames = Object.keys(windowResize_fn),
                fnLength = fnNames.length;
            if (fnLength > 0) {
                for (var i = 0; i < fnLength; i++) {
                    fnName = windowResize_fn[fnNames[i]];
                    if (typeof fnName.fn === 'function') {
                        fnName.fn.apply(this, fnName.params);
                    }
                }
            } else {
                console.log('No function has been bound to the window resize event.');
            }
        }
    }
})();

Service.Popup = (function(j) {
    var jMsgBox, jMsgTitleBar, jMsgTitle, jMsgBody, btnOK, jTimer,
        isHtmlReady = false,
        popupInterval, timer, timeLeft,
        defaultOptions = {
            titlebar: true,
            title: 'Message',
            message: 'This is the message content...',
            timeout: 0
        },
        popupHTML = '<div class="modal fade" id="msgBox" tabindex="-1" role="dialog" aria-labelledby="msgBoxTitle" aria-hidden="true">' +
        '	<div class="modal-dialog">' +
        '		<div class="modal-content">' +
        '			<div class="modal-header">' +
        '			    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
        '			    <h4 class="modal-title" id="msgBoxTitle"></h4>' +
        '			</div>' +
        '			<div class="modal-body">' +
        //'		    	Test content...' +
        '			</div>' +
        '			<div class="modal-footer" style="padding: 9px 20px 10px;">' +
        //'		    	<em class="msgBoxTimer" style="text-align: left;float:left;display:none;font-size:85%;max-width:175px;">This message will automatically close in <span class="time-left"></span> seconds.</em>' +
        '   			<button type="button" class="btn btn-primary btnOK" data-dismiss="modal">OK</button>' +
        '		    	<em class="msgBoxTimer" style="text-align: right;display:block;font-size:85%;margin-top:10px;">This message will automatically close in <span class="time-left"></span> seconds.</em>' +
        '			</div>' +
        '		</div>' +
        '	</div>' +
        '</div>';

    function init() {
        if (isHtmlReady == false) {
            isHtmlReady = true;
            j('body').append(popupHTML);

            jMsgBox = j('#msgBox');
            jMsgTitleBar = jMsgBox.find('.modal-header');
            jMsgTitle = jMsgBox.find('#msgBoxTitle');
            jMsgBody = jMsgBox.find('.modal-body');
            btnOK = jMsgBox.find('.btnOK');
            jTimer = jMsgBox.find('.msgBoxTimer');
            timeLeft = jMsgBox.find('.time-left');
        }
    }

    return {
        // Shows a popup box with options (optional) provided as a JSON object.
        // - options: {
        // - - - titlebar: true,
        // - - - title: 'Message',
        // - - - message: 'This is the message content...',
        // - - - timeout: 0
        // - }
        show: function(options) {
            init();
            j.extend(defaultOptions, options);

            if (defaultOptions.titlebar == false) {
                jMsgTitleBar.hide();
                jMsgBody.css('margin-top', 10);
            } else {
                jMsgTitleBar.show();
                jMsgBody.css('margin-top', 0);
                jMsgTitle.html(defaultOptions.title);
            }

            jMsgBody.html(defaultOptions.message);
            //btnOK.text("OK");
            jTimer.hide();

            if (defaultOptions.timeout > 1) {
                btnOK.text("Close");
                jTimer.show();

                timer = parseInt(defaultOptions.timeout);
                timeLeft.text(timer);

                popupInterval = setInterval(function() {
                    timer -= 1;
                    timeLeft.text(timer);
                    if (timer == 0) {
                        clearInterval(popupInterval);
                        btnOK.click();
                    }
                }, 1000);
            }

            jMsgBox.modal({
                //keyboard: false,
                backdrop: 'static'
            });
        }
    }
})(jQuery);

Service.Confirm = (function(j) {
    var jMsgBox, jMsgTitleBar, jMsgTitle, jMsgBody,
        btnYes, btnNo, btnClose,
        isConfirmBoxReady = false,
        defaultOptions = {
            titlebar: true,
            title: 'Confirm',
            message: 'This is the question...',
            yes: function() {},
            no: function() {}
        },
        popupHTML = '<div class="modal fade" id="confirmDialog" tabindex="-1" role="dialog" aria-labelledby="msgBoxTitle" aria-hidden="true">' +
        '	<div class="modal-dialog">' +
        '		<div class="modal-content">' +
        '			<div class="modal-header" style="padding: 8px 15px;">' +
        '   			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
        '	    		<h4 class="modal-title" id="confirmDialogTitle"></h4>' +
        '			</div>' +
        '			<div class="modal-body" style="padding: 12px 20px;">' +
        //' 			Test content...' +
        '			</div>' +
        '			<div class="modal-footer" style="padding: 9px 20px 10px;">' +
        '   			<button type="button" style="padding: 3px 16px;" class="btn btn-primary btnConfirm-Yes">Yes</button>' +
        '	    		<button type="button" style="padding: 3px 16px;" class="btn btn-danger btnConfirm-No">No</button>' +
        '		    	<button type="button" style="display:none;width:0;height:0;position:absolute;z-index:-1;" class="btn btnConfirm-Close" data-dismiss="modal"></button>' +
        '			</div>' +
        '		</div>' +
        '	</div>' +
        '</div>';

    function init() {
        if (isConfirmBoxReady == false) {
            isConfirmBoxReady = true;
            j('body').append(popupHTML);

            jMsgBox = j('#confirmDialog');
            jMsgTitleBar = jMsgBox.find('.modal-header');
            jMsgTitle = jMsgBox.find('#confirmDialogTitle');
            jMsgBody = jMsgBox.find('.modal-body');
            btnYes = jMsgBox.find('.btnConfirm-Yes');
            btnNo = jMsgBox.find('.btnConfirm-No');
            btnClose = jMsgBox.find('.btnConfirm-Close');

            btnYes.click(function() {
                defaultOptions.yes.call();
                btnClose.click();
            });

            btnNo.click(function() {
                defaultOptions.no.call();
                btnClose.click();
            });
        }
    }

    return {

        // Shows a confirm dialog box with options (optional) provided as a JSON object.
        // - options: {
        // - - - titlebar: true,
        // - - - title: 'Confirm',
        // - - - message: 'This is the question...',
        // - - - yes: function() {
        // - - - 	// do something if clicked 'YES'
        // - - - },
        // - - - no: function() {
        // - - - 	// do something if clicked 'NO'
        // - - - }
        // - }
        show: function(options) {
            init();
            j.extend(defaultOptions, options);

            if (defaultOptions.titlebar == false) {
                jMsgTitleBar.hide();
                jMsgBody.css('margin-top', 10);
            } else {
                jMsgTitleBar.show();
                jMsgBody.css('margin-top', 0);
                jMsgTitle.html(defaultOptions.title);
            }

            jMsgBody.html(defaultOptions.message);

            jMsgBox.modal({
                backdrop: 'static'
            });
        }
    }
})(jQuery);

Service.Prompt = (function(j) {
    var jMsgBox, jMsgTitleBar, jMsgTitle, jMsgBody, jTextBox,
        prompt, jReportStatus,
        btnSubmit, btnCancel, btnClose,
        isPromptBoxReady = false,
        defaultOptions = {
            title: 'Message',
            height: 0,
            message: '',
            placeholder: 'Write your message here...',
            validation: 'You must write a message.',
            onSubmit: function(prompt) {
                // prompt.message
                // prompt.close()
            }
        },
        popupHTML = '<div class="modal fade" id="promptDialog" tabindex="-1" role="dialog" aria-labelledby="msgBoxTitle" aria-hidden="true">' +
        '	<div class="modal-dialog">' +
        '		<div class="modal-content">' +
        '			<div class="modal-header" style="padding: 8px 15px;">' +
        '   			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
        '	    		<h4 class="modal-title" id="promptDialogTitle"></h4>' +
        '			</div>' +
        '			<div class="modal-body" style="padding: 12px 20px;">' +
        //' 			<textarea class="textBox" rows="4" cols="15" style="width:100%; resize: none;"></textarea>' +
        '   			<div class="prompt-error" style="display: none; color: #f00; font-size: 90%; margin-bottom: 4px;"></div>' +
        '			</div>' +
        '			<div class="modal-footer" style="padding: 9px 20px 10px;">' +
        //'             <em class="reportStatus" style="text-align: left;float:left;display:none;font-size:85%;max-width:60px;">Submitting report...</em>' +
        '   			<button type="button" style="padding: 3px 16px;" class="btn green btnPrompt-Submit">Submit</button>' +
        '	    		<button type="button" style="padding: 3px 16px;" class="btn btn-danger btnPrompt-Cancel" data-dismiss="modal">Cancel</button>' +
        '		    	<em class="reportStatus" style="text-align: right;display:block;font-size:85%;margin-top:10px;">Submitting report...</em>' +
        '			</div>' +
        '		</div>' +
        '	</div>' +
        '</div>';

    function init(options) {
        if (isPromptBoxReady == false) {
            isPromptBoxReady = true;
            j('body').append(popupHTML);

            jMsgBox = j('#promptDialog');
            jMsgTitleBar = jMsgBox.find('.modal-header');
            jMsgTitle = jMsgBox.find('#promptDialogTitle');
            jMsgBody = jMsgBox.find('.modal-body');

            if (options.height && options.height > 0) {
                jMsgBody.prepend('<textarea class="textBox form-control" rows="4" cols="15" style="width:100%; resize: none;"></textarea>');
            } else {
                jMsgBody.prepend('<input class="textBox form-control" type="text" style="width:100%;" />');
            }

            jTextBox = jMsgBody.find('.textBox');
            jReportStatus = jMsgBox.find('.reportStatus');
            btnSubmit = jMsgBox.find('.btnPrompt-Submit');
            btnCancel = jMsgBox.find('.btnPrompt-Cancel');

            prompt = {
                close: function() {
                    //btnCancel.removeAttr().click();
                    jMsgBox.modal('hide');
                }
            };

            btnSubmit.click(function() {
                j.extend(prompt, {
                    message: jTextBox.val(),
                });

                if (prompt.message.length > 0) {
                    jMsgBody.css('padding-bottom', 12).children('.prompt-error').hide().text("");
                    btnSubmit.attr('disabled', 'disabled');
                    btnCancel.attr('disabled', 'disabled');

                    jReportStatus.fadeIn();

                    defaultOptions.onSubmit.apply(this, [prompt]);
                } else {
                    jMsgBody.css('padding-bottom', 0).children('.prompt-error').text(options.validation).show();
                }
            });
        }
    }

    return {

        // Shows a input dialog box with options (optional) provided as a JSON object.
        // - options: {
        // - - - title: 'Message',
        // - - - height: 0,
        // - - - message: '',
        // - - - placeholder: 'Write your message here...',
        // - - - validation: 'This field is required.',
        // - - - onSubmit: function(prompt) {
        // - - - 	// prompt.message
        // - - - 	// prompt.close()
        // - - - }
        // - }
        show: function(options) {
            j.extend(defaultOptions, options);
            init(defaultOptions);

            jMsgTitle.html(defaultOptions.title);
            jMsgBody.css('margin-top', 0);

            if (defaultOptions.height || defaultOptions.height > 0) {
                jTextBox.css('height', defaultOptions.height);
            }
            jTextBox.val(defaultOptions.message).attr('placeholder', defaultOptions.placeholder);

            jReportStatus.hide();
            btnSubmit.removeAttr('disabled');
            btnCancel.removeAttr('disabled');

            jMsgBox.modal({
                backdrop: 'static'
            }).on('shown.bs.modal', function(e) {
                jTextBox.focus();
            }).on('hidden.bs.modal', function(e) {
                jTextBox.val("");
            });

        }
    }
})(jQuery);

Service.Loader = (function(j) {
    var options = {},
        el, elType, position, id,
        cl_container, cl_container_width, cl,
        ajaxCall = false;

    j(function() {
        _init();

        j(document).ajaxSuccess(function() {
            ajaxCall = true;
            _init();
        });
    });

    function _init() {
        j('[data-loader]').each(function(index, elem) {
            el = j(elem);
            position = el.offset();
            id = 'canvasLoader_' + index;

            elType = el[0].type;
            elTYpe = (elType ? elType.toLowerCase() : undefined);
            if (elType == 'button' || elType == 'submit' || elType == 'reset' || elType == 'file' || elType == 'text') {
                elType = 'button';
            }

            if (!el.data('loader')) {
                if (ajaxCall) {
                    j('#' + id + '_container').remove();
                }

                if (elType == 'button') {
                    j('body').append('<div id="' + id + '_container" class="canvasLoader_container"><div class="canvasLoader_bg"></div><div id="' + id + '"></div></div>');
                } else {
                    el.html('<div id="' + id + '_container" class="canvasLoader_container"><div class="canvasLoader_bg"></div><div id="' + id + '"></div></div>');
                }
                el.data({
                    'type': elType,
                    'loader': id
                });

                cl_container_width = (el.outerWidth() < el.outerHeight() ? el.outerWidth() : el.outerHeight()) - 4;
                cl_container_width = (cl_container_width > 35 ? 35 : cl_container_width);

                cl_container = j('#' + id + '_container');

                if (elType != 'button') {
                    cl_container.parent().css({
                        'position': 'relative'
                    });
                }

                cl_container.css({
                    'position': 'absolute',
                    'overflow': 'hidden',
                    'top': (elType == 'button' ? position.top : '50%'),
                    'left': (elType == 'button' ? position.left : '50%'),
                    'width': (elType == 'button' ? el.outerWidth() : cl_container_width),
                    'height': (elType == 'button' ? el.outerHeight() : cl_container_width),
                    'margin-top': (elType == 'button' ? '' : (cl_container_width * -0.5)),
                    'margin-left': (elType == 'button' ? '' : (cl_container_width * -0.5)),
                    'z-index': 999999
                }).children('.canvasLoader_bg').css({
                    'background': (el.data('background') ? el.data('background') : '#fff'),
                    'opacity': (el.data('opacity') ? el.data('opacity') : 0.8),
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'width': '100%',
                    'height': '100%'
                });

                _activate(el);
            }
        });

        ajaxCall = false;
    }

    function _activate(el) {
        options = el.data();

        cl = new CanvasLoader(options.loader);

        options.diameter = (el.outerWidth() < el.outerHeight() ? el.outerWidth() : el.outerHeight()) - 4;
        options.diameter = (options.diameter > 35 ? 35 : options.diameter);

        cl.setShape(options.shape ? options.shape : 'spiral');
        cl.setColor(options.color ? options.color : '#000000');
        cl.setDiameter(options.diameter);
        cl.setDensity(options.density ? options.density : 50);
        cl.setRange(options.range ? options.range : 1);
        cl.setSpeed(options.speed ? options.speed : 2);
        cl.setFPS(options.fps ? options.fps : 25);
        cl.show();

        j("#canvasLoader")
            .attr('id', options.loader + '_loader')
            .css({
                'position': 'absolute',
                'top': '50%',
                'left': '50%',
                'margin-top': (options.diameter * -0.5),
                'margin-left': (options.diameter * -0.5)
            });

        if (el.data('visible') != true) {
            j('#' + options.loader + '_container').hide();
        }
    }

    return {
        reset: function() {
            _init();
        },

        show: function(selector) {
            j(selector).each(function(index, _el) {
                var el = j(_el),
                    options = el.data();

                if (_el.type == 'button' || _el.type == 'submit' || _el.type == 'reset') {
                    //el.css('opacity', '0.5');
                    el.attr('disabled', 'disabled').addClass('disabled');
                    j('#' + options.loader + '_container .canvasLoader_bg').css({
                        'background': 'transparent'
                    });
                }

                var el_loader = j('#' + options.loader + '_container');

                if (el.data('type') == 'button') {
                    el_loader.css({
                        'top': el.offset().top,
                        'left': el.offset().left,
                        'width': el.outerWidth(),
                        'height': el.outerHeight()
                    }).fadeIn();

                    j(window).resize(function() {
                        //el_loader.hide();

                        //setTimeout(function () {
                        el_loader.css({
                            'top': el.offset().top,
                            'left': el.offset().left,
                            'width': el.outerWidth(),
                            'height': el.outerHeight()
                        });
                        //}, 500);
                    }).resize();
                } else {
                    el_loader.fadeIn();
                }
            });
        },

        hide: function(selector) {
            j(selector).each(function(index, _el) {
                //j('#' + j(el).css('opacity', 1).data('loader') + '_container').fadeOut();

                var el = j(_el);

                if (_el.type == 'button' || _el.type == 'submit' || _el.type == 'reset') {
                    el.removeAttr('disabled', 'disabled').removeClass('disabled');
                }
                j('#' + el.data('loader') + '_container').fadeOut();
            });
        }
    }
})(jQuery);

Services.Spinner = (function(j) {
    var options = {},
        spinner = {},
        data = {};

    function _init(parent) {
        var defaultOptions = {
                lines: 10, // The number of lines to draw
                length: 0, // The length of each line
                width: 5, // The line thickness
                radius: 13, // The radius of the inner circle
                scale: 1, // Scales overall size of the spinner
                corners: 1, // Corner roundness (0..1)
                color: '#000', // #rgb or #rrggbb or array of colors
                opacity: 0, // Opacity of the lines
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                speed: 1, // Rounds per second
                trail: 91, // Afterglow percentage
                fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                className: 'spinner', // The CSS class to assign to the spinner
                top: '50%', // Top position relative to parent
                left: '50%', // Left position relative to parent
                shadow: false, // Whether to render a shadow
                hwaccel: true, // Whether to use hardware acceleration
                position: 'absolute' // Element positioning
            },
            options = {},
            target = (parent ? parent.filter('[data-loader]') : j('[data-loader]')).css('position', 'relative');

        target.each(function(index, el) {
            if (j(this).children('.spinner').length === 0) {
                el = j(this);
                data = el.data();

                options = {};
                j.extend(options, defaultOptions);

                if (data) {
                    if (data.spinner) {
                        delete data.spinner;
                    }

                    if (data.width) {
                        var newOptions = {
                            width: parseInt(defaultOptions.width * data.width / 35),
                            radius: parseInt(defaultOptions.radius * data.width / 35),
                            scale: parseInt(defaultOptions.scale * data.width / 35)
                        };

                        j.extend(options, {
                            width: (newOptions.width < 1 ? options.width : newOptions.width),
                            radius: (newOptions.radius < 1 ? options.radius : newOptions.radius),
                            scale: (newOptions.scale < 1 ? options.scale : newOptions.scale)
                        });
                    }
                }
                spinner = new Spinner(options).spin(el[0]);
                el.data('spinner', spinner).css({
                    width: data.width,
                    height: data.width,
                    margin: '0 auto'
                });
            }
        });
    }

    return {
        reset: function(container) {
            if (container) {
                _init(j(container));
            } else {
                _init();
            }
        },

        show: function(selector) {
            j(selector).each(function(index, _el) {
                var el = j(_el),
                    el_loader = el.find('[data-loader]');

                el_loader.fadeIn();
            });
        },

        hide: function(selector) {
            j(selector).each(function(index, _el) {
                var el = j(_el),
                    el_loader = el.find('[data-loader]');

                el_loader.fadeOut();
            });
        }
    }
})(jQuery);

Service.ScrollTo = (function(j) {
    return function(el, margin) {
        j('html, body').animate({
            scrollTop: j(el).offset().top - (margin ? margin : 0)
        });
    }
})(jQuery);

Service.PasswordChecker = window.PasswordStrengthChecker ? PasswordStrengthChecker : {
    init: function() {
        console.log('Password strength checker is not available. Please include passwordStrength.js...');
    }
};

Service.ValidationFix = (function(j) {
    return {
        apply: function() {
            j('form').each(function(index, form) {
                j.extend(j(form).validate().settings, {
                    ignore: ':hidden:not([class~=selectized]):not(.required), :hidden > .selectized, .selectize-control .selectize-input input'
                });
            });
        }
    };
})(jQuery);



(function(j) {
    j(function() {
        j(window).load(function() {
            Service.WindowLoad.call();
        }).resize(function() {
            Service.WindowResize.call();
        });
    });
})(jQuery);