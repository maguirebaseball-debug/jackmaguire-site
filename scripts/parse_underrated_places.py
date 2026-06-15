import os
import re
import json
import time
import requests
from dotenv import load_dotenv

def load_openrouter_key():
    env_path = os.path.expanduser('~/.codex/.env')
    if os.path.exists(env_path):
        load_dotenv(env_path, override=False)
    api_key = os.environ.get('OPENROUTER_API_KEY')
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY not found in environment.")
    return api_key

def parse_markdown(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = re.compile(
        r'## \d+\.\s+(.*?)\n'
        r'- \*\*Rating\*\*: ([\d.]+) ⭐\n'
        r'- \*\*Reviews\*\*: ([\d,]+)\n'
        r'- \*\*Address\*\*: (.*?)\n'
        r'- \*\*Google Maps\*\*: \[.*?\]\((.*?)\)\n\n'
        r'\*\*Reddit Citation:\*\*\n'
        r'> \*(.*?)\*\s*\n'
        r'> — (.*?)(?:\n|$)',
        re.DOTALL | re.IGNORECASE
    )
    
    places = []
    for match in pattern.finditer(content):
        places.append({
            'name': match.group(1).strip(),
            'rating': float(match.group(2)),
            'reviews': int(match.group(3).replace(',', '')),
            'address': match.group(4).strip(),
            'maps_link': match.group(5).strip(),
            'reddit_quote': match.group(6).strip(),
            'reddit_thread': match.group(7).strip()
        })
        
    return places

def call_openrouter(prompt, api_key):
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "google/gemini-2.5-flash",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.1
    }
    
    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)
    if response.status_code == 200:
        return response.json()['choices'][0]['message']['content']
    else:
        raise Exception(f"OpenRouter API Error: {response.status_code} {response.text}")

def classify_places(places, api_key):
    # Process in batches of 50
    batch_size = 50
    results = []
    
    for i in range(0, len(places), batch_size):
        batch = places[i:i+batch_size]
        
        prompt = "You are a data classification assistant. I will provide a list of places in NYC with their name and address.\n"
        prompt += "For each place, identify its Category, Borough, and Neighborhood.\n"
        prompt += "Guidelines for Category: Keep categories broad (e.g. 'Restaurant', 'Bar', 'Cafe', 'Museum', 'Park', 'Retail', 'Entertainment', 'Bakery').\n"
        prompt += "Output MUST be a strictly valid JSON array of objects, with no markdown formatting. Example: [{\"id\": 0, \"category\": \"Restaurant\", \"borough\": \"Brooklyn\", \"neighborhood\": \"Astoria\"}, ...]\n\n"
        
        for idx, p in enumerate(batch):
            prompt += f"ID: {idx} | Name: {p['name']} | Address: {p['address']}\n"
            
        print(f"Processing batch {i//batch_size + 1} of {(len(places) - 1)//batch_size + 1}...")
        
        try:
            text = call_openrouter(prompt, api_key)
            
            json_str = text
            if "```json" in text:
                json_str = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                json_str = text.split("```")[1].split("```")[0].strip()
            
            classified = json.loads(json_str)
            
            for item in classified:
                idx = item.get('id')
                if idx is not None and 0 <= idx < len(batch):
                    batch[idx]['category'] = item.get('category', 'Other')
                    batch[idx]['borough'] = item.get('borough', 'Unknown')
                    batch[idx]['neighborhood'] = item.get('neighborhood', 'Unknown')
            
        except Exception as e:
            print(f"Error on batch {i//batch_size + 1}: {e}")
            for p in batch:
                p['category'] = 'Other'
                p['borough'] = 'Unknown'
                p['neighborhood'] = 'Unknown'
                
        results.extend(batch)
        
    return results

def consolidate_categories(places, api_key):
    from collections import Counter
    counts = Counter(p.get('category', 'Other') for p in places)
    print("Initial category counts:", counts)
    
    small_cats = [cat for cat, count in counts.items() if count < 7]
    if not small_cats:
        return places
        
    print(f"Categories to consolidate (count < 7): {small_cats}")
    large_cats = [cat for cat, count in counts.items() if count >= 7]
    
    if not large_cats:
        return places
        
    prompt = "I have a list of small categories that need to be mapped into my list of large categories.\n"
    prompt += f"Large Categories: {', '.join(large_cats)}\n"
    prompt += f"Small Categories to map: {', '.join(small_cats)}\n"
    prompt += "Map each small category to the single most appropriate large category. If none fit well, map to 'Other'.\n"
    prompt += "Output MUST be a strictly valid JSON dictionary: {\"Small Category\": \"Large Category\"}"
    
    try:
        text = call_openrouter(prompt, api_key)
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
            
        mapping = json.loads(text)
        print("Category Mapping:", mapping)
        
        for p in places:
            cat = p.get('category', 'Other')
            if cat in small_cats:
                p['category'] = mapping.get(cat, 'Other')
    except Exception as e:
        print(f"Error in consolidation: {e}")
        for p in places:
            if p.get('category') in small_cats:
                p['category'] = 'Other'
                
    final_counts = Counter(p.get('category', 'Other') for p in places)
    print("Final category counts:", final_counts)
    return places

def main():
    md_path = '/Users/jackmaguire/Developer/jackmaguire-site/underrated_places_2026.md'
    out_path = '/Users/jackmaguire/Developer/jackmaguire-site/src/data/underrated_places.json'
    
    print("Parsing markdown...")
    places = parse_markdown(md_path)
    print(f"Found {len(places)} places.")
    
    api_key = load_openrouter_key()
    print("Classifying places with OpenRouter...")
    classified_places = classify_places(places, api_key)
    
    print("Consolidating categories...")
    final_places = consolidate_categories(classified_places, api_key)
    
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(final_places, f, indent=2, ensure_ascii=False)
    print(f"Saved to {out_path}")

if __name__ == '__main__':
    main()
