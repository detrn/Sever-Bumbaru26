const FALLBACK_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat_03.jpg/320px-Cat_03.jpg";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderDetalii(detalii = []) {
  return detalii
    .map(
      (detaliu) => `
        <div class="urban-detail">
            <strong>${escapeHtml(detaliu.eticheta)}</strong>
            <span>${escapeHtml(detaliu.valoare)}</span>
        </div>
      `,
    )
    .join("");
}

function renderProjectCard(proiect) {
  const statusType = proiect.statusTip === "active" ? "active" : "planning";

  return `
    <article class="urban-card">
        <div class="urban-card__media">
            <img
                src="${escapeHtml(proiect.imagine || FALLBACK_IMAGE)}"
                alt="${escapeHtml(proiect.altImagine || proiect.titlu)}"
                onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';"
                style="width:100%;height:100%;object-fit:cover;display:block;"
            >
            <span class="urban-card__badge"><i data-lucide="${escapeHtml(proiect.icon || "building-2")}" style="width:14px;height:14px;"></i> ${escapeHtml(proiect.categorie)}</span>
        </div>
        <div class="urban-card__body">
            <div class="urban-card__meta">
                <span class="urban-pill"><i data-lucide="map-pin" style="width:14px;height:14px;"></i> ${escapeHtml(proiect.locatie)}</span>
                <span class="urban-pill"><i data-lucide="calendar-range" style="width:14px;height:14px;"></i> ${escapeHtml(proiect.dataReferinta)}</span>
            </div>
            <h3 class="urban-card__title">${escapeHtml(proiect.titlu)}</h3>
            <p class="urban-card__desc">${escapeHtml(proiect.descriere)}</p>
            <div class="urban-card__details">
                ${renderDetalii(proiect.detalii)}
            </div>
            <div class="urban-card__footer">
                <div class="urban-card__status urban-status--${statusType}"><span class="urban-dot"></span> ${escapeHtml(proiect.status)}</div>
                <div class="urban-card__owner">Sursa: ${escapeHtml(proiect.sursa)}</div>
            </div>
        </div>
    </article>
  `;
}

async function loadUrbanProjects() {
  const grid = document.getElementById("urban-projects-grid");
  const counter = document.getElementById("urban-projects-count");

  if (!grid) {
    return;
  }

  grid.innerHTML = '<p class="urban-card__desc">Se incarca proiectele...</p>';

  const proiecte = await getData("dezvoltare-urbana");

  if (!Array.isArray(proiecte) || proiecte.length === 0) {
    grid.innerHTML =
      '<p class="urban-card__desc">Nu exista proiecte disponibile in baza de date pentru aceasta sectiune.</p>';
    if (counter) {
      counter.textContent = "0";
    }
    return;
  }

  grid.innerHTML = proiecte.map(renderProjectCard).join("");

  if (counter) {
    counter.textContent = String(proiecte.length);
  }

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  loadUrbanProjects();
});
