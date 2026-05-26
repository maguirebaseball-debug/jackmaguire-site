import csv
import json
import re
import ssl
import time
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path


OUT_DIR = Path("research/market_limits")
OUT_DIR.mkdir(parents=True, exist_ok=True)

MAILTO = "maguirebaseball@gmail.com"
BASE = "https://api.openalex.org/works"
SSL_CONTEXT = ssl.create_default_context()
SSL_CONTEXT.check_hostname = False
SSL_CONTEXT.verify_mode = ssl.CERT_NONE

RUNS = [
    {
        "run": 1,
        "cluster": "capitalization and macro bounds",
        "query": "stock market capitalization GDP wealth ratio equity valuation upper bound",
    },
    {
        "run": 2,
        "cluster": "discount rates and present value",
        "query": "present value relation stock prices dividends discount rates long run returns",
    },
    {
        "run": 3,
        "cluster": "equity premium and required returns",
        "query": "equity premium puzzle bounds expected returns stock market valuation",
    },
    {
        "run": 4,
        "cluster": "rational bubbles and transversality",
        "query": "rational bubbles asset pricing transversality condition stock market",
    },
    {
        "run": 5,
        "cluster": "limits to arbitrage and market efficiency",
        "query": "limits to arbitrage noise trader risk market efficiency stock prices",
    },
    {
        "run": 6,
        "cluster": "intangible capital and monopoly rents",
        "query": "intangible capital monopoly rents markups market value corporations",
    },
    {
        "run": 7,
        "cluster": "safe assets, rates, and fiscal capacity",
        "query": "safe asset scarcity interest rates government debt equity valuation",
    },
    {
        "run": 8,
        "cluster": "index investing and passive ownership",
        "query": "index funds passive investing price discovery market concentration equity",
    },
    {
        "run": 9,
        "cluster": "international portfolio equilibrium",
        "query": "global portfolio choice home bias international equity market capitalization",
    },
    {
        "run": 10,
        "cluster": "legal, monetary, and institutional constraints",
        "query": "corporate law monetary policy asset prices financial stability equity markets",
    },
]

ALLOWED_TYPES = {
    "article",
    "book",
    "book-chapter",
    "dissertation",
    "preprint",
    "report",
}

STOP = {
    "about",
    "after",
    "analysis",
    "asset",
    "based",
    "between",
    "effect",
    "evidence",
    "financial",
    "market",
    "markets",
    "model",
    "paper",
    "prices",
    "pricing",
    "results",
    "return",
    "returns",
    "stock",
    "study",
    "using",
    "value",
    "with",
}


def clean_text(value):
    if value is None:
        return ""
    value = re.sub(r"[\u2013\u2014]", "-", str(value))
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def openalex_page(query, page, per_page=100):
    params = {
        "search": query,
        "filter": "from_publication_date:1900-01-01,type:article|book|book-chapter|dissertation|preprint|report",
        "per-page": per_page,
        "page": page,
        "mailto": MAILTO,
        "select": "id,doi,title,publication_year,type,authorships,primary_location,locations_count,cited_by_count,concepts,abstract_inverted_index",
    }
    url = BASE + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": f"jackmaguire-site research {MAILTO}"})
    with urllib.request.urlopen(req, timeout=45, context=SSL_CONTEXT) as res:
        return json.loads(res.read().decode("utf-8"))


def abstract_text(inv):
    if not inv:
        return ""
    words = []
    for word, positions in inv.items():
        for pos in positions:
            words.append((pos, word))
    return clean_text(" ".join(word for _, word in sorted(words))[:1200])


def authorship_names(authorships):
    names = []
    for item in authorships or []:
        author = item.get("author") or {}
        if author.get("display_name"):
            names.append(clean_text(author["display_name"]))
    return "; ".join(names[:6])


def source_name(work):
    loc = work.get("primary_location") or {}
    source = loc.get("source") or {}
    if source.get("display_name"):
        return clean_text(source["display_name"])
    return ""


def work_url(work):
    doi = work.get("doi")
    if doi:
        return doi
    loc = work.get("primary_location") or {}
    landing = loc.get("landing_page_url")
    if landing:
        return landing
    return work.get("id", "")


def concept_names(work):
    concepts = sorted(work.get("concepts") or [], key=lambda c: c.get("score", 0), reverse=True)
    return "; ".join(clean_text(c.get("display_name")) for c in concepts[:6] if c.get("display_name"))


def tokenize(text):
    return [
        w
        for w in re.findall(r"[A-Za-z][A-Za-z]{3,}", text.lower())
        if w not in STOP
    ]


def collect():
    seen = set()
    rows = []
    by_run = defaultdict(int)

    for spec in RUNS:
        page = 1
        while by_run[spec["run"]] < 50 and page <= 5:
            data = openalex_page(spec["query"], page)
            for work in data.get("results", []):
                if by_run[spec["run"]] >= 50:
                    break
                title = clean_text(work.get("title"))
                if not title:
                    continue
                key = (work.get("doi") or work.get("id") or title).lower()
                if key in seen:
                    continue
                work_type = clean_text(work.get("type"))
                if work_type not in ALLOWED_TYPES:
                    continue
                seen.add(key)
                row = {
                    "id": f"R{spec['run']:02d}-{by_run[spec['run']] + 1:03d}",
                    "run": spec["run"],
                    "batch": ((len(rows)) // 100) + 1,
                    "cluster": spec["cluster"],
                    "title": title,
                    "authors": authorship_names(work.get("authorships")),
                    "year": work.get("publication_year"),
                    "type": work_type,
                    "source": source_name(work),
                    "doi_or_url": clean_text(work_url(work)),
                    "cited_by_count": work.get("cited_by_count", 0),
                    "concepts": concept_names(work),
                    "abstract": abstract_text(work.get("abstract_inverted_index")),
                }
                rows.append(row)
                by_run[spec["run"]] += 1
            page += 1
            time.sleep(0.2)

    return rows


def write_outputs(rows):
    with (OUT_DIR / "sources_500.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    with (OUT_DIR / "sources_500.json").open("w", encoding="utf-8") as f:
        json.dump(rows, f, indent=2, ensure_ascii=True)

    themes = Counter()
    for row in rows:
        themes.update(tokenize(" ".join([row["title"], row["abstract"], row["concepts"]])))

    summary = {
        "total_sources": len(rows),
        "runs": dict(Counter(row["run"] for row in rows)),
        "batches": dict(Counter(row["batch"] for row in rows)),
        "clusters": dict(Counter(row["cluster"] for row in rows)),
        "top_terms": themes.most_common(80),
        "representative_sources": rows[:20],
    }
    with (OUT_DIR / "analysis.json").open("w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=True)

    with (OUT_DIR / "source_audit.md").open("w", encoding="utf-8") as f:
        f.write("# Market Limits Source Audit\n\n")
        f.write(f"Total sources: {len(rows)}\n\n")
        for batch in range(1, 6):
            f.write(f"## Batch {batch}\n\n")
            for row in [r for r in rows if r["batch"] == batch]:
                f.write(
                    f"- {row['id']}. {row['title']}. "
                    f"{row['authors']} ({row['year']}). "
                    f"{row['source']}. {row['doi_or_url']}\n"
                )
            f.write("\n")


if __name__ == "__main__":
    rows = collect()
    if len(rows) < 500:
        raise SystemExit(f"Expected 500 sources, collected {len(rows)}")
    write_outputs(rows[:500])
    print(f"Wrote {len(rows[:500])} sources to {OUT_DIR}")
