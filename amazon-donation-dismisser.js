// ==UserScript==
// @name         Amazon Donation Dismisser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description
// @author       You
// @match        https://www.amazon.com/*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	modals()
		.filter(containing(text, keywords()))
		.forEach(dismiss);

	function modals() {
		return Array.from(document.getElementsByClassName('a-modal-scroller'));
	}

	function text(modal) {
		return modal.textContent;
	}

	function containing(text, keywords) {
		return containing_;

		function containing_(modal) {
			return search(text(modal));
		}

		function search(text) {
			return keywords.some(match);

			function match(keyword) {
				return text.contains(keyword);
			}
		}
	}

	function keywords() {
		return ['charity', 'donate', 'donation', 'smile'];
	}

	function dismiss(modal) {
		click(button());

		function button() {
			return modal.querySelector('button.dismiss');
		}
	}

	function click(button) {
		if (!button) return;
		button.click();
	}
})();