# Study Tools for the Book Project

A small, growing collection of study pages for the book project.
Each tool is a single web page you can open on any device, and they all
share **one** vocabulary file — so a change made once appears everywhere.

## The files

| File | What it is |
|------|------------|
| `index.html` | The front door — a simple menu linking to every study tool. |
| `lexicon.html` | The **Lexicon**: a searchable vocabulary of key terms, each on its own card. |
| `flashcards.html` | **Flash Cards**: tap a card to flip term ↔ meaning, with reverse practice. |
| `keystone.html` | **The Keystone**: a single, still reading page — one passage to sit with (no tools). |
| `terms.json` | **The shared pantry** — every term lives here, and all tools read from it. |
| `shared.js` | Common code the tools share (loading terms, showing corrections). |

## How the shared vocabulary works

Every word is stored once, in `terms.json`. Each entry looks like this:

```json
{
  "term": "WATER",
  "original": "Saturating presence — presence at a concentration that cannot be ignored. Flood-stage versus ambient humidity.",
  "corrected": null,
  "correctedDate": null
}
```

- **`original`** — the first wording. Once written, it is never changed.
- **`corrected`** — a newer wording, added only when a term is corrected.
- **`correctedDate`** — the date that correction was made.

When a term has a correction, both pages show the **corrected** wording as the
main text, and keep the **original** below it in smaller, quieter text marked
*“Original (superseded [date])”*. Nothing is ever deleted.

## How to add or correct a word (no coding needed)

The simplest way: **just ask in plain English**, for example
*“Add the word LIGHT meaning …”* or *“Correct SEA to say …”.*

The Lexicon page also has a **“Draft a correction”** button on every card.
It opens the current wording so you can edit it, then gives you a tidy,
copy-ready block (the term, your new wording, today’s date) to paste wherever
you keep your changes. It does not save anything by itself — it just prepares
the text for you.

## Seeing it on the web

The project is published with **GitHub Pages** from the `main` branch:

- Lexicon: `https://sileo888.github.io/KAT/lexicon.html`
- Flash Cards: `https://sileo888.github.io/KAT/flashcards.html`
- Home menu: `https://sileo888.github.io/KAT/`
