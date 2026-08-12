import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const bootstrapSource = await readFile(new URL('../public/ga4-bootstrap.js', import.meta.url), 'utf8');

function storage() {
	const values = new Map();
	return {
		getItem(key) {
			return values.get(key) ?? null;
		},
		setItem(key, value) {
			values.set(key, String(value));
		},
		removeItem(key) {
			values.delete(key);
		},
	};
}

function identityFromCookie(cookie) {
	const sessionStorage = storage();
	const localStorage = storage();
	const window = {
		dataLayer: [],
		sessionStorage,
		localStorage,
		location: { search: '' },
		setTimeout,
	};
	const context = vm.createContext({
		window,
		document: { cookie },
		URLSearchParams,
		decodeURIComponent,
		Promise,
		setTimeout,
		Date,
		Math,
	});
	vm.runInContext(bootstrapSource, context);
	return window.jmGa4Identity.getSync();
}

const clientId = '123456789.1786490000';
const gs2Identity = identityFromCookie(`_ga=GA1.1.${clientId}; _ga_1697T7D92W=GS2.1.s1786490123$o1$g1$t1786490183$j60$l0$h0`);
assert.equal(gs2Identity.clientId, clientId);
assert.equal(gs2Identity.sessionId, '1786490123');

const gs1Identity = identityFromCookie(`_ga=GA1.1.${clientId}; _ga_1697T7D92W=GS1.1.1786490456.1.1.1786490500.0.0.0`);
assert.equal(gs1Identity.clientId, clientId);
assert.equal(gs1Identity.sessionId, '1786490456');

console.log('GA4 client and session identity checks passed.');
