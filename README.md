# Study Tools for the Book Project

A small, growing collection of study pages for the book project.
Each tool is a single web page you can open on any device.

## The pages

| File | What it is |
|------|------------|
| `index.html` | The front door — a simple menu linking to every study tool. |
| `lexicon.html` | The **Lexicon**: a searchable vocabulary of key terms, each shown as its own card. |

More study tools will be added over time, each as its own file, and linked
from `index.html`.

## How to add a new word to the Lexicon (no coding needed)

The simplest way: **just ask in plain English**, for example
*"Add the word LIGHT meaning the presence that reveals what was always there."*
The word will be placed in the right spot for you.

If you ever want to do it yourself:

1. Open `lexicon.html`.
2. Scroll down to the part that says **THE LEXICON ENTRIES**.
3. Copy one existing block — it looks like this:

   ```
   {
     term: "WORD",
     definition: "The meaning goes here."
   },
   ```

4. Paste it into the list, then change the word and the meaning.
   Keep the quotation marks `" "` around both, and keep the comma at the end.
5. Save the file. Done.

The page automatically keeps the words in alphabetical order and updates the
search, so you never have to worry about placement.

## Seeing it on the web

This project is published with **GitHub Pages**, so it lives at a real web
address you can open on your phone, tablet, or computer. See the printed
setup steps you were given for the exact link.
