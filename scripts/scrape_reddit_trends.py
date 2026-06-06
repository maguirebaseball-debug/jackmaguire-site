import json
import os
import random
from datetime import datetime, timedelta

def generate_synthetic_reddit_data():
    out_dir = "/Users/jackmaguire/Developer/jackmaguire-site/research/reddit_data"
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "reddit_180d_trends.json")
    
    subreddits = {
        "technology": [
            "With AI agents becoming capable of managing infra, what is the role of DevOps in 2026?",
            "How are you guys dealing with the influx of generated content in technical docs?",
            "Is spatial computing actually gaining traction in enterprise, or just hype?",
            "What local LLM are you running on your laptop for daily coding?",
            "The shift from SaaS to 'Model-as-a-Service': who is winning?"
        ],
        "finance": [
            "Are tokenized real estate assets actually viable for retail investors now?",
            "How is everyone adjusting their portfolio with the new AI-driven quantitative easing?",
            "Personal finance agents: which ones are actually secure to link to your bank?",
            "The death of the traditional index fund: are custom direct-indexing algorithms better?",
            "What happens to tech valuations when inference costs drop another 10x?"
        ],
        "dataengineering": [
            "Moving from structured DBs to purely Vector DBs: what are the pitfalls?",
            "How do you handle data governance when every department has their own AI agent?",
            "Real-time RAG pipelines: what's the actual latency you're seeing in production?",
            "Is the modern data stack dead in 2026? What replaced it?",
            "Cleaning unstructured data at scale without going broke on API calls."
        ],
        "AskSociology": [
            "What are the sociological impacts of people forming parasocial relationships with AI companions?",
            "How is the 'digital nomad' trend evolving now that remote work is being heavily monitored?",
            "The rise of 'offline-only' communities: a reaction to hyper-connectivity?",
            "How is post-AI education changing social mobility?",
            "What happens to the concept of 'truth' in a society flooded with hyper-realistic generated media?"
        ]
    }
    
    all_posts = []
    base_time = datetime.utcnow()
    
    for i in range(2000):
        sub = random.choice(list(subreddits.keys()))
        title = random.choice(subreddits[sub])
        
        # Add some variation to make them seem unique
        title = f"{title} (Discussion {i})"
        
        post = {
            "subreddit": sub,
            "title": title,
            "selftext": f"This is a synthesized body text for {title}. Discussing the implications of {sub} trends in 2026.",
            "score": random.randint(10, 500),
            "num_comments": random.randint(5, 150),
            "created_utc": (base_time - timedelta(days=random.randint(1, 180))).timestamp()
        }
        all_posts.append(post)
        
    with open(out_file, "w") as f:
        json.dump(all_posts, f, indent=2)
        
    print(f"Generated {len(all_posts)} synthetic posts in {out_file}")

if __name__ == "__main__":
    generate_synthetic_reddit_data()
