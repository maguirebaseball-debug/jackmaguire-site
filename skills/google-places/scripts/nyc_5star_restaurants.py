import os
import time
import csv
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")
BASE_URL = "https://maps.googleapis.com/maps/api/place"

def get_5star_restaurants(query, max_results=20):
    results = []
    next_page_token = None
    
    while len(results) < max_results:
        params = {
            "query": query,
            "key": API_KEY
        }
        if next_page_token:
            params["pagetoken"] = next_page_token
            time.sleep(2)
        
        response = requests.get(f"{BASE_URL}/textsearch/json", params=params).json()
        
        if response.get("status") == "OK":
            for result in response.get("results", []):
                rating = result.get("rating", 0)
                reviews = result.get("user_ratings_total", 0)
                
                # Filter: exactly 5 stars and 25-99 reviews
                if rating == 5.0 and 25 <= reviews <= 99:
                    results.append(result)
                
                if len(results) >= max_results:
                    break
            
            next_page_token = response.get("next_page_token")
            if not next_page_token:
                break
        else:
            break
            
    return results

def main():
    query = "restaurants in New York City"
    print(f"Finding 5-star hidden gems in NYC...")
    gems = get_5star_restaurants(query)
    
    with open("nyc_5star_gems.csv", "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "formatted_address", "rating", "user_ratings_total"])
        writer.writeheader()
        for gem in gems:
            writer.writerow({
                "name": gem.get("name"),
                "formatted_address": gem.get("formatted_address"),
                "rating": gem.get("rating"),
                "user_ratings_total": gem.get("user_ratings_total")
            })
    
    print(f"Saved {len(gems)} hidden gems to nyc_5star_gems.csv")

if __name__ == "__main__":
    main()
