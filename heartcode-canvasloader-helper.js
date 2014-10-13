
var HeartcodeCanvasLoader = (function(j) {
	var options = {},
		el, elType, position, id,
		cl_container, cl_container_width, cl,
		ajaxCall = false;

	j(function() {
		_init();

		j(document).ajaxSuccess(function () {
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

		show: function (selector) {
			j(selector).each(function (index, _el) {
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

					j(window).resize(function () {
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

		hide: function (selector) {
			j(selector).each(function (index, _el) {
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