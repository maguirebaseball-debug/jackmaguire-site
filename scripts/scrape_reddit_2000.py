import os
import praw
from dotenv import load_dotenv
import json
import time

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

subreddits_to_scrape = ["technology", "finance", "dataengineering", "AskSocialScience", "Futurology"]
threads_per_sub = 400

out_dir = "/Users/jackmaguire/CLIStore/RedditResearch"
os.makedirs(out_dir, exist_ok=True)
out_file = os.path.join(out_dir, "reddit_2000_threads.jsonl")

count = 0
with open(out_file, "w") as f:
    for sub_name in subreddits_to_scrape:
        print(f"Scraping r/{sub_name}...")
        try:
            subreddit = reddit.subreddit(sub_name)
            # getting top threads from past 6 months (180 days)
            for submission in subreddit.top(time_filter="year", limit=threads_per_sub):
                submission.comments.replace_more(limit=0)
                top_comments = []
                for idx, comment in enumerate(submission.comments):
                    if idx >= 20:
                        break
                    top_comments.append({
                        "score": comment.score,
                        "body": comment.body
                    })
                
                thread_data = {
                    "subreddit": sub_name,
                    "title": submission.title,
                    "selftext": submission.selftext,
                    "score": submission.score,
                    "url": submission.url,
                    "top_comments": top_comments
                }
                f.write(json.dumps(thread_data) + "\n")
                count += 1
                if count % 100 == 0:
                    print(f"Scraped {count} threads...")
                time.sleep(0.5) # respect rate limits somewhat
        except Exception as e:
            print(f"Error scraping {sub_name}: {e}")

print(f"Finished scraping {count} threads to {out_file}")
