---
name: google-places
description: Gather structured Google Places data (search results, details, ratings, reviews) for neighborhood or specific query. Use when structured restaurant data, review count filtering (<500), or sentiment analysis is needed.
---

# Google Places Skill

Use this skill to gather structured Google Places data without relying on the browser. This workflow is code-driven, ensuring filters and sentiment scoring stay reproducible.

## Workflows

### 1. Collect Places with Sentiment
Run `python3 scripts/collect_places.py` to:
- Page through Text Search responses (up to 50 unique places).
- Skip any place with >500 total reviews.
- Request Detail fields (name, rating, user_ratings_total, reviews, formatted_address, business_status).
- Compute sentiment using VADER on up to five review snippets.
- Write results to `vegetarian_sentiment.csv`.

### 2. Find NYC Hidden Gems
Run `python3 scripts/nyc_5star_restaurants.py` to:
- Find NYC restaurants with exactly 5.0 stars and between 25-99 reviews.
- Write results to `nyc_5star_gems.csv`.

## Configuration
- Ensure `GOOGLE_PLACES_API_KEY` is set in the `.env` file within the skill directory.
- The scripts use the `dotenv` package to load this key automatically.

## Requirements
- `requests`
- `vaderSentiment`
- `python-dotenv`

## When to use
- Extracting restaurant lists from Google Maps with specific review count ceilings.
- Performing sentiment analysis on Google Reviews.
- Generating CSV datasets for restaurant research.

## Reddit Markdown Guide
When generating content specifically for Reddit (comments, posts), adhere to these formatting rules:
- **Italics**: `*text*`
- **Bold**: `**text**`
- **Links**: `[Link Text](https://url.com)`
- **Bullet Lists**: `* item` (must have a space after `*`)
- **Quotes**: `> quote`
- **Code Blocks**: Four spaces at the beginning of each line
- **Strikethrough**: `~~text~~`
- **Superscript**: `text^superscript`
