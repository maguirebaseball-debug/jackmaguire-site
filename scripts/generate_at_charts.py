import json
from pathlib import Path

data_file = Path("research/at-98-days.json")
with open(data_file, encoding="utf-8") as f:
    days = json.load(f)

img_dir = Path("public/images/at")
img_dir.mkdir(parents=True, exist_ok=True)

# 1. Daily Mileage Chart
width = 900
height = 360
padding_left = 50
padding_bottom = 40
padding_top = 30
padding_right = 30
plot_w = width - padding_left - padding_right
plot_h = height - padding_top - padding_bottom

max_miles = 36.0
y_scale = plot_h / max_miles
bar_w = plot_w / len(days)

svg1 = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="100%" height="auto" style="background:#fff; font-family:Charter, serif;">']
svg1.append(f'<text x="{padding_left}" y="20" font-size="15" font-weight="bold" fill="#000">Daily Mileage Across 98 Days (Springer Mountain to Mount Katahdin)</text>')

for m in [10, 20, 26.2, 30]:
    y = padding_top + plot_h - (m * y_scale)
    dash = 'stroke-dasharray="4 4"' if m in [26.2, 30] else ''
    color = '#c62828' if m == 26.2 else ('#888' if m != 30 else '#1565c0')
    label = 'Marathon (26.2 mi)' if m == 26.2 else (f'{int(m)} mi' if m != 30 else '30 mi')
    svg1.append(f'<line x1="{padding_left}" y1="{y:.1f}" x2="{width - padding_right}" y2="{y:.1f}" stroke="{color}" stroke-width="1" {dash}/>')
    svg1.append(f'<text x="{padding_left - 8}" y="{y + 4:.1f}" font-size="11" text-anchor="end" fill="{color}">{label}</text>')

for i, d in enumerate(days):
    m = d['miles']
    bh = m * y_scale
    x = padding_left + i * bar_w
    y = padding_top + plot_h - bh
    col = '#1565c0' if m >= 30 else ('#2e7d32' if m >= 26.2 else '#555')
    bw = max(1.0, bar_w - 1.5)
    svg1.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{bw:.1f}" height="{bh:.1f}" fill="{col}"><title>Day {d["day"]}: {d["location"]} ({m} mi)</title></rect>')

for day_num in [1, 15, 30, 45, 60, 75, 90, 98]:
    idx = day_num - 1
    x = padding_left + idx * bar_w + bar_w / 2
    svg1.append(f'<text x="{x:.1f}" y="{height - 15}" font-size="11" text-anchor="middle" fill="#333">Day {day_num}</text>')

svg1.append(f'<text x="{width / 2}" y="{height - 2}" font-size="12" text-anchor="middle" fill="#666">Trail Days (Green = Marathon 26.2+ mi, Blue = 30+ mi, Gray = Standard Days)</text>')
svg1.append('</svg>')
(img_dir / 'at-daily-mileage-chart.svg').write_text('\n'.join(svg1), encoding='utf-8')
print('Chart 1 written!')

# 2. Cumulative Pace Chart
svg2 = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="100%" height="auto" style="background:#fff; font-family:Charter, serif;">']
svg2.append(f'<text x="{padding_left}" y="20" font-size="15" font-weight="bold" fill="#000">Cumulative Miles: 98-Day Actual vs Standard 150-Day Thru-Hike</text>')

max_cum = 2200.0
cum_y_scale = plot_h / max_cum

for m in [500, 1000, 1500, 2000, 2178]:
    y = padding_top + plot_h - (m * cum_y_scale)
    svg2.append(f'<line x1="{padding_left}" y1="{y:.1f}" x2="{width - padding_right}" y2="{y:.1f}" stroke="#ddd" stroke-width="1"/>')
    svg2.append(f'<text x="{padding_left - 8}" y="{y + 4:.1f}" font-size="11" text-anchor="end" fill="#666">{m} mi</text>')

