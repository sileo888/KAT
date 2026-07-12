/* ============================================================
   shared.js — common code for every study tool in this project.

   All tools (the lexicon, the flash cards, and any future ones)
   read the SAME vocabulary from terms.json through here, and share
   the same rules for showing definitions and corrections.

   You do not need to edit this file to add or correct words.
   Words live in  terms.json .
   ============================================================ */

/* Load the shared vocabulary. Returns a list of term objects:
   { term, original, corrected, correctedDate }                     */
async function loadTerms() {
  const res = await fetch("terms.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load terms.json (" + res.status + ")");
  const data = await res.json();
  // Removed entries are kept in the file (never silently deleted) but never displayed.
  return data.terms.filter(t => !t.removed);
}

/* The categories, in the book's order of motion (not alphabetical). */
const CATEGORY_ORDER = [
  "The Two Realities",
  "The Receiver",
  "The Turn",
  "The Summit",
  "The Saturation",
  "The Descent",
];

/* Make text safe to place inside the page. */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

/* Labelled parts that appear inside some definitions get a subtle style. */
const DEF_LABELS = ["Root:", "KAT reading:", "Kosmos reception:", "Anchor:"];
function styleLabels(html) {
  DEF_LABELS.forEach(l => {
    html = html.split(l).join('<span class="deflabel">' + l + "</span>");
  });
  return html;
}

/* Does this term have an in-force correction? */
function hasCorrection(t) {
  return !!(t.corrected && String(t.corrected).trim());
}

/* The definition currently in force: the correction if there is one,
   otherwise the untouched original.                                  */
function currentDefinition(t) {
  return hasCorrection(t) ? t.corrected : t.original;
}

/* Editorial lines that are part of the text but shown smaller and quieter:
   a trailing "(Source: …)" note, and any "[FLAG: …]" / "[FENCE: …]" marker. */
function styleMeta(html) {
  html = html.replace(/\[(?:FLAG|FENCE):[^\]]*\]/g, m => '<span class="defflag">' + m + "</span>");
  html = html.replace(/\(Source:[^)]*\)\s*$/, m => '<span class="defsource">' + m + "</span>");
  return html;
}

/* Turn a raw definition string into safe, label-styled HTML.
   An optional `decorate` step (e.g. search highlighting) runs first. */
function definitionText(text, decorate) {
  const step = decorate || (s => s);
  return styleMeta(styleLabels(step(escapeHtml(String(text)))));
}

/* Build the definition block for a card.

   - No correction: just the definition.
   - With a correction: the corrected wording is the main text, and the
     ORIGINAL is kept below it, smaller and quieter, marked as superseded.

   `decorate` is an optional function applied to the escaped text before
   label-styling (used by the lexicon for search highlighting).         */
function definitionBlockHTML(t, decorate) {
  if (hasCorrection(t)) {
    const dateTxt = t.correctedDate ? escapeHtml(t.correctedDate) : "date not given";
    return (
      '<p class="definition">' + definitionText(t.corrected, decorate) + "</p>" +
      '<p class="superseded">' +
        '<span class="sup-label">Original (superseded ' + dateTxt + ")</span> " +
        definitionText(t.original, decorate) +
      "</p>"
    );
  }
  return '<p class="definition">' + definitionText(t.original, decorate) + "</p>";
}

/* Sort key: alphabetise ignoring a leading "THE ". */
function sortKey(term) {
  return String(term).replace(/^THE\s+/i, "").trim();
}

/* Alphabetical order by term (ignoring a leading "THE"), for calm reading. */
function sortTerms(terms) {
  return [...terms].sort((a, b) => sortKey(a.term).localeCompare(sortKey(b.term)));
}

/* Today's date as YYYY-MM-DD, for drafting corrections. */
function todayISO() {
  const d = new Date();
  const p = n => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}
