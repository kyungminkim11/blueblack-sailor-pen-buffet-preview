export function publicTourShell(root, copy) {
  root.innerHTML = `
    <link rel="stylesheet" href="./store-guide-roadview-v28-fix.css?v=28" data-roadview-fix="28" />
    <div class="store-tour-heading">
      <div>
        <small>360 STORE TOUR</small>
        <h2 data-tour-copy="title">${copy.title}</h2>
        <p data-tour-copy="body">${copy.body}</p>
      </div>
      <span data-tour-copy="badge">${copy.badge}</span>
    </div>

    <div class="store-tour-workspace roadview-workspace">
      <section class="store-tour-view-card roadview-card">
        <div class="store-tour-card-head roadview-head">
          <div>
            <strong data-tour-copy="current">${copy.current}</strong>
            <span data-tour-code></span>
          </div>
          <b data-tour-title></b>
          <span class="tour-network-state" data-tour-network aria-live="polite"></span>
        </div>

        <div class="store-tour-view-shell roadview-shell">
          <div data-tour-viewer></div>
          <div class="store-tour-direction-layer" data-tour-directions></div>

          <aside class="store-tour-plan-card tour-minimap-card is-collapsed" data-tour-plan-panel>
            <div class="store-tour-card-head tour-minimap-head">
              <div>
                <strong data-tour-copy="plan">${copy.plan}</strong>
                <span data-tour-count>11 VIEW POINTS</span>
              </div>
              <button type="button" class="tour-plan-toggle" data-tour-plan-toggle aria-expanded="false">도면 보기</button>
            </div>
            <div class="store-tour-floorplan" data-tour-plan></div>
          </aside>
        </div>

        <p class="store-tour-hint" data-tour-copy="hint">${copy.hint}</p>
        <div class="store-tour-scene-list" data-tour-list aria-label="360 촬영 지점"></div>
        <div class="store-tour-status" data-tour-status aria-live="polite"></div>
      </section>
    </div>
  `;
}