std_x1 = padding_left
std_y1 = padding_top + plot_h
std_x2 = width - padding_right
std_y2 = padding_top + plot_h - (1423 * cum_y_scale)
svg2.append(f'<line x1="{std_x1}" y1="{std_y1}" x2="{std_x2}" y2="{std_y2:.1f}" stroke="#999" stroke-width="2" stroke-dasharray="6 4"/>')
svg2.append(f'<text x="{std_x2 - 10}" y="{std_y2 - 10:.1f}" font-size="11" text-anchor="end" fill="#777">Standard 150-Day Pace (~1,420 mi at Day 98)</text>')

points = []
for i, d in enumerate(days):
    x = padding_left + (i / (len(days) - 1)) * plot_w
    y = padding_top + plot_h - (d['cumulative'] * cum_y_scale)
    points.append(f'{x:.1f},{y:.1f}')

svg2.append(f'<polyline points="{" ".join(points)}" fill="none" stroke="#1565c0" stroke-width="3"/>')
fin_y = padding_top + plot_h - (2178.3 * cum_y_scale)
svg2.append(f'<circle cx="{width - padding_right}" cy="{fin_y:.1f}" r="4" fill="#1565c0"/>')
svg2.append(f'<text x="{width - padding_right - 10}" y="{fin_y - 10:.1f}" font-size="12" font-weight="bold" text-anchor="end" fill="#1565c0">Day 98 Finish (2,178.3 mi)</text>')

for day_num in [1, 20, 40, 60, 80, 98]:
    idx = day_num - 1
    x = padding_left + (idx / (len(days) - 1)) * plot_w
    svg2.append(f'<text x="{x:.1f}" y="{height - 15}" font-size="11" text-anchor="middle" fill="#333">Day {day_num}</text>')

svg2.append(f'<text x="{width / 2}" y="{height - 2}" font-size="12" text-anchor="middle" fill="#666">Trail Days (Solid Blue = 98-Day Actual, Dashed Gray = Standard 150-Day Pace)</text>')
svg2.append('</svg>')
(img_dir / 'at-cumulative-pace-chart.svg').write_text('\n'.join(svg2), encoding='utf-8')
print('Chart 2 written!')

# 3. State Pace Bars
states = [
    ('NJ', 'New Jersey', 25.70),
    ('CT', 'Connecticut', 25.35),
    ('NY', 'New York', 24.88),
    ('PA', 'Pennsylvania', 24.72),
    ('TN', 'Tennessee', 24.67),
    ('VA', 'Virginia', 24.49),
    ('MA', 'Massachusetts', 24.23),
    ('VT', 'Vermont', 23.30),
    ('WV/MD', 'West Virginia / MD', 23.15),
    ('ME', 'Maine', 20.90),
    ('GA', 'Georgia', 20.70),
    ('NH', 'New Hampshire', 19.81),
    ('NC', 'North Carolina', 18.87)
]

s_height = 420
s_plot_w = width - 160 - padding_right
row_h = (s_height - 60) / len(states)

svg3 = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {s_height}" width="100%" height="auto" style="background:#fff; font-family:Charter, serif;">']
svg3.append(f'<text x="160" y="22" font-size="15" font-weight="bold" fill="#000">Average Daily Mileage by State / Section</text>')

max_state_mi = 28.0
s_scale = s_plot_w / max_state_mi

for m in [5, 10, 15, 20, 25]:
    x = 160 + m * s_scale
    svg3.append(f'<line x1="{x:.1f}" y1="40" x2="{x:.1f}" y2="{s_height - 25}" stroke="#eee" stroke-width="1"/>')
    svg3.append(f'<text x="{x:.1f}" y="{s_height - 10}" font-size="11" text-anchor="middle" fill="#888">{m} mi/day</text>')

