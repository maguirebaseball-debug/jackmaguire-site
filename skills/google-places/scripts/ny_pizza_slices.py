import os
import time
import csv
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")
BASE_URL = "https://maps.googleapis.com/maps/api/place"

def get_pizza_slices(query, lat, lng, radius=2000, max_results=100):
    results = []
    next_page_token = None
    
    while len(results) < max_results:
        params = {
            "query": query,
            "location": f"{lat},{lng}",
            "radius": radius,
            "key": API_KEY
        }
        if next_page_token:
            params["pagetoken"] = next_page_token
            time.sleep(2)
        
        response = requests.get(f"{BASE_URL}/textsearch/json", params=params)
        
        if response.status_code == 429:
            retry_after = int(response.headers.get("Retry-After", 60))
            print(f"Rate limit reached. Sleeping for {retry_after} seconds...")
            time.sleep(retry_after)
            continue
            
        data = response.json()
        
        if data.get("status") == "OK":
            for result in data.get("results", []):
                rating = result.get("rating", 0)
                reviews = result.get("user_ratings_total", 0)
                
                if rating >= 4.9 and 30 <= reviews <= 200:
                    results.append(result)
                
                if len(results) >= max_results:
                    break
            
            next_page_token = data.get("next_page_token")
            if not next_page_token:
                break
        elif data.get("status") == "OVER_QUERY_LIMIT":
             print("Rate limit reached (OVER_QUERY_LIMIT). Sleeping for 60 seconds...")
             time.sleep(60)
        else:
            print(f"Error fetching places at {lat},{lng}: {data.get('status')} - {data.get('error_message', '')}")
            break
            
    return results

def main():
    query = "traditional New York style pizza by the slice"
    print(f"Starting grid search for: {query}")
    
    # NYC rough bounding box (Manhattan/Brooklyn focus)
    lat_start = 40.58
    lat_end = 40.85
    lng_start = -74.05
    lng_end = -73.85
    step = 0.05
    
    all_shops = {}
    
    lat = lat_start
    while lat <= lat_end:
        lng = lng_start
        while lng <= lng_end:
            print(f"Searching grid point: {lat:.3f}, {lng:.3f}")
            shops = get_pizza_slices(query, lat, lng)
            for shop in shops:
                all_shops[shop["place_id"]] = shop
            lng += step
        lat += step
    
    csv_file = "ny_pizza_slices.csv"
    with open(csv_file, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "formatted_address", "rating", "user_ratings_total"])
        writer.writeheader()
        for shop in all_shops.values():
            writer.writerow({
                "name": shop.get("name"),
                "formatted_address": shop.get("formatted_address"),
                "rating": shop.get("rating"),
                "user_ratings_total": shop.get("user_ratings_total")
            })
    
    print(f"Saved {len(all_shops)} unique slice shops to {csv_file}")

if __name__ == "__main__":
    main()
