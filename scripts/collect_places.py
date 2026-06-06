import os
import json
import requests
from dotenv import load_dotenv

env_paths = [
    "/Users/jackmaguire/CLIStore/.env",
    "/Users/jackmaguire/.gemini/antigravity/scratch/.env"
]
for p in env_paths:
    if os.path.exists(p):
        load_dotenv(p)

api_key = os.getenv("GOOGLE_PLACES_API_KEY")
if not api_key:
    print("WARNING: GOOGLE_PLACES_API_KEY not found. Places search will fail.")

def fetch_places(query):
    url = "https://places.googleapis.com/v1/places:searchText"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": "places.displayName.text,places.rating,places.userRatingCount,places.formattedAddress,places.businessStatus"
    }
    data = {
        "textQuery": query,
        "locationBias": {
            "circle": {
                "center": {
                    "latitude": 40.7264,  # East Village roughly
                    "longitude": -73.9818
                },
                "radius": 5000.0
            }
        }
    }
    
    print(f"Fetching Places for query: {query}", flush=True)
    response = requests.post(url, headers=headers, json=data)
    if response.status_code != 200:
        print(f"Error: {response.status_code} - {response.text}")
        return []
        
    places = response.json().get("places", [])
    filtered = []
    for p in places:
        rating = p.get("rating", 0)
        reviews = p.get("userRatingCount", 0)
        if rating >= 4.7 and 30 <= reviews <= 400:
            filtered.append(p)
            
    return filtered

if __name__ == "__main__":
    queries = [
        "cheap eats east village",
        "coffee shops downtown manhattan",
        "parks and recreation downtown manhattan",
        "networking lunch spots new york"
    ]
    
    all_places = {}
    for q in queries:
        all_places[q] = fetch_places(q)
        
    out_path = "/Users/jackmaguire/Developer/jackmaguire-site/scripts/places_data.json"
    with open(out_path, "w") as f:
        json.dump(all_places, f, indent=2)
        
    print(f"Saved places data to {out_path}", flush=True)
