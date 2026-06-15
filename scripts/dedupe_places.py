import json
from collections import defaultdict

def main():
    path = '/Users/jackmaguire/Developer/jackmaguire-site/src/data/underrated_places.json'
    with open(path, 'r', encoding='utf-8') as f:
        places = json.load(f)
        
    print(f"Original count: {len(places)}")
    
    unique_places = []
    seen = set()
    
    # We can deduplicate based on Maps Link and/or Name + Address
    # Sometimes Name is slightly different. Maps link is usually unique per place.
    
    for place in places:
        # normalize maps link (strip parameters like ?cid= if we want to be aggressive, but usually the same place has the exact same maps link in the dataset)
        maps_link = place['maps_link']
        name = place['name'].lower().strip()
        address = place['address'].lower().strip()
        
        # Combine name and address as a fallback identity, but maps_link is a strong identity
        identity = maps_link
        
        if identity not in seen:
            seen.add(identity)
            unique_places.append(place)
            
    print(f"Count after deduplicating by Maps Link: {len(unique_places)}")
    
    # Let's do a secondary dedupe by Name and Address just in case maps link differs
    final_places = []
    seen2 = set()
    for place in unique_places:
        name_address = (place['name'].lower().strip(), place['address'].lower().strip())
        if name_address not in seen2:
            seen2.add(name_address)
            final_places.append(place)
            
    print(f"Count after deduplicating by Name+Address: {len(final_places)}")

    # Let's do a tertiary dedupe just by Name! Sometimes address is formatted differently
    # But wait, different locations of same chain? Chain restaurants aren't underrated, but if there are multiple, maybe keep one?
    # Let's see how many dupes are removed by Name only.
    name_seen = set()
    super_final = []
    for place in final_places:
        name = place['name'].lower().strip()
        if name not in name_seen:
            name_seen.add(name)
            super_final.append(place)
            
    print(f"Count after deduplicating strictly by Name: {len(super_final)}")
    
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(super_final, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    main()
