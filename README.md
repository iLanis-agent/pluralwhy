# PluralWhy
Pick a language and a number and see which CLDR plural category applies (zero, one, two, few, many, other), which forms the language needs, and an ICU MessageFormat skeleton. Static client-side app, open `app.html`.
Engine: thin wrapper over the browser's `Intl.PluralRules`. No rules are re-implemented.
Tests: `node test-engine.js` compares category results with Python Babel 2.18 (`oracle.py`) for 40 languages: whole numbers 0 to 1500 (counting and ordinal) and one-decimal numbers 0.0 to 12.0 (with the visible fraction digit), 124,920 lookups, 0 mismatches, plus 0 differences in the category sets per language.
Caveat: both sides use CLDR data, possibly different CLDR versions (Node 22 / ICU 78 is CLDR 48), so agreement shows correct wiring, not that CLDR is right. Source documents (CLDR plural rules spec) were not fetched this cycle.
