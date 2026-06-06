# Notion Context for AI Agents

This file gives AI agents the information needed to read from and write to Jack's Notion workspace correctly. Read it before querying, creating, or updating any Notion data.

---

## Workspace Structure

Two hubs anchor everything:

- **The Dashboard** (`184257d9-eb39-4238-a459-82048fe51703`) - operational, short-term. Check here for current to-dos, active tracking, and today's priorities.
- **Second Brain** (`2e414299-8528-80b8-bcd1-e35e854fc0cf`) - structural, long-term. All databases live under or are linked from here.

---

## Database Quick Reference

Use these collection URLs when querying via SQL or the Notion query tools.

### Operations
| Database | Collection URL | Key fields |
|---|---|---|
| To Do | `collection://2e614299-8528-8092-a49a-000b4bc452a5` | Name, Completed, Due Date, Difficulty, Financial Leverage |
| Goals & Plans | `collection://1c91f172-c9bc-4c30-9a96-07869870e03e` | Name, Status, Category, Time Frame, Rationale |
| Completed Tasks | `collection://2f214299-8528-8024-9544-000b70af29f0` | Archive of done tasks |

### Career
| Database | Collection URL | Key fields |
|---|---|---|
| Job Search Actions | `collection://40d079cf-f43f-4214-a686-3f5607497d55` | Company, Position, Status, Unemployment Week, Date Applied |
| Job Search Reflections | `collection://6c495df1-a79c-4df1-9fcd-334de98346d1` | Entry, Date, Domain, Thoughts |

### Health & Body
| Database | Collection URL | Key fields |
|---|---|---|
| Body Tracking | `collection://997ca995-8739-4bdd-81e9-ae3aff4f9a7d` | Scan Type, Date, Source, Body Score, Total Mass, Body Fat %, FFMI, measurements |
| Workout Reflections | `collection://1939f57c-210c-4d0c-8c80-39cc3a913743` | Entry, Date, Domain, Thoughts |
| Grief Log | `collection://70c2836c-1dad-4fef-899e-845bd1df2959` | Date Label, Date, Score (1-10), Notes |

### Skincare
| Database | Collection URL | Key fields |
|---|---|---|
| Skincare Log | `collection://817d4f00-3473-405d-b1de-2794d5950f07` | Entry, Date, Domain, Thoughts |
| Beauty Routine Tracker | `collection://2ef14299-8528-80fa-84f3-000b88610694` | Routine compliance tracking |

### Knowledge & Media
| Database | Collection URL | Key fields |
|---|---|---|
| Books I've Read | `collection://2ef14299-8528-8038-83f0-000b5884471f` | Title, Author, My Rating, ISBN, Pages, Year |
| Movies I've Seen | `collection://2f014299-8528-80a0-8391-000b70592d72` | Name, rating, Niche Recommendation |
| Long-Term Memory | `collection://e228c91b-f8d1-4d38-8376-43732183ae74` | Name, Type, Category, Date, Summary, Source, Agent Confidence |
| Notes | `collection://2e414299-8528-8079-9e36-000bfe48912b` | General notes |
| Miscellaneous | `collection://ab7c5502-c528-4255-967a-985a3239052f` | Catch-all |

### Inventory & Shopping
| Database | Collection URL | Key fields |
|---|---|---|
| Clothing Inventory | `collection://2e514299-8528-80bf-bef4-000b42f90b36` | Clothing items |
| Food Inventory | `collection://2ef14299-8528-802c-8696-000b5207f098` | Pantry items |
| Groceries List | `collection://2e614299-8528-80d6-86a0-000b8b46d8da` | Active shopping list |
| Shopping List | `collection://eb41e1b7-0067-45b3-8a84-6e38fff49648` | Non-grocery purchases |

### Logs
| Database | Collection URL | Key fields |
|---|---|---|
| Morning Updates Archive | `collection://8aebeae0-dc64-4199-a654-3972fe4de55f` | Date, Update, NYC Hidden Gem |

---

## Critical AI Agent Rules

### Books and Movies - Always Query First
Both the Books I've Read and Movies I've Seen databases have 300+ entries. Before recommending any book or film to Jack, run a SQL LIKE query against the relevant database for every candidate title.

```sql
-- Books check
SELECT "Title" FROM "collection://2ef14299-8528-8038-83f0-000b5884471f"
WHERE lower("Title") LIKE '%title keyword%'

-- Movies check  
SELECT "Name" FROM "collection://2f014299-8528-80a0-8391-000b70592d72"
WHERE lower("Name") LIKE '%title keyword%'
```

Do not rely on paginated scans or alphabetical sorts. Batch up to 25 titles per query. Jack has read and seen many obscure works.

### Long-Term Memory - Use for Persistent Facts
When you learn something durable about Jack (a preference, a rule, a decision, a pattern), write it to Long-Term Memory (`collection://e228c91b-f8d1-4d38-8376-43732183ae74`). Set Type to one of: fact, decision, rule, pattern, insight. Set Category to Travel, Career, Personal, or Health. Set Agent Confidence (0-1).

Before stating something you think you know about Jack, query Long-Term Memory first.

### To Do - Task Management Protocol
- Active tasks: query To Do (`collection://2e614299-8528-8092-a49a-000b4bc452a5`) where Completed = false
- Completed tasks move to Completed Tasks (`collection://2f214299-8528-8024-9544-000b70af29f0`)
- Use Financial Leverage (1-10) and Difficulty (1-10) fields when prioritizing career-related tasks

### Job Search - Week Tracking
Job Search Actions uses an "Unemployment Week" select field (Waiting through Week 15) to track how far into the search each application was made. Always set this when creating new application rows.

### Body Tracking - Measurement Sources
Source options: DexaFit (gold standard), Home Scale (frequent), Gym, Other. When logging DEXA results, populate the full measurement set including FFMI, ALMI, A/G Ratio, T-Score, and all circumferences. Formulas (Shoulder-to-Waist Ratio, Waist-to-Height Ratio, Waist-to-Hip Ratio) are calculated automatically.

### Grief Log - Scoring Convention
Score is 1-10 where 1 = minimal grief and 10 = most intense. Displayed as a blue bar in Notion. Always include a Date Label (short description like "Checked Instagram") and brief Notes.

---

## Website CMS

Jack's website (jackmaguire.org) uses Notion as a CMS. The database is:

- **Collection:** `collection://30614299-8528-803e-a779-000bd9c70894`
- **Database title:** JackMaguire.com

Each row represents a published page with Article Title, Article Body (HTML/rich text), and Article Url. The Home page row ID is `d9a1c22d-74ba-488e-9826-32fd2ced3169`. Do not modify website CMS rows without explicit instruction.

---

## Workspace Owner

Jack Maguire. Senior Paid Social Media Director at National Debt Relief. East Village, NYC. Interests: performance marketing, NYC food, travel, philosophy, AI tools. Currently in active job search as of early 2026.
