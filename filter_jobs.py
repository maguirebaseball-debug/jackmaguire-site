import json
import re

with open('/Users/jackmaguire/Downloads/jobs_parsed.json', 'r', encoding='utf-8') as f:
    jobs = json.load(f)

# Gate 2: Paid social keywords
paid_social_keywords = [
    r'paid social', r'social ads', r'facebook ads', r'instagram ads',
    r'meta ads', r'tiktok ads', r'snapchat ads', r'pinterest ads',
    r'linkedin ads', r'reddit ads'
]
pattern = re.compile('|'.join(paid_social_keywords), re.IGNORECASE)

filtered_jobs = []
for job in jobs:
    desc = job.get('descriptionText', '')
    if pattern.search(desc):
        filtered_jobs.append(job)

print(f"Jobs remaining after Gate 2 keyword filter: {len(filtered_jobs)}")

# Print titles and companies of remaining jobs
for i, job in enumerate(filtered_jobs):
    print(f"{i+1}. {job.get('title')} at {job.get('companyName')}")

