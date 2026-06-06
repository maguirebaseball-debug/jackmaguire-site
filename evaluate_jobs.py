import json
import re

def is_agency(desc, company):
    desc = desc.lower()
    comp = company.lower()
    
    agency_patterns = [
        r'\bagenc(?:y|ies)\b', r'\bclient portfolio\b', r'\bmanage multiple clients\b',
        r'\bholding company\b', r'\bclient-facing\b', r'\bexternal clients\b',
        r'\bclient communication\b', r'\bclient relationships\b', r'\bclient accounts\b',
        r'\bpartner with.*brands\b', r'\bclient-service\b', r'\bbpo\b', r'\bstaffing\b',
        r'\bconsulting firm\b', r'\bsupporting.*brands\b'
    ]
    
    if 'infosys' in comp or 'confidential' in comp or 'ltvplus' in comp or 'idr, inc' in comp or 'jump 450' in comp:
        return True
        
    for p in agency_patterns:
        if re.search(p, desc) and not re.search(r'\bagency management\b|\bmanage our agency\b|\bagency partner\b', desc):
            return True
            
    return False

def main():
    with open('/Users/jackmaguire/Downloads/minimal_jobs.json', 'r') as f:
        jobs = json.load(f)

    results = []
    failed = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0}
    passed_count = 0

    for job in jobs:
        desc = job.get('description', '').lower()
        title = job.get('title', '').lower()
        company = job.get('company', '')
        
        # Gate 1: Agency
        if is_agency(desc, company):
            failed[1] += 1
            continue

        # Gate 2: Paid social advertising explicit
        ps_patterns = [
            r'paid social', r'social ads', r'facebook ads', r'instagram ads',
            r'meta ads', r'tiktok ads', r'snapchat ads', r'pinterest ads',
            r'linkedin ads', r'reddit ads'
        ]
        if not any(p in desc for p in ps_patterns):
            failed[2] += 1
            continue

        # Gate 3: Technical bar
        tech_patterns = [r'\badvanced sql\b', r'\bdata science\b', r'\bdata engineering\b']
        if any(re.search(p, desc) for p in tech_patterns):
            failed[3] += 1
            continue

        # Gate 4: Channel mismatch
        channel_fail = False
        if re.search(r'programmatic|google ads|search manager|seo|affiliate|mobile app', title) and not 'social' in title:
            channel_fail = True
        if re.search(r'appsflyer|adjust|singular|skadnetwork', desc) and 'app install' in desc:
            channel_fail = True
        if channel_fail:
            failed[4] += 1
            continue

        # Gate 5: Global outside NA
        if 'global' in title and not re.search(r'na\b|north america', desc):
            failed[5] += 1
            continue

        # Gate 6: B2B enterprise software
        if (re.search(r'\bb2b\b|\benterprise software\b|\bsaas\b', desc) and 
            not re.search(r'\bconsumer\b|\bdtc\b|\bfranchise\b|\be-commerce\b|\bretail\b', desc)):
            failed[6] += 1
            continue
            
        passed_count += 1

        # SCORING
        score = 0
        
        # 1. Paid social channel fit (x3)
        cat1 = 1
        if 'meta' in title or 'social' in title or 'tiktok' in title:
            cat1 = 3
        elif len([p for p in ps_patterns if p in desc]) >= 2:
            cat1 = 2
        
        # 2. Seniority & leadership (x3)
        cat2 = 0
        if re.search(r'director|head of|lead|manager', title):
            cat2 = 2
            if re.search(r'direct report|manage a team|leadership|player-coach', desc):
                cat2 = 3
        
        # 3. Measurement & analytics (x2)
        cat3 = 1
        if re.search(r'attribution|mmm|ltv|dashboard|pixel|capi|marketing mix', desc):
            cat3 = 2
            if re.search(r'measurement', desc) or re.search(r'incrementality', desc):
                cat3 = 3

        # 4. Strategy ownership (x2)
        cat4 = 1
        if re.search(r'budget|strategy|roadmap|profitability', desc):
            cat4 = 2
            if re.search(r'p&l|own the budget|manage millions', desc):
                cat4 = 3
        if re.search(r'execution-only', desc):
            cat4 = 0

        # 5. Industry adjacency (x2)
        cat5 = 0
        if re.search(r'financial|healthcare|retail|ecomm|dtc|franchise|sports|crypto|digital asset', desc):
            cat5 = 2
            if re.search(r'financial services|debt|credit', desc):
                cat5 = 3
                
        # 6. AI-forward (x1)
        cat6 = 0
        if re.search(r'\bai\b|artificial intelligence|chatgpt|claude|automation', desc):
            cat6 = 2
            if re.search(r'ai fluency', desc):
                cat6 = 3

        # 7. Brand-side depth (x1)
        cat7 = 2
        if 'in-house' in desc or 'our brand' in desc:
            cat7 = 3

        # 8. Comp & level (x1)
        cat8 = 1
        if 'director' in title:
            cat8 = 3

        total = (cat1 * 3) + (cat2 * 3) + (cat3 * 2) + (cat4 * 2) + (cat5 * 2) + (cat6 * 1) + (cat7 * 1) + (cat8 * 1)
        
        # Override rule: Any x3 category scoring 0 caps at STRETCH (max 27)
        if cat1 == 0 or cat2 == 0:
            if total > 27:
                total = 27

        verdict = "PASS"
        if total >= 36:
            verdict = "APPLY NOW"
        elif total >= 28:
            verdict = "APPLY"
        elif total >= 20:
            verdict = "STRETCH"
            
        if total >= 20:
            # Generate Rationale
            rationale_parts = []
            if cat1 == 3: rationale_parts.append("strong paid social spine")
            if cat2 >= 2: rationale_parts.append("hits seniority target")
            if cat5 >= 2: rationale_parts.append("aligned with prior industry domains")
            if cat7 == 3: rationale_parts.append("in-house brand ownership")
            rationale = "Solid match: " + ", ".join(rationale_parts)
            
            results.append({
                'title': job.get('title'),
                'company': job.get('company'),
                'score': total,
                'verdict': verdict,
                'rationale': rationale
            })

    # Sort results by score descending
    results.sort(key=lambda x: x['score'], reverse=True)
    
    print(f"Total evaluated: {len(jobs)}")
    print(f"Gates failed: Gate 1: {failed[1]}, Gate 2: {failed[2]}, Gate 3: {failed[3]}, Gate 4: {failed[4]}, Gate 5: {failed[5]}, Gate 6: {failed[6]}")
    print(f"Total passing gates: {passed_count}")
    print("---")
    
    for r in results:
        print(f"1. [{r['score']}] [{r['verdict']}] {r['title']} at {r['company']} - {r['rationale']}")

if __name__ == '__main__':
    main()
