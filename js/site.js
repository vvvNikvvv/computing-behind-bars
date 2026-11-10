// Shared header, navigation, and footer for every page.
// Edit SITE below to update the maintenance note and contact info everywhere at once.

const SITE = {
  title: "Computing Behind Bars",
  lastUpdated: "November 10, 2026",          // TODO: update whenever data or content changes
  updatePlan: "[TODO: say whether the team will keep updating this site after the course]",
  contactName: "[TODO: contact name]",
  contactEmail: "[TODO: contact email]",
  repoUrl: "[TODO: GitHub repo URL]",
};

const PAGES = [
  ["index.html", "Home"],
  ["map.html", "Explore the Map"],
  ["history.html", "History"],
  ["context.html", "Context & Research"],
  ["programs.html", "Featured Programs"],
  ["sources.html", "Sources & Methodology"],
];

function renderChrome() {
  const here = location.pathname.split("/").pop() || "index.html";

  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <a class="site-title" href="index.html">${SITE.title}</a>
    <nav aria-label="Main">
      ${PAGES.map(([href, label]) =>
        `<a href="${href}"${href === here ? ' aria-current="page"' : ""}>${label}</a>`
      ).join("")}
    </nav>`;
  document.body.prepend(header);

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <section>
      <h2>Maintenance</h2>
      <p>Last updated ${SITE.lastUpdated}. ${SITE.updatePlan}
      Questions, corrections, or programs we've missed: ${SITE.contactName},
      <a href="mailto:${SITE.contactEmail}">${SITE.contactEmail}</a>.</p>
    </section>
    <section>
      <h2>AI disclosure</h2>
      <p>AI tools (Claude, by Anthropic; [TODO: list any others, e.g. ChatGPT]) were used to help
      write code and edit text for this site. All program data and sources were found and verified
      by the project team.</p>
    </section>
    <p class="fine">This map lists documented programs only and is not a complete census.
    See <a href="sources.html">Sources &amp; Methodology</a>.
    Code: <a href="${SITE.repoUrl}">${SITE.repoUrl}</a></p>`;
  document.body.append(footer);
}

renderChrome();
