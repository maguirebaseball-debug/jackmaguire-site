# NYC cheese blintzes design decision

Internal Impeccable decision record.

## Agent synthesis

Four isolated explorations agreed on the product truths that should shape the page:

- one canonical ordered list, never borough-filtered copies;
- three entrances with different jobs: decisive shortcuts, neighborhood navigation, and the full ranking;
- ruled editorial rows instead of cards;
- greater breathing room for ranks 1 through 8;
- a custom flat illustration, never fake restaurant photography;
- anchors and semantic HTML that remain useful without JavaScript;
- no visible confidence scores, medals, badges, or pseudo-scientific ranking graphics;
- no deli nostalgia kit, checkerboard, neon, distressed paper, or borrowed cultural scripts.

## Seven grounded directions

1. **The Blintz Index:** a wide independent-magazine composition with a cutaway hero and large rank gutter.
2. **The Borough Blintz Ledger:** a paper-toned reporting ledger with a sticky geographic rail and three-column entries.
3. **The City Register:** a black-and-white municipal index whose personality comes from rank rhythm and rules.
4. **The Folded Menu:** one abstract folded sheet opens into the article. Its crease becomes the page's off-center registration rail, ingredient shapes become section markers, and every ranked entry aligns to the same fold.
5. **The Counter Ticket:** a narrow order-ticket grammar with ranks as check numbers and practical facts as the receipt stub.
6. **The Ingredient Atlas:** a diagrammatic cross-section of wrapper, cheese, fruit, and sour cream that becomes the navigation system.
7. **Twenty-Five Plates:** a poster-like number system with one flat plate emblem repeated at controlled scales through the ranking.

Impeccable assigned direction 4. It passes both required tests:

- **Audience identification:** the headline, numbered ranking, restaurant names, and food illustration identify a city food guide immediately.
- **Product clarity:** the fold acts as a registration rail, not decoration. It supports shortcuts, neighborhood anchors, rank alignment, and mobile collapse without hiding any content.

## Challenger weighing

| Challenger | Audience identification | Product clarity | Verdict | Discipline carried forward |
| --- | --- | --- | --- | --- |
| Provenance ribbon | Weak for a practical food ranking | Strong evidence grammar, but implies disputed historical custody | Declined | Keep evidence close to each claim through direct menu links |
| Miura fold sheet | Food identity depends too heavily on added copy | Fold logic is strong but interaction would overpower reading | Competitive | Preserve one continuous crease system across desktop and mobile |
| Monochrome claim and proof | Reads as software marketing | Excellent claim-to-proof pairing | Declined | Pair each recommendation with an exact order and direct source |
| Plakatstil object poster | Excellent food identity with a heroic flat object | A poster wall would fragment the single ranking | Competitive | Make the hero one bold object with no ornamental ground |
| Emission-line rail | Reads as scientific instrumentation | Strong single-rail state grammar, poor fit for restaurants | Declined | Let one off-center rail organize every entry |
| Film cutting bench | Reads as a media tool | Horizontal scrubbing harms long-form reading and mobile use | Declined | Use hard transitions and no decorative fades |

No challenger beats the assigned direction on both audience identification and product clarity.

## Selected system: The Folded Menu

### Material and palette

- Ground: warm paper `#FFFDF8`
- Ink: `#171714`
- Sour cherry: `#B8203E`
- Diner blue: `#245A78`
- Farmer-cheese cream: `#F1E3C4`

Black and paper carry the page. Cherry marks ranks and the fold's active registration point. Blue is reserved for navigation and external menu links. Cream is confined to the illustration and occasional field backgrounds.

### Typography

- The site's loaded Plus Jakarta Sans heading face for the headline, ranks, navigation, labels, and restaurant names.
- Charter for the dek, disclosure, and entry prose.
- Tabular numerals for ranks and prices.
- No new webfont payload.

### Composition

- Compact `Writing / NYC Food` breadcrumb.
- Split hero: headline and dek on the left, a large flat folded-blintz diagram on the right.
- The hero's main crease continues into the opening utility sections as a decorative registration rail, then yields to the ranking.
- `Start here` is a six-line index crossing that rail, not six cards.
- The neighborhood directory stays visible and uses ordinary deep links.
- The ranking is one semantic ordered list. Each row has rank, restaurant and prose, then order, price, and menu link.
- Ranks 1 through 8 use the full three-column rhythm. Lower entries use a denser version of the same system.

### Interaction and adaptation

- The fold is rendered in its final state with no entrance animation.
- All navigation is ordinary anchor navigation.
- Desktop uses a sticky neighborhood rail. Mobile uses a two-column borough link grid with 44-pixel targets plus a one-line sticky jump bar.
- No filters, carousels, accordions for entries, hover-only facts, or scroll-jacking.
- A print stylesheet turns the page into a clean saved list.

### Risks and controls

- The fold metaphor can become ornamental. Every crease must align content or navigation.
- Saturated accents can become poster cosplay. Keep most of the page black on warm white.
- Twenty-five rows can tire the reader. Change density after rank 8, not the component anatomy.
- The hero can delay utility. Keep `Start here` within roughly two phone viewports.
- The design can become a detached microsite. Retain the site breadcrumb, metadata, article feed behavior, and `More writing` footer link.
