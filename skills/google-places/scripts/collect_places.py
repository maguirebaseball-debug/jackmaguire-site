import os
import time
import csv
import requests
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")
BASE_URL = "https://maps.googleapis.com/maps/api/place"

def get_places(query, max_results=50):
    places = []
    next_page_token = None
    
    while len(places) < max_results:
        params = {
            "query": query,
            "key": API_KEY
        }
        if next_page_token:
            params["pagetoken"] = next_page_token
            # Google requires a short delay before the token becomes active
            time.sleep(2)
        
        response = requests.get(f"{BASE_URL}/textsearch/json", params=params).json()
        
        if response.get("status") == "OK":
            for result in response.get("results", []):
                # Apply filter: skip if > 500 reviews
                review_count = result.get("user_ratings_total", 0)
                if review_count <= 500:
                    places.append(result)
                
                if len(places) >= max_results:
                    break
            
            next_page_token = response.get("next_page_token")
            if not next_page_token:
                break
        elif response.get("status") == "OVER_QUERY_LIMIT":
            print("Rate limit reached. Sleeping...")
            time.sleep(60)
        else:
            print(f"Error fetching places: {response.get('status')} - {response.get('error_message', '')}")
            break
            
    return places

def get_place_details(place_id):
    params = {
        "place_id": place_id,
        "fields": "name,rating,user_ratings_total,reviews,formatted_address,business_status",
        "key": API_KEY
    }
    response = requests.get(f"{BASE_URL}/details/json", params=params).json()
    if response.get("status") == "OK":
        return response.get("result")
    return None

def analyze_sentiment(reviews):
    analyzer = SentimentIntensityAnalyzer()
    scores = []
    for review in reviews[:5]: # up to five review snippets
        text = review.get("text", "")
        if text:
            vs = analyzer.polarity_scores(text)
            scores.append(vs["compound"])
    
    if not scores:
        return 0
    return sum(scores) / len(scores)

def main():
    queries = ["vegetarian restaurants East Village NYC", "vegan friendly cafes NYC"]
    all_results = []
    seen_ids = set()
    analyzer = SentimentIntensityAnalyzer()

    for query in queries:
        print(f"Searching for: {query}")
        places = get_places(query)
        for place in places:
            place_id = place["place_id"]
            if place_id in seen_ids:
                continue
            seen_ids.add(place_id)
            
            details = get_place_details(place_id)
            if details:
                sentiment = analyze_sentiment(details.get("reviews", []))
                details["avg_sentiment"] = sentiment
                all_results.append(details)
                print(f"Processed: {details.get('name')} (Sentiment: {sentiment:.2f})")

    # Write to CSV
    with open("vegetarian_sentiment.csv", "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "formatted_address", "rating", "user_ratings_total", "avg_sentiment", "business_status"])
        writer.writeheader()
        for res in all_results:
            writer.writerow({
                "name": res.get("name"),
                "formatted_address": res.get("formatted_address"),
                "rating": res.get("rating"),
                "user_ratings_total": res.get("user_ratings_total"),
                "avg_sentiment": f"{res.get('avg_sentiment'):.2f}",
                "business_status": res.get("business_status")
            })
    print(f"Saved {len(all_results)} results to vegetarian_sentiment.csv")

if __name__ == "__main__":
    main()
