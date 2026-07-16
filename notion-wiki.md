# Notion Workspace Wiki

Personal workspace for Jack Maguire. Two top-level hubs anchor the workspace: **The Dashboard** (short-term, operational) and **Second Brain** (structural, long-term). Below them are ~20 active databases organized into functional domains.

---

## Top-Level Hubs

### The Dashboard
**URL:** https://www.notion.so/184257d9eb394238a45982048fe51703

Short-term memory. What is happening right now, what is in motion, what needs attention today. Organized into sections: To Do & Career, Fitness & Body, Skincare & Grooming, Mental Health & Mood, Activity Log, Goals & Plans, Inventory, and daily routine pages.

### Second Brain
**URL:** https://www.notion.so/2e414299852880b8bcd1e35e854fc0cf

Structural long-term system. Organizes all life domains: Identity & Strategy, Active Projects (job search), Life Systems (body, health, operations), and Library (inventory, knowledge archives). Most databases live under this hub.

---

## Databases

### Operations

#### To Do
**Collection:** `collection://2e614299-8528-8092-a49a-000b4bc452a5`
**URL:** https://www.notion.so/2e61429985288057be9be6e2c5d85195

Current task list. Appears both on The Dashboard (filtered "Today" view) and Second Brain.

| Property | Type | Notes |
|---|---|---|
| Name | title | Task name |
| Completed | checkbox | Done state |
| Due Date | date | Target date |
| Difficulty | number | 1-10 scale |
| Financial Leverage | number | 1-10 short-term career leverage score |
| Created time | created\_time | Auto |
| Files & media | file | Attachments |

#### Goals & Plans
**Collection:** `collection://1c91f172-c9bc-4c30-9a96-07869870e03e`
**URL:** https://www.notion.so/be59fdd0d25545968e5ee88d729610f6

Tracks named goals with status and rationale. Categories: Career, Travel, Relationship, Well-being, Financial, Personal.

| Property | Type | Notes |
|---|---|---|
| Name | title | Goal name |
| Status | status | Not Started / In Progress / Completed |
| Category | select | Career, Travel, Relationship, Well-being, Financial, Personal |
| Time Frame | text | Target horizon |
| Rationale | text | Why this goal |
| Date Set | date | When the goal was created |

#### Completed Tasks
**Collection:** `collection://2f214299-8528-8024-9544-000b70af29f0`
**URL:** https://www.notion.so/2f2142998528802e965adf55d6d49f19

Archive of finished tasks.

---

### Career

#### Job Search Actions
**Collection:** `collection://40d079cf-f43f-4214-a686-3f5607497d55`
**URL:** https://www.notion.so/bd234addb9bc4cc1a2ad664d9648f805

Tracks every job application with pipeline status and week-by-week unemployment tracking.

| Property | Type | Notes |
|---|---|---|
| Company | title | Employer name |
| Position | text | Role title |
| Status | select | To Apply / Applied / Interviewing / Offer / Rejected / Declined / Pending |
| Unemployment Week | select | Waiting through Week 15 |
| Date Applied | date | Application date |
| Notes | text | Free text |
| Proof | file | Application proof attachment |

#### Job Search Reflections
**Collection:** `collection://6c495df1-a79c-4df1-9fcd-334de98346d1`
**URL:** https://www.notion.so/ba5c3214d2424ce1b304d0f85b8ca33c

Journal log for job search (and general domain) reflections. Domain filter covers Workout, Skincare, and Job Search entries.

| Property | Type | Notes |
|---|---|---|
| Entry | title | Entry name |
| Date | date | Entry date |
| Domain | select | Workout / Skincare / Job Search |
| Thoughts | text | Free text |

---

### Health & Body

#### Body Tracking
**Collection:** `collection://997ca995-8739-4bdd-81e9-ae3aff4f9a7d`
**URL:** https://www.notion.so/f87e19052a1541f09067ba2f4f29d5ce

Detailed body composition log. Supports DEXA scan data (DexaFit), home scale, and gym check-ins. Includes calculated formulas.

