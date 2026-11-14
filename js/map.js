// Explore the Map: loads data/programs.csv, draws one marker per facility,
// and filters programs by type, credential, partner, state, status and keyword.

// Program types, from most to least structured. A facility's marker color shows
// its most structured offering that matches the current filters.
// Colors: colorblind-validated categorical slots 1-4, assigned in fixed order.
const TYPES = [
  { key: "Degree pathway",            color: "#2a78d6", note: "Computing coursework within a degree program" },
  { key: "Certificate",               color: "#eb6834", note: "A structured certificate program" },
  { key: "Standalone course",         color: "#1baf7a", note: "Individual computing courses" },
  { key: "Other computing education", color: "#eda100", note: "Digital literacy, IT, or related training" },
];
const TYPE_RANK = Object.fromEntries(TYPES.map((t, i) => [t.key, i]));
const OTHER_COLOR = "#8a8a85";

const STATUS_LABEL = {
  verified: "Verified",
  historical: "Historical (no longer offered)",
  pending: "Pending verification",
  example: "Example record",
};

const state = { programs: [], markers: new Map(), map: null };

init().catch(err => {
  document.getElementById("map-status").textContent =
    `${err.message}. If you opened this file directly, run a local server instead (see README).`;
  console.error(err);
});

async function init() {
  state.programs = (await loadCSV("data/programs.csv")).filter(p => p.latitude && p.longitude);

  // Base map: U.S. state outlines stored in the repo (no tile service or API key needed).
  state.map = L.map("map", {
    scrollWheelZoom: false,
    zoomSnap: 0.25,
    minZoom: 2,
    maxZoom: 10,
    maxBounds: [[5, -200], [75, -50]],
    attributionControl: true,
  });
  state.map.attributionControl.setPrefix(false);
  state.map.createPane("states").style.zIndex = 350;

  const states = await (await fetch("data/us-states.geojson")).json();
  L.geoJSON(states, {
    pane: "states",
    style: { color: "#ffffff", weight: 1.2, fillColor: "#e4e3de", fillOpacity: 1 },
    attribution: 'State boundaries: U.S. Census Bureau, via <a href="https://github.com/topojson/us-atlas">us-atlas</a>',
    onEachFeature: (f, layer) => {
      layer.bindTooltip(f.properties.name, { sticky: true, direction: "top", className: "state-tip" });
      layer.on("mouseover", () => layer.setStyle({ fillColor: "#d3d2cc" }));
      layer.on("mouseout", () => layer.setStyle({ fillColor: "#e4e3de" }));
    },
  }).addTo(state.map);

  // Start on the contiguous U.S.; Alaska, Hawaii and Puerto Rico are a short pan away.
  state.map.fitBounds([[24.4, -125], [49.5, -66.9]], { padding: [10, 10] });

  buildFilters();
  buildLegend();
  update();

}

// ---------- Filters ----------

function uniqueValues(field) {
  return [...new Set(state.programs.map(p => p[field]).filter(Boolean))].sort();
}

function checkboxGroup(containerId, name, values, labelFor = v => v, checked = () => true) {
  const el = document.getElementById(containerId);
  el.innerHTML = values.map(v => `
    <label><input type="checkbox" name="${name}" value="${escapeHTML(v)}"${checked(v) ? " checked" : ""}>
    ${labelFor(v)}</label>`).join("");
}

function buildFilters() {
  const typeValues = [...TYPES.map(t => t.key), ...uniqueValues("program_type").filter(v => !(v in TYPE_RANK))];
  checkboxGroup("f-type", "type", typeValues, v => {
    const t = TYPES.find(t => t.key === v);
    return `<span class="swatch" style="background:${t ? t.color : OTHER_COLOR}"></span>${escapeHTML(v)}`;
  });
  checkboxGroup("f-field", "field", uniqueValues("credential_field"), escapeHTML);
  checkboxGroup("f-partner", "partner", uniqueValues("partner_type"), escapeHTML);
  checkboxGroup("f-status", "status", uniqueValues("verification_status"),
    v => escapeHTML(STATUS_LABEL[v] || v), v => v !== "pending");

  const stateSel = document.getElementById("f-state");
  stateSel.innerHTML = `<option value="">All states</option>` +
    uniqueValues("state").map(s => `<option>${escapeHTML(s)}</option>`).join("");

  document.getElementById("filters").addEventListener("input", update);
  document.getElementById("reset-filters").addEventListener("click", () => {
    document.getElementById("filters").reset();
    buildFilters();
    update();
  });
}

function checkedValues(name) {
  return new Set([...document.querySelectorAll(`input[name="${name}"]:checked`)].map(i => i.value));
}

