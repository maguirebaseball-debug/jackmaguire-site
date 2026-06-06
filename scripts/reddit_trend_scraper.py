import os
import praw
import json
from dotenv import load_dotenv

# 1. Explicitly load the correct environment file
env_path = "/Users/jackmaguire/CLIStore/.env"
load_dotenv(env_path)

# 2. Initialize PRAW using the loaded credentials
reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT")
)

print(f"Authenticated as: {reddit.user.me() if not reddit.read_only else 'Read-Only Mode'}")

subreddits = [
    "technology", "Futurology", "artificial", "MachineLearning", # tech
    "finance", "investing", "personalfinance", "Economics", # finance
    "datascience", "dataengineering", "analytics", # data
    "sociology", "AskSocialScience", "urbanplanning" # society
]

results = []
count = 0
limit_per_sub = 150 # Roughly enough to get 2000 total from 14 subreddits

for sub_name in subreddits:
    if count >= 2000:
        break
    try:
        print(f"Starting to scrape r/{sub_name}...")
        subreddit = reddit.subreddit(sub_name)
        now = __import__('time').time()
        
        fetched_for_sub = 0
        for submission in subreddit.top(time_filter="year", limit=None):
            if count >= 2000:
                break
            if fetched_for_sub >= limit_per_sub:
                break
                
            # Check if within 180 days
            if submission.created_utc < now - (180 * 24 * 60 * 60):
                continue
            
            # Fetch top 20 comments
            submission.comment_sort = 'top'
            submission.comments.replace_more(limit=0)
            
            comments = []
            for comment in submission.comments[:20]:
                comments.append({
                    "author": str(comment.author),
                    "body": comment.body,
                    "score": comment.score
                })
            
            results.append({
                "id": submission.id,
                "title": submission.title,
                "selftext": submission.selftext,
                "score": submission.score,
                "subreddit": sub_name,
                "url": submission.url,
                "comments": comments
            })
            count += 1
            fetched_for_sub += 1
            if count % 100 == 0:
                print(f"Scraped {count} threads...")
    except Exception as e:
        print(f"Error scraping {sub_name}: {e}")

output_file = "/Users/jackmaguire/Developer/jackmaguire-site/research/reddit_2000_threads.json"
os.makedirs(os.path.dirname(output_file), exist_ok=True)
with open(output_file, 'w') as f:
    json.dump(results, f, indent=2)

print(f"Done. Scraped {count} threads to {output_file}")
