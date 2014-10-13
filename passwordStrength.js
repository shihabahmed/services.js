
function passwordStrengthChecker(el, index) {

	var colorCode = {
		weak: '#ff2631',
		acceptable: '#e7b904',
		average: '#21bcff',
		strong: '#b6d165',
		excellent: '#00d500'
	},

	// id = (new Date()).getTime(),
	id = index,

	indicatorHTML = '<div class="password-strength-container noTransition" style="height:5px; margin-top: 3px;">' +
					'	<div id="pnlPasswStrengthIndicator-' + id + '" style="height: 100%; background-color: #dddddd; width: 100% !important;">' +
					'		<div id="pnlPasswIndicator-' + id + '" style="height: 100%;">' +
					'			&nbsp;' +
					'		</div>' +
					'	</div>' +
					'	<label id="lblEvaluation-' + id + '" style="width: auto!important; font-size: 12px;padding:0;"></label>' +
					'</div>';

	el.attr('data-indicator', id).after(indicatorHTML);

	var CheckPassword = function (password) {
		var score = 0;

		if (password.length > 4) {
			if (password.length >= 7)
				score++;
			if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/))
				score++;
			if (password.match(/([!,%,&,#,$,^,*,?,_,~])/))
				score++;
			if (password.match(/[a-z]/) && password.match(/[A-Z]/))
				score++;
			if (password.match(/(.*[!,%,&,#,$,^,*,?,_,~].*[!,%,&,#,$,^,*,?,_,~])/))
				score++;
		}

		return score;
	};

	var ShowStrength = function (el, minLength, preferedLength, minNonAlphaNumChars, preferedNonAlphaNumChars, regularExpression, passwordLabelID, policyStrings, classPrefix, usePolicy, indicatorPanelID, useStylesForStrenghtIndicator) {
		var strings = policyStrings.split(';');

		//var el = document.getElementById(passwordID);
		var labelElem = document.getElementById(passwordLabelID);
		var indicatorElem = document.getElementById(indicatorPanelID);

		if (el && labelElem) {

			var passwordValue = el.value;
			var passwordLength = passwordValue.length;

			var score = CheckPassword(passwordValue);

			if (usePolicy == 'True') {
				labelElem.setAttribute('class', classPrefix + 'NotAcceptable');
				indicatorElem.setAttribute('class', 'PasswIndicatorNotAcceptable');
				indicatorElem.setAttribute('style', 'width:0px;');
				// Special handling for IE7
				indicatorElem.style.cssText = 'width:0px;';
			}
			else {
				labelElem.setAttribute('class', classPrefix + 'Weak');
				indicatorElem.setAttribute('class', 'PasswIndicatorWeak');
				indicatorElem.setAttribute('style', 'height:5px;width:20%;background-color: #ff2631;');
				// Special handling for IE7
				indicatorElem.style.cssText = 'height:5px;width:20%;background-color: #ff2631;';
			}

			// Minimal length
			if (minLength) {
				if (passwordLength == 0) {
					labelElem.innerHTML = '';
					jQuery(indicatorElem).closest('.password-strength-container').css('height', '5px');
					indicatorElem.setAttribute('class', '');
					indicatorElem.setAttribute('style', 'width:0px;');
					// Special handling for IE7
					indicatorElem.style.cssText = 'width:0px;';
					return;
				}
				else if (passwordLength < parseInt(minLength)) {
					labelElem.innerHTML = strings[0];
					jQuery(indicatorElem).closest('.password-strength-container').css('height', 'auto');
					return;
				}
			}


			// Number of non alpha characters        
			var nonAlphaNum = 0;

			if (minNonAlphaNumChars) {

				// Count number of non alfa num characters
				for (var i = 0; i < passwordLength; i++) {
					if (!isAlphaNum(passwordValue[i])) {
						nonAlphaNum++;
					}
				}

				if ((usePolicy == 'True') && (nonAlphaNum < parseInt(minNonAlphaNumChars))) {
					labelElem.innerHTML = strings[0];
					return;
				}
			}


			// Test regular expressions
			if (regularExpression) {
				var re = new RegExp(regularExpression);
				if (!re.test(passwordValue)) {
					labelElem.innerHTML = strings[0];
					return;
				}
			}

			// Count result strength        
			var onePercent = preferedLength / 100.0;
			var lenghtPercent = passwordLength / onePercent;

			onePercent = preferedNonAlphaNumChars / 100.0;
			var nonAlphaPercent = nonAlphaNum / 100.0;

			//alert(lenghtPercent+';'+nonAlphaPercent);
			//var percentResult = (lenghtPercent + nonAlphaPercent) / 2;

			var percentResult = (score * 100) / 5;

			// Set right string to label
			if (percentResult < 25) {
				labelElem.innerHTML = strings[1];
				labelElem.setAttribute('class', classPrefix + 'Weak');
				indicatorElem.setAttribute('class', 'PasswIndicatorWeak');
				indicatorElem.setAttribute('style', 'height:5px;width:20%;background-color: ' + colorCode.weak + ';');
				// Special handling for IE7
				indicatorElem.style.cssText = 'height:5px;width:20%;background-color: ' + colorCode.weak + ';';
			}
			else if (percentResult >= 25 && percentResult < 50) {
				labelElem.innerHTML = strings[2];
				labelElem.setAttribute('class', classPrefix + 'Acceptable');
				indicatorElem.setAttribute('class', 'PasswIndicatorAcceptable');
				indicatorElem.setAttribute('style', 'height:5px;width:40%;background-color: ' + colorCode.acceptable + ';');
				// Special handling for IE7
				indicatorElem.style.cssText = 'height:5px;width:40%;background-color: ' + colorCode.acceptable + ';';
			}
			else if (percentResult >= 50 && percentResult < 75) {
				labelElem.innerHTML = strings[3];
				labelElem.setAttribute('class', classPrefix + 'Average');
				indicatorElem.setAttribute('class', 'PasswIndicatorAverage');
				indicatorElem.setAttribute('style', 'height:5px;width:60%;background-color: ' + colorCode.average + ';');
				// Special handling for IE7
				indicatorElem.style.cssText = 'height:5px;width:60%;background-color: ' + colorCode.average + ';';
			}
			else if (percentResult >= 75 && percentResult < 100) {
				labelElem.innerHTML = strings[4];
				labelElem.setAttribute('class', classPrefix + 'Strong');
				indicatorElem.setAttribute('class', 'PasswIndicatorStrong');
				indicatorElem.setAttribute('style', 'height:5px;width:80%;background-color: ' + colorCode.strong + ';');
				// Special handling for IE7
				indicatorElem.style.cssText = 'height:5px;width:80%;background-color: ' + colorCode.strong + ';';

			}
			else {
				labelElem.innerHTML = strings[5];
				labelElem.setAttribute('class', classPrefix + 'Excellent');
				indicatorElem.setAttribute('class', 'PasswIndicatorExcellent');
				indicatorElem.setAttribute('style', 'height:5px;width:100%;background-color: ' + colorCode.excellent + ';');
				// Special handling for IE7
				indicatorElem.style.cssText = 'height:5px;width:100%;background-color: ' + colorCode.excellent + ';';
			}
		}
	};

	var alphaNum = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

	// Returns whether character is alpha numeric 
	var isAlphaNum = function (param) {
		if (alphaNum.indexOf(param, 0) == -1) {
			return false;
		}

		return true;
	};

	jQuery(function () {
		var regex = "",
			sb = "Very weak;Weak;Acceptable;Average;Strong;Excellent";

		el.keyup(function (event) {
			var data = el.data();
			ShowStrength(el.get(0), 6, 6, 0, 1, regex, "lblEvaluation-" + data.indicator, sb, "", false, "pnlPasswIndicator-" + data.indicator, "");
		});
	});
}

var PasswordStrengthChecker = (function (j) {
	return {
		// Add password strength checker to a password field
		init: function (selector) {
			var items = j(selector);
			for (var i = 0; i < items.length; i++) {
				passwordStrengthChecker(j(items[i]), i);
			}
			/*j(selector).each(function(index, el) {
				passwordStrengthChecker(j(el), index);
			});*/
		}
	}
})(jQuery);