function currentFilter() {
  const f = {
    type: checkedValues("type"),
    field: checkedValues("field"),
    partner: checkedValues("partner"),
    status: checkedValues("status"),
    state: document.getElementById("f-state").value,
    q: document.getElementById("f-search").value.trim().toLowerCase(),
  };
  return p =>
    f.type.has(p.program_type) &&
    (!p.credential_field || f.field.has(p.credential_field)) &&
    (!p.partner_type || f.partner.has(p.partner_type)) &&
    f.status.has(p.verification_status) &&
    (!f.state || p.state === f.state) &&
    (!f.q || [p.institution, p.education_partner, p.computing_offering, p.city, p.description]
      .join(" ").toLowerCase().includes(f.q));
}

// ---------- Map + table ----------

function facilityKey(p) { return `${p.institution}|${p.state}`; }

function update() {
  const matches = state.programs.filter(currentFilter());

  // Group matching programs by facility
  const facilities = new Map();
  for (const p of matches) {
    const k = facilityKey(p);
    if (!facilities.has(k)) facilities.set(k, []);
    facilities.get(k).push(p);
  }

  state.markers.forEach(m => m.remove());
  state.markers.clear();

  for (const [key, progs] of facilities) {
    progs.sort((a, b) => (TYPE_RANK[a.program_type] ?? 99) - (TYPE_RANK[b.program_type] ?? 99));
    const top = TYPES.find(t => t.key === progs[0].program_type);
    const historicalOnly = progs.every(p => p.verification_status === "historical");
    const marker = L.circleMarker([+progs[0].latitude, +progs[0].longitude], {
      radius: 9,
      color: "#ffffff",
      weight: 2,
      fillColor: top ? top.color : OTHER_COLOR,
      fillOpacity: historicalOnly ? 0.4 : 0.95,
    })
      .bindPopup(popupHTML(progs), { maxWidth: 340 })
      .bindTooltip(escapeHTML(progs[0].institution))
      .addTo(state.map);
    state.markers.set(key, marker);
  }

  const nFac = facilities.size, nProg = matches.length;
  document.getElementById("map-status").textContent =
    `Showing ${nProg} program${nProg === 1 ? "" : "s"} at ${nFac} facilit${nFac === 1 ? "y" : "ies"}.`;

  renderTable(matches);
}

function popupHTML(progs) {
  const f = progs[0];
  return `
    <div class="popup">
      <h3>${escapeHTML(f.institution)}</h3>
      <p class="muted">${escapeHTML(f.city)}, ${escapeHTML(f.state)}</p>
      ${progs.map(p => `
        <div class="popup-program">
          <dl>
            <dt>Partner</dt><dd>${escapeHTML(p.education_partner)}${p.partner_type ? ` (${escapeHTML(p.partner_type)})` : ""}</dd>
            <dt>Computing offering</dt><dd>${escapeHTML(p.computing_offering)}</dd>
            <dt>Program type</dt><dd>${escapeHTML(p.program_type)}</dd>
            <dt>Credential</dt><dd>${escapeHTML(p.credential || "None")}${p.credential_field && p.credential_field !== "None" ? ` (${escapeHTML(p.credential_field.toLowerCase())} field)` : ""}</dd>
            <dt>Status</dt><dd>${escapeHTML(STATUS_LABEL[p.verification_status] || p.verification_status)}, checked ${escapeHTML(p.last_verified)}</dd>
          </dl>
          ${p.description ? `<p>${escapeHTML(p.description)}</p>` : ""}
          ${p.source_url ? `<p>Source: <a href="${escapeHTML(p.source_url)}" target="_blank" rel="noopener">${escapeHTML(p.source_title || p.source_url)}</a></p>` : ""}
        </div>`).join("")}
    </div>`;
}

function renderTable(rows) {
  const tbody = document.querySelector("#program-table tbody");
  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="6">No programs match these filters.</td></tr>`;
    return;
  }
  tbody.innerHTML = rows.map(p => `
    <tr>
      <td><button class="linklike" data-key="${escapeHTML(facilityKey(p))}">${escapeHTML(p.institution)}</button></td>
      <td>${escapeHTML(p.state)}</td>
      <td>${escapeHTML(p.education_partner)}</td>
      <td>${escapeHTML(p.computing_offering)}</td>
      <td>${escapeHTML(p.program_type)}</td>
      <td>${p.source_url ? `<a href="${escapeHTML(p.source_url)}" target="_blank" rel="noopener">Source</a>` : ""}</td>
    </tr>`).join("");

  tbody.querySelectorAll("button[data-key]").forEach(btn =>
    btn.addEventListener("click", () => {
      const m = state.markers.get(btn.dataset.key);
      if (!m) return;
      state.map.setView(m.getLatLng(), 7);
      m.openPopup();
      document.getElementById("map").scrollIntoView({ behavior: "smooth", block: "center" });
    }));
}

function buildLegend() {
  const legend = L.control({ position: "bottomright" });
  legend.onAdd = () => {
    const div = L.DomUtil.create("div", "legend");
    div.innerHTML = `<strong>Most structured offering</strong>` +
      TYPES.map(t => `<div><span class="swatch" style="background:${t.color}"></span>${t.key}</div>`).join("") +
      `<div class="muted">Faded marker = historical program</div>`;
    return div;
  };
  legend.addTo(state.map);
}
