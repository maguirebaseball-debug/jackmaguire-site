import fs from 'node:fs';
import path from 'node:path';

const inputPath = path.resolve('scratchpad/nynta2020.geojson');
const outputPath = path.resolve('src/data/chatgpt-nyc-map.json');
const sourceUrl = 'https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/NYC_Neighborhood_Tabulation_Areas_2020/FeatureServer/0/query?where=1%3D1&outFields=NTA2020%2CNTAName%2CBoroName&outSR=4326&f=geojson';
const geojson = fs.existsSync(inputPath)
  ? JSON.parse(fs.readFileSync(inputPath, 'utf8'))
  : await fetch(sourceUrl).then((response) => {
      if (!response.ok) throw new Error(`NYC Planning request failed: ${response.status}`);
      return response.json();
    });

const areas = [
  { id: 'financial-district', name: 'Financial District, Battery Park City, and Tribeca', short: 'FiDi + Tribeca', borough: 'Manhattan', image: 'financial-district' },
  { id: 'soho-noho-nolita-little-italy', name: 'SoHo, NoHo, Nolita, Little Italy, and Greenwich Village', short: 'SoHo + Villages', borough: 'Manhattan', image: 'soho-noho-nolita-little-italy' },
  { id: 'chinatown', name: 'Chinatown and Two Bridges', short: 'Chinatown', borough: 'Manhattan', image: 'chinatown' },
  { id: 'lower-east-side', name: 'Lower East Side', short: 'LES', borough: 'Manhattan', image: 'lower-east-side' },
  { id: 'east-village', name: 'East Village', short: 'East Village', borough: 'Manhattan', image: 'east-village' },
  { id: 'west-village', name: 'West Village', short: 'West Village', borough: 'Manhattan', image: 'west-village' },
  { id: 'chelsea', name: 'Chelsea and Hudson Yards', short: 'Chelsea', borough: 'Manhattan', image: 'chelsea' },
  { id: 'midtown', name: "Midtown, Hell's Kitchen, Gramercy, Kips Bay, and Murray Hill", short: 'Midtown', borough: 'Manhattan', image: 'midtown' },
  { id: 'upper-west-side', name: 'Upper West Side, Manhattan Valley, and Central Park', short: 'Upper West', borough: 'Manhattan', image: 'upper-west-side' },
  { id: 'upper-east-side', name: 'Upper East Side, Lenox Hill, Yorkville, and Roosevelt Island', short: 'Upper East', borough: 'Manhattan', image: 'upper-east-side' },
  { id: 'harlem', name: 'Harlem, East Harlem, Morningside Heights, Hamilton Heights, and West Harlem', short: 'Harlem', borough: 'Manhattan', image: 'harlem' },
  { id: 'washington-heights', name: 'Washington Heights and Inwood', short: 'Washington Hts.', borough: 'Manhattan', image: 'washington-heights' },
  { id: 'north-brooklyn', name: 'Greenpoint, Williamsburg, and Bushwick', short: 'North Brooklyn', borough: 'Brooklyn', image: 'north-brooklyn' },
  { id: 'brownstone-brooklyn', name: 'Brooklyn Heights, Downtown Brooklyn, Fort Greene, Clinton Hill, and Park Slope', short: 'Brownstone Brooklyn', borough: 'Brooklyn', image: 'brownstone-brooklyn' },
  { id: 'central-brooklyn', name: 'Bed-Stuy, Crown Heights, Prospect Lefferts Gardens, and East Flatbush', short: 'Central Brooklyn', borough: 'Brooklyn', image: 'central-brooklyn' },
  { id: 'south-brooklyn', name: 'Red Hook, Sunset Park, Bay Ridge, Borough Park, Kensington, and Midwood', short: 'South Brooklyn', borough: 'Brooklyn', image: 'south-brooklyn' },
  { id: 'coastal-brooklyn', name: 'East New York, Canarsie, Flatlands, Sheepshead Bay, Brighton Beach, and Coney Island', short: 'Coastal Brooklyn', borough: 'Brooklyn', image: 'coastal-brooklyn' },
  { id: 'western-queens', name: 'Astoria, Long Island City, Sunnyside, Woodside, and Maspeth', short: 'Western Queens', borough: 'Queens', image: 'western-queens' },
  { id: 'central-queens', name: 'Jackson Heights, Elmhurst, Corona, Ridgewood, Forest Hills, and Kew Gardens', short: 'Central Queens', borough: 'Queens', image: 'central-queens' },
  { id: 'northern-queens', name: 'Flushing, Whitestone, Bayside, and Little Neck', short: 'Northern Queens', borough: 'Queens', image: 'northern-queens' },
  { id: 'southern-queens', name: 'Jamaica, Queens Village, Ozone Park, Howard Beach, and the Rockaways', short: 'Southern Queens', borough: 'Queens', image: 'southern-queens' },
  { id: 'south-bronx', name: 'South Bronx, Concourse, Highbridge, Hunts Point, and Soundview', short: 'South Bronx', borough: 'Bronx', image: 'south-bronx' },
  { id: 'north-bronx', name: 'Fordham, Belmont, Riverdale, Pelham Bay, Morris Park, and the North Bronx', short: 'North Bronx', borough: 'Bronx', image: 'north-bronx' },
  { id: 'north-staten-island', name: 'North Shore and Mid-Island, Staten Island', short: 'North + Mid-Island', borough: 'Staten Island', image: 'north-staten-island' },
  { id: 'south-staten-island', name: 'South Shore, Staten Island', short: 'South Shore', borough: 'Staten Island', image: 'south-staten-island' },
];