| Property | Type | Notes |
|---|---|---|
| Scan Type | title | e.g., DEXA Scan, Scale Check-in |
| Date | date | Measurement date |
| Source | select | DexaFit / Home Scale / Gym / Other |
| Body Score | select | Letter grade A+ through F |
| Total Mass | number | lbs |
| Lean Mass | number | lbs |
| Body Fat % | number | percent |
| Visceral Fat | number | lbs |
| FFMI | number | Fat-free mass index kg/m2 |
| ALMI | number | Appendicular lean mass index kg/m2 |
| A/G Ratio | number | Android/gynoid ratio |
| T-Score | number | Bone density |
| Waist / Hips / Chest / Shoulders / Neck / Arm | number | Circumferences in inches |
| Shoulder-to-Waist Ratio | formula | Shoulders / Waist |
| Waist-to-Height Ratio | formula | Waist / Height |
| Waist-to-Hip Ratio | formula | Waist / Hips |
| Notes | text | Free text |

#### Workout Reflections
**Collection:** `collection://1939f57c-210c-4d0c-8c80-39cc3a913743`
**URL:** https://www.notion.so/928c64407db0493a93678873e7dd2128

Journal log for workout sessions. Same schema as Job Search Reflections and Skincare Log (shared domain filter pattern).

| Property | Type | Notes |
|---|---|---|
| Entry | title | Session name |
| Date | date | |
| Domain | select | Workout / Skincare / Job Search |
| Thoughts | text | Free text |

#### Grief Log
**Collection:** `collection://70c2836c-1dad-4fef-899e-845bd1df2959`
**URL:** https://www.notion.so/0be4fb94c72547c3a5072672a10c4777

Daily emotional tracking log, created post-breakup. Scores grief intensity 1-10, displayed as a bar chart in Notion.

| Property | Type | Notes |
|---|---|---|
| Date Label | title | Short description of the day |
| Date | date | |
| Score | number | 1-10 intensity (shown as bar) |
| Notes | text | What came up |

---

### Skincare & Grooming

#### Skincare Log
**Collection:** `collection://817d4f00-3473-405d-b1de-2794d5950f07`
**URL:** https://www.notion.so/069e98e654294671a703b8d16535f4db

Same Entry/Date/Domain/Thoughts schema as Workout Reflections. Domain can be Skincare, Workout, or Job Search.

#### Beauty Routine Tracker
**Collection:** `collection://2ef14299-8528-80fa-84f3-000b88610694`
**URL:** https://www.notion.so/2ef142998528806db8dff44b98f4205e

Tracks beauty/grooming routine compliance.

---

### Knowledge & Media

#### Books I've Read
**Collection:** `collection://2ef14299-8528-8038-83f0-000b5884471f`
**URL:** https://www.notion.so/2ef14299852880fa868ac0e240d7471f

300+ entries. AI agents must SQL query before recommending any book (see description warning on Title field).

| Property | Type | Notes |
|---|---|---|
| Title | title | Book title (AI query required before recommending) |
| Author | text | |
| My Rating | number | Personal rating |
| ISBN | text | |
| Number of Pages | number | |
| Original Publication Year | number | |
| Publisher | text | |

#### Movies I've Seen
**Collection:** `collection://2f014299-8528-80a0-8391-000b70592d72`
**URL:** https://www.notion.so/2f014299852880e6a7a6d3f836481be4

300+ entries. AI agents must SQL query before recommending any film.

| Property | Type | Notes |
|---|---|---|
| Name | title | Film title (AI query required before recommending) |
| rating | number | Personal score |
| Niche Recommendation | text | Why it was recommended or notable |

#### TV Shows I've Seen
**URL:** https://www.notion.so/5baeb335328d40ed981c1442b2c51341

Simple static page with a ratings table (not a full database). Top shows: The Bear, Ozark (5 stars); Halt and Catch Fire, Mad Men, Mr. Robot, The Sopranos, Dark, Beef, Better Call Saul (4 stars).

#### Long-Term Memory
**Collection:** `collection://e228c91b-f8d1-4d38-8376-43732183ae74`
**URL:** https://www.notion.so/dd4768bc5931412dbdfd5c4248743ae3

