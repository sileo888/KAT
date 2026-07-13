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

/* ---- Corrections: a device-local store that survives closing the page ----
   A public page cannot write to the repository, so a correction saved here
   lives in THIS browser only until its filing block is put into terms.json.
   A FILED correction (in terms.json) always wins over a device-local one.   */
const CORR_STORE_KEY = "kat.corrections.v1";
function loadLocalCorrections() {
  try { return JSON.parse(localStorage.getItem(CORR_STORE_KEY) || "{}") || {}; }
  catch (_) { return {}; }
}
function getLocalCorrection(term) { return loadLocalCorrections()[term] || null; }
function setLocalCorrection(term, corr) {
  const all = loadLocalCorrections();
  all[term] = corr;
  try { localStorage.setItem(CORR_STORE_KEY, JSON.stringify(all)); } catch (_) {}
}
function clearLocalCorrection(term) {
  const all = loadLocalCorrections();
  delete all[term];
  try { localStorage.setItem(CORR_STORE_KEY, JSON.stringify(all)); } catch (_) {}
}

/* The correction in force for a term, or null (State A).
   Returns { text, date, replaced, source } — filed beats device-local. */
function resolveCorrection(t, localCorr) {
  if (t.corrected && String(t.corrected).trim()) {
    return { text: t.corrected, date: t.correctedDate, replaced: !!t.replaced, source: "filed" };
  }
  if (localCorr && localCorr.text && String(localCorr.text).trim()) {
    return { text: localCorr.text, date: localCorr.date, replaced: !!localCorr.replaced, source: "local" };
  }
  return null;
}

/* Does this term have an in-force (filed) correction? */
function hasCorrection(t) {
  return !!(t.corrected && String(t.corrected).trim());
}

/* The wording currently in force: the correction if there is one, else
   the untouched original. Used to pre-fill the correction editor.        */
function effectiveDefinition(t, localCorr) {
  const c = resolveCorrection(t, localCorr);
  return c ? c.text : t.original;
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

/* Build the definition block for a card, in one of three states:

   STATE A — no correction: just the definition.
   STATE B — a correction (or possible definition) lives permanently BELOW
             the original, labeled "Correction (date)". Stable, not pending.
   STATE C — a deliberate replace: only the corrected text shows. The
             original is never deleted from the record; it just stops showing.

   `decorate` is an optional function applied to the escaped text before
   label-styling (used by the lexicon for search highlighting).
   `localCorr` is this device's saved correction for the term, if any.     */
function definitionBlockHTML(t, decorate, localCorr) {
  const corr = resolveCorrection(t, localCorr);

  if (!corr) {                                     // STATE A
    return '<p class="definition">' + definitionText(t.original, decorate) + "</p>";
  }
  if (corr.replaced) {                             // STATE C
    return '<p class="definition">' + definitionText(corr.text, decorate) + "</p>";
  }
  const dateTxt = corr.date ? escapeHtml(corr.date) : "date not given";   // STATE B
  return (
    '<p class="definition">' + definitionText(t.original, decorate) + "</p>" +
    '<p class="correction-note">' +
      '<span class="corr-label">Correction (' + dateTxt + ")</span> " +
      definitionText(corr.text, decorate) +
    "</p>"
  );
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