function areaFor(code) {
  if (code.startsWith('MN01')) return 'financial-district';
  if (code === 'MN0203') return 'west-village';
  if (code.startsWith('MN02')) return 'soho-noho-nolita-little-italy';
  if (code === 'MN0301') return 'chinatown';
  if (code === 'MN0302') return 'lower-east-side';
  if (code === 'MN0303') return 'east-village';
  if (code === 'MN0401') return 'chelsea';
  if (/^MN(04|05|06)/.test(code)) return 'midtown';
  if (code.startsWith('MN07') || code === 'MN6491') return 'upper-west-side';
  if (code.startsWith('MN08')) return 'upper-east-side';
  if (/^MN(09|10|11)/.test(code)) return 'harlem';
  if (code.startsWith('MN12')) return 'washington-heights';

  if (/^BK(01|04)/.test(code)) return 'north-brooklyn';
  if (/^BK(02|06|08)/.test(code) || code === 'BK5591') return 'brownstone-brooklyn';
  if (/^BK(03|09|16|17)/.test(code)) return 'central-brooklyn';
  if (/^BK(07|10|11|12|14)/.test(code)) return 'south-brooklyn';
  if (code.startsWith('BK')) return 'coastal-brooklyn';

  if (/^QN(01|02|05)/.test(code)) return 'western-queens';
  if (/^QN(03|04|06|08|09)/.test(code) || code === 'QN8191' || code === 'QN8291') return 'central-queens';
  if (/^QN(07|11)/.test(code)) return 'northern-queens';
  if (code.startsWith('QN')) return 'southern-queens';

  if (/^BX(01|02|03|04|05|09)/.test(code)) return 'south-bronx';
  if (code.startsWith('BX')) return 'north-bronx';

  if (/^SI(01|02)/.test(code)) return 'north-staten-island';
  if (code.startsWith('SI')) return 'south-staten-island';
  throw new Error(`No area for ${code}`);
}

function sqSegDist(p, a, b) {
  let x = a[0]; let y = a[1];
  let dx = b[0] - x; let dy = b[1] - y;
  if (dx || dy) {
    const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) { x = b[0]; y = b[1]; }
    else if (t > 0) { x += dx * t; y += dy * t; }
  }
  dx = p[0] - x; dy = p[1] - y;
  return dx * dx + dy * dy;
}

function simplify(points, tolerance = 0.00008) {
  if (points.length <= 4) return points;
  const sqTolerance = tolerance * tolerance;
  const marked = new Uint8Array(points.length);
  marked[0] = marked[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    let max = sqTolerance; let index = 0;
    for (let i = first + 1; i < last; i++) {
      const dist = sqSegDist(points[i], points[first], points[last]);
      if (dist > max) { index = i; max = dist; }
    }
    if (index) { marked[index] = 1; stack.push([first, index], [index, last]); }
  }
  return points.filter((_, i) => marked[i]);
}

function simplifyGeometry(geometry) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  return polygons.map((polygon) => polygon.map((ring) => simplify(ring)));
}

const features = geojson.features.map((feature) => ({
  code: feature.properties.NTA2020,
  officialName: feature.properties.NTAName,
  area: areaFor(feature.properties.NTA2020),
  polygons: simplifyGeometry(feature.geometry),
}));

const used = new Set(features.map((feature) => feature.area));
const missingAreas = areas.filter((area) => !used.has(area.id));
if (missingAreas.length) throw new Error(`Unused areas: ${missingAreas.map((area) => area.id).join(', ')}`);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify({ source: 'NYC Planning 2020 Neighborhood Tabulation Areas', areas, features }));
console.log(`Wrote ${features.length} features and ${areas.length} visual areas to ${outputPath}`);