Structured AI-readable memory store. Captures facts, decisions, rules, patterns, and insights across Travel, Career, Personal, and Health categories.

| Property | Type | Notes |
|---|---|---|
| Name | title | Memory entry name |
| Type | select | fact / decision / rule / pattern / insight |
| Category | select | Travel / Career / Personal / Health |
| Date | date | When recorded |
| Summary | text | The memory content |
| Source | text | Where it came from |
| Agent Confidence | number | Confidence score (0-1) |

##### Website Writing Memory

For opinion essays, retain a continuous, claim-led flow instead of clipped contrast or counter-assertion pairs. The preferred form carries the causal relationship in one natural sentence, for example: "Every advertising platform is designed to make its contribution to revenue visible and persuasive, so its reporting will naturally place the platform near the center of the growth story." The reference revision is [Most marketing departments are optimizing the wrong thing](src/content/blog/what-is-changing-in-marketing-departments-in-2026.md). The durable repository record is [docs/writing-style-memory.md](docs/writing-style-memory.md).

#### Notes
**Collection:** `collection://2e414299-8528-8079-9e36-000bfe48912b`
**URL:** https://www.notion.so/2e414299852880028173fee45b2a0249

General notes archive.

#### Miscellaneous
**Collection:** `collection://ab7c5502-c528-4255-967a-985a3239052f`
**URL:** https://www.notion.so/285047f319e644789027dc03c9257914

Catch-all database for items that don't fit other categories.

---

### Inventory & Shopping

#### Clothing Inventory
**Collection:** `collection://2e514299-8528-80bf-bef4-000b42f90b36`
**URL:** https://www.notion.so/2e5142998528808b9673d733456d65f0

Tracks owned clothing items.

#### Food Inventory
**Collection:** `collection://2ef14299-8528-802c-8696-000b5207f098`
**URL:** https://www.notion.so/2ef142998528802390b9dd935ce633b8

Tracks food items on hand.

#### Groceries List
**Collection:** `collection://2e614299-8528-80d6-86a0-000b8b46d8da`
**URL:** https://www.notion.so/2e6142998528804fb7dedef4ad535813

Active grocery shopping list.

#### Shopping List
**Collection:** `collection://eb41e1b7-0067-45b3-8a84-6e38fff49648`
**URL:** https://www.notion.so/fdfafa9d89e944aca07b5f2423a7f214

General (non-grocery) shopping list.

---

### Logs & Archives

#### Morning Updates Archive
**Collection:** `collection://8aebeae0-dc64-4199-a654-3972fe4de55f`
**URL:** https://www.notion.so/f90394c6a650409db9781de9c91473fc

Archive of daily AI-generated morning briefings, including an NYC hidden gem entry per day.

| Property | Type | Notes |
|---|---|---|
| Date | title | "Weekday, Month DD, YYYY" format |
| Update | text | Full morning briefing text |
| NYC Hidden Gem | text | That day's NYC discovery |

---

### Website (JackMaguire.com)

#### JackMaguire.com (CMS Database)
**Collection:** `collection://30614299-8528-803e-a779-000bd9c70894`

Notion serves as the CMS backend for jackmaguire.org. The Home page entry lives here as a database row with Article Title, Article Body, and Article Url properties. Published pages are pulled from this collection.

---

## Key Static Pages

| Page | URL | Purpose |
|---|---|---|
| The Dashboard | /184257d9... | Operational daily hub |
| Second Brain | /2e414299... | Long-term life OS |
| Morning Routine | /24e46e7a... | Daily morning protocol |
| Workout Routine | /7ad3be59... | Current training plan |
| Skincare Routine | /ad4147a9... | Current skincare protocol |
| Job Search Strategy | /636ac56a... | Active job search plan |
| Movie Scoring Rubric | /1ebe3e68... | Rubric for rating films |
| Book Scoring Rubric | /423a377c... | Rubric for rating books |
| My Notion AI | /31214299... | AI agent instructions |
| Morning Update Log | /ac3d384c... | Daily log page |
| Daily mood log with distortions | /30714299... | CBT-style mood tracking |
| Resume - Base | /30214299... | Master resume |