avg_x = 160 + 22.48 * s_scale
svg3.append(f'<line x1="{avg_x:.1f}" y1="35" x2="{avg_x:.1f}" y2="{s_height - 25}" stroke="#c62828" stroke-width="1.5" stroke-dasharray="4 4"/>')
svg3.append(f'<text x="{avg_x:.1f}" y="32" font-size="11" text-anchor="middle" fill="#c62828" font-weight="bold">Overall Average: 22.48 mi/day</text>')

for i, (code, name, avg_mi) in enumerate(states):
    y = 45 + i * row_h
    bw = avg_mi * s_scale
    col = '#2e7d32' if avg_mi >= 25 else ('#1565c0' if avg_mi >= 22.5 else '#e65100')
    svg3.append(f'<text x="150" y="{y + 16:.1f}" font-size="13" text-anchor="end" fill="#000">{name}</text>')
    svg3.append(f'<rect x="160" y="{y + 2:.1f}" width="{bw:.1f}" height="{row_h - 7:.1f}" fill="{col}" rx="2"/>')
    svg3.append(f'<text x="{165 + bw:.1f}" y="{y + 16:.1f}" font-size="12" font-weight="bold" fill="#333">{avg_mi:.2f} mi</text>')

svg3.append('</svg>')
(img_dir / 'at-state-mileage-bars.svg').write_text('\n'.join(svg3), encoding='utf-8')
print('Chart 3 written!')

# 4. Ultralight Gear Breakdown Chart
g_width = 800
g_height = 240
svg4 = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {g_width} {g_height}" width="100%" height="auto" style="background:#fff; font-family:Charter, serif;">']
svg4.append(f'<text x="30" y="24" font-size="15" font-weight="bold" fill="#000">Jack\'s 5.73 lb (91.75 oz) Ultralight Base Weight Breakdown</text>')

categories = [
    ('Shelter & Sleep', 43.90, '#1565c0', 'Marmot Pounder 17oz, Pad 9.4oz, Tarp 7.5oz, Stakes 2.8oz, Stuffsacks 2.7oz, Liner 2.1oz, Polycro 1.5oz, Rope 1oz'),
    ('Pack & Rain Shell', 24.70, '#2e7d32', 'Golite Jam Backpack 19oz, DriDuck Rain Jacket 5.7oz'),
    ('Hydration & Kitchen', 6.20, '#e65100', '2x Platypus 2.2oz, Aquamira 2oz, Alcohol Stove 0.5oz, Spoon 0.2oz, Soap 2oz'),
    ('Electronics & Tools', 16.95, '#6a1b9a', 'Camera w/ bat 9.1oz, Extra socks 3.5oz, Petzl light 2.7oz, Leatherman Micra 1.7oz, Cash/matches')
]

bar_top = 45
bar_h = 36
bar_total_w = g_width - 60
cur_x = 30

for cat, weight, col, details in categories:
    w = (weight / 91.75) * bar_total_w
    pct = (weight / 91.75) * 100
    svg4.append(f'<rect x="{cur_x:.1f}" y="{bar_top}" width="{w:.1f}" height="{bar_h}" fill="{col}"><title>{cat}: {weight:.1f} oz ({pct:.1f}%)</title></rect>')
    cur_x += w

leg_y = 105
for i, (cat, weight, col, details) in enumerate(categories):
    y = leg_y + i * 30
    pct = (weight / 91.75) * 100
    svg4.append(f'<rect x="30" y="{y}" width="14" height="14" fill="{col}" rx="2"/>')
    svg4.append(f'<text x="52" y="{y + 12}" font-size="13" font-weight="bold" fill="#000">{cat} ({weight:.2f} oz / {weight/16:.2f} lbs, {pct:.1f}%):</text>')
    svg4.append(f'<text x="315" y="{y + 12}" font-size="12" fill="#555">{details}</text>')

svg4.append('</svg>')
(img_dir / 'at-gear-weight-breakdown.svg').write_text('\n'.join(svg4), encoding='utf-8')
print('Chart 4 written!')
