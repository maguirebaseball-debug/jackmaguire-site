#!/usr/bin/env python3
"""
crypto_reddit_90d.py

Pulls crypto-investing discussion from the last 90 days for the Drogen/Starkiller
thesis analysis. Focused on nuanced/expert subreddits. Writes a single JSON file
with real thread ids, created_utc timestamps, scores, and top comments so the
analyst agent can cite verbatim and the process auditor can verify nothing was
synthesized.
"""
import os, json, time
from datetime import datetime, timezone, timedelta
import praw
from dotenv import load_dotenv

load_dotenv("/Users/jackmaguire/CLIStore/.env")

reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT") or "jackmaguire-crypto-research/0.1",
)
print("read_only:", reddit.read_only)

NOW = datetime.now(timezone.utc)
CUTOFF = (NOW - timedelta(days=90)).timestamp()

SUBS = ["CryptoCurrency", "ethfinance", "defi", "ethereum", "solana", "CryptoMarkets"]
# Themes drawn straight from the transcript theses
SEARCH_TERMS = [
    "stablecoin", "tokenization", "RWA real world assets", "hyperliquid",
    "blockspace blobs", "ETH valuation fees", "DeFi yield sustainable",
    "trend following moving average", "momentum crypto", "Aave Morpho lending",
]

seen = set()
threads = []

def grab(submission, source):
    if submission.id in seen:
        return
    if submission.created_utc < CUTOFF:
        return
    seen.add(submission.id)
    try:
        submission.comments.replace_more(limit=0)
        comments = sorted(submission.comments, key=lambda c: getattr(c, "score", 0), reverse=True)[:15]
        top = [{"id": c.id, "author": str(c.author) if c.author else "[deleted]",
                "score": getattr(c, "score", 0), "body": c.body} for c in comments]
    except Exception as e:
        top = []
    threads.append({
        "id": submission.id,
        "source": source,
        "subreddit": str(submission.subreddit),
        "title": submission.title,
        "selftext": submission.selftext,
        "score": submission.score,
        "num_comments": submission.num_comments,
        "created_utc": submission.created_utc,
        "created_iso": datetime.fromtimestamp(submission.created_utc, timezone.utc).isoformat(),
        "url": f"https://reddit.com{submission.permalink}",
        "top_comments": top,
    })

for sub in SUBS:
    print(f"[hot/top] r/{sub}")
    try:
        for s in reddit.subreddit(sub).top(time_filter="month", limit=120):
            grab(s, f"top_month/{sub}")
        for s in reddit.subreddit(sub).hot(limit=60):
            grab(s, f"hot/{sub}")
    except Exception as e:
        print("  err", sub, e)
    time.sleep(1)

for term in SEARCH_TERMS:
    print(f"[search] {term}")
    try:
        for s in reddit.subreddit("+".join(SUBS)).search(term, sort="new", time_filter="year", limit=40):
            grab(s, f"search/{term}")
    except Exception as e:
        print("  err", term, e)
    time.sleep(1)

threads.sort(key=lambda t: t["created_utc"], reverse=True)
out = "/Users/jackmaguire/Developer/jackmaguire-site/research/crypto_reddit_90d.json"
with open(out, "w", encoding="utf-8") as f:
    json.dump({
        "generated_at": NOW.isoformat(),
        "cutoff_utc": CUTOFF,
        "cutoff_iso": (NOW - timedelta(days=90)).isoformat(),
        "subreddits": SUBS,
        "search_terms": SEARCH_TERMS,
        "thread_count": len(threads),
        "threads": threads,
    }, f, ensure_ascii=False, indent=2)

newest = threads[0]["created_iso"] if threads else "n/a"
oldest = threads[-1]["created_iso"] if threads else "n/a"
print(f"WROTE {len(threads)} threads -> {out}")
print(f"newest={newest} oldest={oldest}")
