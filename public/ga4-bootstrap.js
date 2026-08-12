const gaMeasurementId = 'G-1697T7D92W';
const gaClientStorageKey = 'jm_ga4_audit_client';
const gaSessionStorageKey = 'jm_ga4_audit_session';
const gaSessionCookieName = `_ga_${gaMeasurementId.replace(/^G-/, '').replace(/-/g, '_')}`;

window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () {
	window.dataLayer.push(arguments);
};

function readGaCookie(name) {
	return document.cookie
		.split('; ')
		.find((cookie) => cookie.startsWith(`${name}=`))
		?.split('=')
		.slice(1)
		.join('=') || '';
}

function gaClientIdFromCookie() {
	return readGaCookie('_ga').match(/^GA\d+\.\d+\.(\d+\.\d+)$/)?.[1] || '';
}

function gaSessionIdFromCookie() {
	const value = decodeURIComponent(readGaCookie(gaSessionCookieName));
	const gs2Session = value.match(/^GS2\.\d+\.s(\d{10,13})(?:\$|$)/)?.[1];
	if (gs2Session) return gs2Session;
	return value.match(/^GS1\.\d+\.(\d{10,13})(?:\.|$)/)?.[1] || '';
}

function validGaClientId(value) {
	return typeof value === 'string' && /^\d+\.\d+$/.test(value) ? value : '';
}

function validGaSessionId(value) {
	const normalized = String(value || '');
	return /^\d{10,13}$/.test(normalized) ? normalized : '';
}

function persistGaIdentity(clientId, sessionId) {
	if (clientId) window.sessionStorage.setItem(gaClientStorageKey, clientId);
	if (sessionId) window.sessionStorage.setItem(gaSessionStorageKey, sessionId);
	return { clientId, sessionId };
}

function getGaIdentitySync() {
	const cookieClientId = validGaClientId(gaClientIdFromCookie());
	const cookieSessionId = validGaSessionId(gaSessionIdFromCookie());
	const storedClientId = validGaClientId(window.sessionStorage.getItem(gaClientStorageKey));
	const storedSessionId = validGaSessionId(window.sessionStorage.getItem(gaSessionStorageKey));
	const clientId = cookieClientId || storedClientId || `${Math.floor(Math.random() * 1_000_000_000)}.${Math.floor(Date.now() / 1000)}`;
	const sessionId = cookieSessionId || storedSessionId || String(Math.floor(Date.now() / 1000));
	return persistGaIdentity(clientId, sessionId);
}

function getGtagField(field) {
	return new Promise((resolve) => {
		let settled = false;
		const finish = (value = '') => {
			if (settled) return;
			settled = true;
			resolve(String(value || ''));
		};
		window.setTimeout(() => finish(''), 1200);
		try {
			window.gtag('get', gaMeasurementId, field, finish);
		} catch {
			finish('');
		}
	});
}

async function resolveGaIdentity() {
	const cookieClientId = validGaClientId(gaClientIdFromCookie());
	const cookieSessionId = validGaSessionId(gaSessionIdFromCookie());
	if (cookieClientId && cookieSessionId) return persistGaIdentity(cookieClientId, cookieSessionId);

	const [gtagClientId, gtagSessionId] = await Promise.all([
		getGtagField('client_id'),
		getGtagField('session_id'),
	]);
	const refreshedClientId = validGaClientId(gaClientIdFromCookie());
	const refreshedSessionId = validGaSessionId(gaSessionIdFromCookie());
	const fallback = getGaIdentitySync();
	return persistGaIdentity(
		refreshedClientId || validGaClientId(gtagClientId) || fallback.clientId,
		refreshedSessionId || validGaSessionId(gtagSessionId) || fallback.sessionId,
	);
}

window.jmGa4Identity = {
	getSync: getGaIdentitySync,
	resolve: resolveGaIdentity,
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
window.gtag('config', gaMeasurementId, gaConfig);
