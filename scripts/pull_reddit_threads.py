import os
import praw
from dotenv import load_dotenv
import json
import time
from datetime import datetime, timedelta

env_path = "/Users/jackmaguire/CLIStore/.env"
load_dotenv(env_path)

reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT")
)

print(f"Authenticated as: {reddit.user.me() if not reddit.read_only else 'Read-Only Mode'}")

subreddits = ["technology", "finance", "datascience", "Futurology"]
cutoff_date = datetime.utcnow() - timedelta(days=180)
cutoff_timestamp = cutoff_date.timestamp()

results = []

for sub_name in subreddits:
    print(f"Scraping r/{sub_name}...")
    subreddit = reddit.subreddit(sub_name)
    count = 0
    # Fetch top posts from the past year, filter to 180 days
    for submission in subreddit.top(time_filter="year", limit=1000):
        if submission.created_utc >= cutoff_timestamp:
            submission.comments.replace_more(limit=0)  # Remove MoreComments objects
            top_comments = []
            
            # Sort comments by score and take top 20
            sorted_comments = sorted(submission.comments, key=lambda c: getattr(c, 'score', 0), reverse=True)
            
            for comment in sorted_comments[:20]:
                top_comments.append({
                    "author": str(comment.author) if comment.author else "[deleted]",
                    "body": comment.body,
                    "score": comment.score
                })
                
            results.append({
                "subreddit": sub_name,
                "title": submission.title,
                "selftext": submission.selftext,
                "score": submission.score,
                "url": submission.url,
                "created_utc": submission.created_utc,
                "top_comments": top_comments
            })
            count += 1
            if count >= 500:
                break
    print(f"Collected {count} threads from r/{sub_name}")
    time.sleep(2)  # Rate limiting safety

output_file = "/Users/jackmaguire/Developer/jackmaguire-site/research/reddit_2000_threads_data.json"
os.makedirs(os.path.dirname(output_file), exist_ok=True)

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"Saved {len(results)} total threads to {output_file}")
