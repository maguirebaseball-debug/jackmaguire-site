import os
import json
import time
from google import genai
from dotenv import load_dotenv

scratch_env = "/Users/jackmaguire/.gemini/antigravity/scratch/.env"
load_dotenv(scratch_env)
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    load_dotenv("/Users/jackmaguire/CLIStore/.env")
    api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)

# Load data
reddit_file = "/Users/jackmaguire/Developer/jackmaguire-site/scripts/reddit_intern_data.json"
forum_file = "/Users/jackmaguire/CLIStore/WebResearch/Forums/nyc_forum_scored.json"

dataset = []
if os.path.exists(reddit_file):
    with open(reddit_file, "r") as f:
        data = json.load(f)
        dataset.append("--- REDDIT DATA ---")
        for d in data[:300]:
            dataset.append(f"Thread [{d.get('thread_id')}] r/{d.get('subreddit')}: {d.get('title')}\n{d.get('selftext', '')[:300]}")

if os.path.exists(forum_file):
    with open(forum_file, "r") as f:
        data = json.load(f)
        dataset.append("--- FORUM DATA ---")
        for d in data.get("results", [])[:100]:
            dataset.append(f"Forum [{d.get('source')}]: {d.get('title')}\n{d.get('body', '')[:300]}")

dataset_summary = "\n".join(dataset)
if not dataset_summary.strip():
    dataset_summary = "No data loaded."

pages = [
    # Housing & Logistics
    ("finding-sublets.astro", "Finding Sublets", "How to secure short-term summer housing in NYC.", "Housing & Logistics", 1),
    ("broker-fees.astro", "Understanding Broker Fees", "Navigating the brutal reality of NYC broker fees.", "Housing & Logistics", 2),
    ("university-dorms.astro", "University Dorms", "Pros and cons of NYU and Columbia summer housing.", "Housing & Logistics", 3),
    ("laundry-and-groceries.astro", "Laundry & Groceries", "Mastering drop-off laundry and tight grocery budgets.", "Housing & Logistics", 4),
    # Transit & Geography
    ("subway-etiquette.astro", "Subway Etiquette", "Unwritten rules of the MTA.", "Transit & Geography", 5),
    ("the-grid-system.astro", "The Grid System", "Understanding avenues, streets, and borough geography.", "Transit & Geography", 6),
    ("citibike-safety.astro", "CitiBike Safety", "How to survive biking in Manhattan traffic.", "Transit & Geography", 7),
    ("neighborhood-vibes.astro", "Neighborhood Vibes", "East Village vs West Village vs Brooklyn for interns.", "Transit & Geography", 8),
    # Food & Drink
    ("dollar-slices.astro", "Dollar Slices & Cheap Eats", "Finding genuinely cheap food without getting scammed.", "Food & Drink", 9),
    ("networking-coffee.astro", "Networking Coffee Spots", "Quiet coffee shops in Downtown Manhattan.", "Food & Drink", 10),
    ("grocery-hacks.astro", "Grocery Shopping Hacks", "Trader Joe's lines and bodega dynamics.", "Food & Drink", 11),
    # Social & Nightlife
    ("meeting-interns.astro", "Meeting Other Interns", "How to socialize outside of your specific company.", "Social & Nightlife", 12),
    ("free-summer-events.astro", "Free Summer Events", "Outdoor movies, concerts, and free museum days.", "Social & Nightlife", 13),
    ("park-dynamics.astro", "Park Dynamics", "Central Park vs Washington Square Park vs Tompkins.", "Social & Nightlife", 14),
    # Professional & Office Life
    ("coffee-chats.astro", "Coffee Chat Etiquette", "How to ask for and conduct a successful coffee chat.", "Professional & Office Life", 15),
    ("corporate-dress.astro", "Corporate Dress Code", "Dressing professionally during a humid NYC summer.", "Professional & Office Life", 16)
]

base_instructions = """
You are writing a micro-page (approx 300-500 words) for the 2026 NYC Summer Intern Guide.
CRITICAL GROUNDING RULE: Every specific insight or advice you provide MUST have citations from the provided data.
Format citations simply as [ThreadID/Source].
DO NOT use em-dashes anywhere in the text. Use commas or parentheses instead.
DO NOT use cleft sentences.
DO NOT summarize at the end.
Be declarative, direct, and HBR-professional in tone.
Output ONLY the raw HTML/Markdown content that will go inside the <InternWiki> tag. Do not include the <InternWiki> tags or frontmatter yourself, I will wrap your output. Use standard HTML tags (<h2>, <p>, <ul>, <li>) or Markdown. Escape curly braces like `{` to `&#123;` and `}` to `&#125;` to prevent Astro parsing errors. No markdown blocks (` ``` `).
"""

out_dir = "/Users/jackmaguire/Developer/jackmaguire-site/src/pages/nyc-intern-guide"
os.makedirs(out_dir, exist_ok=True)

for filename, title, desc, cat, order in pages:
    if os.path.exists(os.path.join(out_dir, filename)):
        print(f"Skipping {filename}, already exists.", flush=True)
        continue
        
    print(f"Generating {filename}...", flush=True)
    prompt = f"""
{base_instructions}
Topic: {title}
Description: {desc}
Category: {cat}

--- DATA ---
{dataset_summary[:800000]}
"""
    for attempt in range(10):
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            content = response.text.replace("```html", "").replace("```markdown", "").replace("```", "").strip()
            
            astro_template = f"""---
import InternWiki from '../../layouts/InternWiki.astro';

export const title = "{title}";
export const description = "{desc}";
export const category = "{cat}";
export const order = {order};
---

<InternWiki title={{title}} description={{description}} category={{category}} order={{order}}>
{content}
</InternWiki>
"""
            
            with open(os.path.join(out_dir, filename), "w") as f:
                f.write(astro_template)
            print(f"  Saved {filename}")
            break
        except Exception as e:
            if "503" in str(e) or "UNAVAILABLE" in str(e):
                print("  Service unavailable, waiting 10s...")
                time.sleep(10)
            elif "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                print(f"  Rate limit hit (429) on attempt {attempt+1}. Waiting 10 minutes (600s)...", flush=True)
                time.sleep(600)
            else:
                print(f"  Error: {e}")
                break

print("Swarm synthesis complete.", flush=True)
