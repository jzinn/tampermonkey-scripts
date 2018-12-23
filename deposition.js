// ==UserScript==
// @name         Deposition
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description
// @author       You
// @match        http://*/*
// @match        https://*/*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	onhtml(oncss(ontick(run)));

	function onhtml(fn) {
		loading() ? waitEvent() : waitTick();

		function waitEvent() {
			document.addEventListener('DOMContentLoaded', fn);
		}

		function waitTick() {
			setTimeout(fn);
		}
	}

	function loading() {
		return document.readyState === 'loading';
	}

	function oncss(fn) {
		return oncss_;

		function oncss_() {
			wait(styleSheets(), fn);
		}
	}

	function wait(styleSheets, fn) {
		if (styleSheets.length)
			styleSheets.forEach(oncomplete(after(styleSheets.length, fn)));
		else setTimeout(fn);
	}

	function styleSheets() {
		// return Array.from(document.styleSheets);
		return Array.from(
			document.head.querySelectorAll('link[rel=stylesheet]')
		).filter(function(ss) {
			return !ss.sheet;
		});
	}

	function oncomplete(fn) {
		return oncomplete_;

		function oncomplete_(element) {
			attach(once(fn, yelp('oncomplete function should only be called once')));

			function attach(fn_) {
				element.addEventListener('load', fn_);
				element.addEventListener('error', fn_);
			}
		}
	}

	function once(first, rest) {
		return start(a);

		function a(next) {
			first();
			first = null;
			next(b);
		}

		function b() {
			rest();
		}
	}

	function start(state) {
		return transition;

		function transition() {
			state(next);
		}

		function next(state_) {
			state = state_;
		}
	}

	function yelp(expression) {
		return yelp_;

		function yelp_() {
			throw expression;
		}
	}

	function after(n, fn) {
		return after_;

		function after_() {
			if (--n) return;
			setTimeout(fn);
			fn = null;
		}
	}

	function ontick(fn) {
		return ontick_;

		function ontick_() {
			requestAnimationFrame(fn);
		}
	}

	function run() {
		run_([0, window.innerWidth, document.body.clientWidth]);
	}

	function run_(widths) {
		process(document.documentElement);
		traverse(document.body);

		function traverse(node) {
			if (process(node)) return;
			node.childNodes.forEach(traverse);
		}

		function process(node) {
			if (!(element() && wide())) return true;

			if (node.clientWidth !== 0) fix(getComputedStyle(node), node.style);

			function element() {
				return node.nodeType === 1 && !metadata(node.nodeName);
			}

			function wide() {
				return widths.includes(node.clientWidth);
			}
		}
	}

	function metadata(name) {
		return (
			name === 'BASE' ||
			name === 'LINK' ||
			name === 'META' ||
			name === 'NOSCRIPT' ||
			name === 'SCRIPT' ||
			name === 'STYLE' ||
			name === 'TEMPLATE' ||
			name === 'TITLE'
		);
	}

	function fix(computed, inline) {
		unstyle('display', eq, 'none');
		unstyle('height', always);
		unstyle('opacity', eq, '0');
		unstyle('overflow-y', eq, 'hidden');
		unstyle('position', member, ['absolute', 'fixed', 'sticky'], unposition);
		unstyle('transform', neq, 'none');
		unstyle('transition-duration', neq, '0s', untransition);
		unstyle('visibility', eq, 'hidden');

		function unstyle(property, predicate, arg, override) {
			if (predicate(arg, computed.getPropertyValue(property)))
				(override || initialize)(property);
		}

		function initialize(property) {
			inline.setProperty(property, 'initial', 'important');
		}

		function unposition() {
			inline.setProperty('position', 'relative', 'important');
			unstyle('top', neq, '0px');
			unstyle('right', neq, '0px');
			unstyle('bottom', neq, '0px');
			unstyle('left', neq, '0px');
		}

		function untransition() {
			inline.setProperty('transition-property', 'none', 'important');
		}
	}

	function always() {
		return true;
	}

	function eq(arg, value) {
		return arg === value;
	}

	function neq(arg, value) {
		return arg !== value;
	}

	function member(arg, value) {
		return arg.includes(value);
	}
})();
