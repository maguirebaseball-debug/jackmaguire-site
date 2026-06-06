#!/usr/bin/env python3
"""
grounding_verifier.py

Citation grounding harness for the research pipeline.
Every idea submitted by the research agent MUST pass this verifier
before the filter agent is allowed to evaluate it.

Usage:
    python3 grounding_verifier.py --idea "Idea text" --citations '[{"thread_id":"abc","subreddit":"xyz","quote":"..."}]'

Exit codes:
    0 = PASS  (all citations verified in the JSON)
    1 = FAIL  (one or more citations not found — idea is REJECTED as hallucinated)
"""

import argparse
import json
import sys
import os

DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'research', 'reddit_2000_threads.json')


def load_data(path):
    with open(path, 'r') as f:
        return json.load(f)


def verify_citations(data, citations):
    """
    For each citation, verify:
    1. The thread_id (post id) exists in the dataset.
    2. The quoted text snippet (>=15 chars) appears verbatim in that thread's
       post body OR in one of its top comments.

    Returns a list of failure dicts (empty = all passed).
    """
    # Build a fast lookup: post_id -> thread dict
    index = {thread.get('id', ''): thread for thread in data}

    failures = []
    for i, cit in enumerate(citations):
        thread_id = cit.get('thread_id', '').strip()
        quote = cit.get('quote', '').strip()
        subreddit = cit.get('subreddit', '').strip()

        # --- Check 1: thread ID must exist ---
        if thread_id not in index:
            # Fallback: search by title substring if ID not provided
            if not thread_id:
                failures.append({
                    'citation_index': i,
                    'reason': 'No thread_id provided — citation is unverifiable.',
                    'citation': cit
                })
                continue
            else:
                failures.append({
                    'citation_index': i,
                    'reason': f'thread_id "{thread_id}" not found in dataset.',
                    'citation': cit
                })
                continue

        thread = index[thread_id]

        # --- Check 2: subreddit must match ---
        if subreddit and thread.get('subreddit', '').lower() != subreddit.lower():
            failures.append({
                'citation_index': i,
                'reason': f'Subreddit mismatch: expected "{subreddit}", found "{thread.get("subreddit")}".',
                'citation': cit
            })
            continue

        # --- Check 3: quote must appear verbatim in the thread ---
        if len(quote) < 15:
            failures.append({
                'citation_index': i,
                'reason': f'Quote too short (<15 chars) to be meaningful: "{quote}"',
                'citation': cit
            })
            continue

        # Search post body + all comments
        blob = (thread.get('selftext', '') or '') + ' '
        blob += thread.get('title', '') + ' '
        for comment in thread.get('comments', []):
            blob += (comment.get('body', '') or '') + ' '

        if quote.lower() not in blob.lower():
            failures.append({
                'citation_index': i,
                'reason': f'Quote not found verbatim in thread {thread_id}.',
                'citation': cit
            })

    return failures


def main():
    parser = argparse.ArgumentParser(description='Verify research agent citations against the raw Reddit dataset.')
    parser.add_argument('--idea', required=True, help='The idea text being proposed.')
    parser.add_argument('--citations', required=True, help='JSON array of citation objects.')
    args = parser.parse_args()

    try:
        citations = json.loads(args.citations)
    except json.JSONDecodeError as e:
        print(f'FAIL: Could not parse citations JSON: {e}', file=sys.stderr)
        sys.exit(1)

    if not isinstance(citations, list) or len(citations) == 0:
        print('FAIL: Citations must be a non-empty JSON array.', file=sys.stderr)
        sys.exit(1)

    print(f'Loading dataset from {DATA_FILE}...')
    data = load_data(DATA_FILE)
    print(f'Loaded {len(data)} threads.')

    failures = verify_citations(data, citations)

    if failures:
        print(f'\n❌ GROUNDING VERIFICATION FAILED for idea: "{args.idea[:80]}..."')
        print(f'{len(failures)} citation(s) could not be verified:\n')
        for f in failures:
            print(f'  Citation #{f["citation_index"]}: {f["reason"]}')
            print(f'  Details: {json.dumps(f["citation"], indent=4)}\n')
        print('→ This idea is REJECTED. It may be hallucinated or extrapolated.')
        sys.exit(1)
    else:
        print(f'\n✅ GROUNDING VERIFICATION PASSED for idea: "{args.idea[:80]}..."')
        print(f'All {len(citations)} citation(s) verified against the raw dataset.')
        sys.exit(0)


if __name__ == '__main__':
    main()
