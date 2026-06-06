import json
from bs4 import BeautifulSoup
import re

with open('/Users/jackmaguire/Downloads/dataset_linkedin-jobs-scraper_2026-06-02_22-23-22-287.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

headers = [th.text.strip() for th in soup.find_all('th')]
jobs = []
for tr in soup.find_all('tr')[1:]:
    tds = tr.find_all('td')
    if len(tds) == len(headers):
        job = {headers[i]: tds[i].text.strip() for i in range(len(headers))}
        jobs.append(job)

with open('/Users/jackmaguire/Downloads/jobs_parsed.json', 'w', encoding='utf-8') as f:
    json.dump(jobs, f, indent=2)

print(f"Extracted {len(jobs)} jobs.")
