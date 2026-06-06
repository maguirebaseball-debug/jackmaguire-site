import os
import praw
import logging
import json
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO)

env_path = "/Users/jackmaguire/CLIStore/.env"
load_dotenv(env_path)

reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT")
)

print(f"Authenticated as: {reddit.user.me() if not reddit.read_only else 'Read-Only Mode'}", flush=True)

subs = [
    "AskNYC", "nyu", "columbia", "nyc", "FinancialCareers", "csMajors",
    "FoodNYC", "astoria", "Bushwick", "uppereastside", "williamsburg",
    "MicrowaveMeals", "NYCbitcheswithtaste"
]

results = []

for sub_name in subs:
    print(f"Scraping r/{sub_name}...", flush=True)
    try:
        subreddit = reddit.subreddit(sub_name)
        # Search for intern related terms
        for submission in subreddit.search("intern OR internship OR summer", time_filter="year", limit=30):
            submission.comments.replace_more(limit=0)
            top_comments = []
            for comment in submission.comments[:5]:
                top_comments.append(comment.body)
                
            results.append({
                "thread_id": submission.id,
                "subreddit": sub_name,
                "title": submission.title,
                "selftext": submission.selftext,
                "top_comments": top_comments
            })
    except Exception as e:
        print(f"Error scraping {sub_name}: {e}", flush=True)

output_path = "/Users/jackmaguire/Developer/jackmaguire-site/scripts/reddit_intern_data.json"
with open(output_path, "w") as f:
    json.dump(results, f, indent=2)

print(f"Saved {len(results)} threads to {output_path}", flush=True)
