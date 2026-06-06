import json

with open('/Users/jackmaguire/Downloads/jobs_parsed.json', 'r', encoding='utf-8') as f:
    jobs = json.load(f)

minimal_jobs = []
for job in jobs:
    minimal_jobs.append({
        "id": job.get("id"),
        "title": job.get("title"),
        "company": job.get("companyName"),
        "description": job.get("descriptionText", "")[:2000] # truncate description to save tokens
    })

with open('/Users/jackmaguire/Downloads/minimal_jobs.json', 'w', encoding='utf-8') as f:
    json.dump(minimal_jobs, f, indent=2)

