window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () {
	window.dataLayer.push(arguments);
};

const internalTrafficKey = 'jm_ga_internal';
const gaParams = new URLSearchParams(window.location.search);
if (gaParams.get('ga_internal') === '1' || gaParams.get('ga_debug') === '1') {
	window.localStorage.setItem(internalTrafficKey, '1');
} else if (gaParams.get('ga_internal') === '0') {
	window.localStorage.removeItem(internalTrafficKey);
}

const gaConfig = {};
if (window.localStorage.getItem(internalTrafficKey) === '1') gaConfig.traffic_type = 'internal';
if (gaParams.get('ga_debug') === '1') gaConfig.debug_mode = true;

window.gtag('js', new Date());
window.gtag('config', 'G-1697T7D92W', gaConfig);
