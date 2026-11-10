// Renders data/sources.csv on the Sources & Methodology page, grouped by category.

(async function () {
  const el = document.getElementById("source-list");
  try {
    const sources = await loadCSV("data/sources.csv");
    const groups = {};
    for (const s of sources) (groups[s.category || "Other"] ||= []).push(s);

    el.innerHTML = Object.entries(groups).sort().map(([cat, list]) => `
      <h3>${escapeHTML(cat)}</h3>
      <ol class="sources">
        ${list.map(s => `
          <li id="${escapeHTML(s.id)}">
            ${escapeHTML(s.author_org)}. (${escapeHTML(s.date || "n.d.")}).
            <a href="${escapeHTML(s.url)}" target="_blank" rel="noopener"><cite>${escapeHTML(s.title)}</cite></a>.
            ${s.used_for ? `<span class="muted">Used for: ${escapeHTML(s.used_for)}.</span>` : ""}
            ${s.notes ? `<span class="muted">${escapeHTML(s.notes)}</span>` : ""}
          </li>`).join("")}
      </ol>`).join("");

    document.getElementById("source-count").textContent = `${sources.length} sources`;
  } catch (err) {
    el.textContent = `${err.message}. If you opened this file directly, run a local server instead (see README).`;
  }
})();
