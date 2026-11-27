export const prerender = false;

type LiveState = {
  icao24: string;
  flight: string | null;
  reg: string | null;
  type: string | null;
  lat: number | null;
  lon: number | null;
  altBaroFt: number | null;
  altGeoFt: number | null;
  speedKt: number | null;
  heading: number | null;
  vsFpm: number | null;
  squawk: string | null;
  seenPosS: number | null;
  ts: number;
  source: string;
};

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

async function fetchAdsbLol(icao24: string): Promise<LiveState | null> {
  const res = await fetch(`https://api.adsb.lol/v2/hex/${icao24}`, {
    headers: { 'User-Agent': 'jackmaguire.org-flight-tracker/1.0' },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const a = (data.ac || [])[0];
  if (!a || a.lat == null || a.lon == null) return null;
  return {
    icao24,
    flight: (a.flight || '').trim() || null,
    reg: a.r || null,
    type: a.t || null,
    lat: a.lat,
    lon: a.lon,
    altBaroFt: a.alt_baro ?? null,
    altGeoFt: a.alt_geom ?? null,
    speedKt: a.gs ?? null,
    heading: a.track ?? null,
    vsFpm: a.baro_rate ?? null,
    squawk: a.squawk || null,
    seenPosS: a.seen_pos ?? null,
    ts: Date.now(),
    source: 'adsb.lol',
  };
}

async function fetchOpenSky(icao24: string): Promise<LiveState | null> {
  const res = await fetch(
    `https://opensky-network.org/api/states/all?icao24=${icao24}`,
    {
      headers: { 'User-Agent': 'jackmaguire.org-flight-tracker/1.0' },
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!res.ok) return null;
  const data = await res.json();
  const v = (data.states || [])[0];
  if (!v || v[6] == null || v[5] == null) return null;
  return {
    icao24,
    flight: (v[1] || '').trim() || null,
    reg: null,
    type: null,
    lat: v[6],
    lon: v[5],
    altBaroFt: v[7] != null ? v[7] * 3.28084 : null,
    altGeoFt: v[13] != null ? v[13] * 3.28084 : null,
    speedKt: v[9] != null ? v[9] * 1.94384 : null,
    heading: v[10] ?? null,
    vsFpm: v[11] != null ? v[11] * 196.85 : null,
    squawk: v[14] || null,
    seenPosS: null,
    ts: (v[4] || 0) * 1000,
    source: 'OpenSky',
  };
}

export async function GET({ url }: { url: URL }): Promise<Response> {
  const icao24 = (url.searchParams.get('icao24') || '').trim().toLowerCase();
  if (!icao24 || !/^[0-9a-f]{6}$/.test(icao24)) {
    return jsonResponse({ error: 'Pass a 6 digit hex icao24, for example ?icao24=aa5078.' }, 400);
  }

  let state: LiveState | null = null;
  try {
    state = await fetchAdsbLol(icao24);
  } catch {
    state = null;
  }
  if (!state) {
    try {
      state = await fetchOpenSky(icao24);
    } catch {
      state = null;
    }
  }

  if (!state) {
    return jsonResponse({ error: 'No live position for this aircraft right now.' }, 404);
  }
  return jsonResponse(state, 200);
}
