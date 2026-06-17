import sqlite3
import json
import sys
import argparse

DB_PATH = "/Users/jackmaguire/Developer/jackmaguire-distribution/notion.db"

def search_pages(query):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Search within the JSON properties field for titles
    cursor.execute("SELECT id, properties FROM pages WHERE properties LIKE ?", (f'%{query}%',))
    results = []
    for row in cursor.fetchall():
        page_id = row[0]
        props = json.loads(row[1])
        title = "Untitled"
        # Extract title from Notion property structure
        for p in props.values():
            if p.get('type') == 'title':
                title_bits = p.get('title', [])
                if title_bits:
                    title = "".join([t.get('plain_text', '') for t in title_bits])
        results.append({"id": page_id, "title": title})
    conn.close()
    return results

def get_page_content(page_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Get the page title first
    cursor.execute("SELECT properties FROM pages WHERE id = ?", (page_id,))
    page_row = cursor.fetchone()
    title = "Unknown Page"
    if page_row:
        props = json.loads(page_row[0])
        for p in props.values():
            if p.get('type') == 'title':
                title_bits = p.get('title', [])
                if title_bits:
                    title = "".join([t.get('plain_text', '') for t in title_bits])

    # Get all blocks for this page
    cursor.execute("SELECT block_type, type_data FROM blocks WHERE parent_id = ? ORDER BY child_index", (page_id,))
    content = [f"# {title}\n"]
    for row in cursor.fetchall():
        b_type = row[0]
        data = json.loads(row[1])
        
        # Simple extraction for common block types
        if b_type in data:
            block_content = data[b_type]
            if 'rich_text' in block_content:
                text = "".join([t.get('plain_text', '') for t in block_content['rich_text']])
                if b_type == 'heading_1': content.append(f"# {text}")
                elif b_type == 'heading_2': content.append(f"## {text}")
                elif b_type == 'heading_3': content.append(f"### {text}")
                elif b_type == 'bulleted_list_item': content.append(f"* {text}")
                elif b_type == 'numbered_list_item': content.append(f"1. {text}")
                elif b_type == 'to_do':
                    check = "[x]" if block_content.get('checked') else "[ ]"
                    content.append(f"{check} {text}")
                else: content.append(text)
            elif b_type == 'child_page':
                content.append(f"[Child Page: {block_content.get('title', 'Untitled')}]")
    
    conn.close()
    return "\n".join(content)

def full_text_search(query):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Search within type_data JSON for text
    cursor.execute("""
        SELECT parent_id, block_type, type_data 
        FROM blocks 
        WHERE type_data LIKE ? 
        LIMIT 50
    """, (f'%{query}%',))
    
    matches = []
    for row in cursor.fetchall():
        parent_id = row[0]
        b_type = row[1]
        data = json.loads(row[2])
        text = ""
        if b_type in data and 'rich_text' in data[b_type]:
            text = "".join([t.get('plain_text', '') for t in data[b_type]['rich_text']])
        
        if text:
            matches.append({"page_id": parent_id, "text": text})
    
    conn.close()
    return matches

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(dest="command")
    
    s_page = subparsers.add_parser("search-pages")
    s_page.add_argument("query")
    
    g_content = subparsers.add_parser("get-page")
    g_content.add_argument("id")
    
    fts = subparsers.add_parser("search-text")
    fts.add_argument("query")
    
    args = parser.parse_args()
    
    if args.command == "search-pages":
        print(json.dumps(search_pages(args.query), indent=2))
    elif args.command == "get-page":
        print(get_page_content(args.id))
    elif args.command == "search-text":
        print(json.dumps(full_text_search(args.query), indent=2))
