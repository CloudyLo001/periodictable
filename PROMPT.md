# 3D Periodic Table — Build Prompt

Use mint-threejs-skills to build this Three.js app.

**App type and user goal:**
An interactive, aesthetic 3D periodic table explorer. The user browses a
physically extruded periodic table, clicks any element to cinematically enter
it, and explores that element's animated atom with its full set of chemical,
physical, and mechanical properties. Educational, but design-led: it should
feel like a premium interactive installation, not a textbook widget.

**Primary 3D subject:**

1. *The table*: all 118 elements laid out in the standard periodic table
   arrangement (main body plus the lanthanide/actinide rows below). Each
   element is a square tile that physically sticks out of a shared backplane as
   an extruded 3D block. Tile faces show symbol, atomic number, name, and
   atomic mass as crisp legible text. Extrusion depth may subtly vary (e.g. by
   atomic number or density) to give the table topography, as long as the grid
   stays clean and readable.
2. *The element interiors*: each tile's front face acts as a hinged **flap** —
   a flat panel that swings open on one edge like a hatch (no handle, no
   door-frame styling). Behind it is a dark void with subtle glow and drifting
   particles containing an **animated Bohr-model atom**: a nucleus at the
   center, electron shells rendered as orbital rings, and electrons orbiting
   along them with animation. Shell electron counts must match the element's
   real electron configuration (e.g. 2-8-18-32...). The nucleus visually
   conveys protons and neutrons (counts shown in the data panels; the nucleus
   itself can be a stylized glowing cluster). Floating holographic-style data
   panels around the atom present the element's properties.

**Essential interactions:**

- Hover (desktop) / tap-highlight (mobile): the tile lifts or glows slightly
  and shows a tooltip with symbol + name.
- Click an element → input locks, camera smoothly zooms toward that tile, the
  flap swings open, and the camera passes through into the interior. The
  flap-open animation must visibly begin before the camera crosses the
  threshold.
- Inside: constrained orbit/inspect controls around the atom; data panels are
  readable from the default framing; electrons orbit continuously.
- A clearly visible **Exit** control inside → camera pulls back out through the
  opening, the flap swings closed, and the camera returns to the previous
  table view. The close animation mirrors the open.
- Settings panel (compact, unobtrusive, opened from a small button):
  - **Material finish** of the tiles: glossy, matte, metallic, satin (procedural
    PBR presets; switching is instant).
  - **Background**: black or white (lighting/text contrast adapts so both look
    intentional).
  - **Color mode**: category colors (alkali metals, alkaline earth metals,
    transition metals, post-transition metals, metalloids, reactive nonmetals,
    noble gases, halogens, lanthanides, actinides — classic periodic-table
    families) or monochrome/minimal (uniform neutral tiles with subtle
    hover/selection accent). Category colors are the default.
  - **Mute** toggle for audio.
  - Settings persist across reloads (localStorage).

**Camera/control model:**
Orbit controls in table view (rotate/zoom/pan within sane limits so the table
never gets lost off-screen). Enter/exit transitions are scripted cinematic
camera animations with easing; user input is locked during transitions and
restored after. Inside an element, orbit is constrained around the atom.
Touch equivalents for all controls on mobile.

**State or data sources:**
A bundled local JSON dataset of all 118 elements — no backend, no runtime
fetching from third-party APIs. Each element record includes, with units:

- Identity: atomic number, symbol, name, category/family, period, group,
  discovery year, discoverer.
- Atomic structure: protons, neutrons (most common isotope), electrons,
  electron configuration (full + noble-gas shorthand), electrons per shell.
- Chemical: atomic mass (u), electronegativity (Pauling), first ionization
  energy (kJ/mol), electron affinity (kJ/mol), common oxidation states,
  atomic radius (pm), covalent radius (pm).
- Physical/mechanical: phase at STP, density (g/cm³), melting point (K and °C),
  boiling point (K and °C), molar heat capacity (J/(mol·K)), thermal
  conductivity (W/(m·K)), electrical conductivity or resistivity, Mohs
  hardness, Young's modulus (GPa) where known.

Missing values (common for synthetic/superheavy elements) display as "—", never
as blank, NaN, or fabricated numbers. Data panels group properties into
labeled sections and always show units.

**Target devices:**
Desktop-first (mouse + keyboard, 60fps target). Mobile-friendly: touch
controls, responsive settings/data UI, and a reduced effects budget (fewer
particles, cheaper post-processing) on small/weak devices.

**Visual direction:**
Minimal, high-contrast, gallery-like. The black or white background and the
tile material finish carry the aesthetic — no decorative chrome, headers, or
branding. Soft studio-style lighting that flatters both glossy and matte
finishes on both backgrounds. Inside elements: dark void, gentle bloom/glow on
nucleus and electrons, subtle particle drift, elegant thin-line orbital rings,
clean typographic data panels. Motion throughout is smooth and eased; nothing
snaps.

**Performance/deployment constraints:**
Static Vite + TypeScript + vanilla Three.js build, deployable as plain static
files. Use instancing/merged geometry and shared materials for the 118 tiles;
build each element's interior on demand (lazy) rather than keeping 118 atoms
resident. Maintain 60fps on a mid-range desktop in table view and inside an
element.

**Audio (Mint MCP):**
Generate a small SFX set with Mint MCP and integrate the files locally through
the `mint-assets.json` registry pipeline: a soft whoosh for the zoom-in/enter
transition, a flap-open sound, a flap-close sound, and a low ambient hum that
plays only while inside an element. All audio is subtle, volume-balanced, and
respects the mute setting. Audio is the only generated-asset need — tiles and
atoms are procedural Three.js; do not generate models, materials, or worlds.

**Required outcome:**

- Complete primary user journey with loading and error behavior: load table →
  hover → click → flap opens → inside atom with data → exit → flap closes →
  back to table.
- Mint MCP for production assets; integrate files locally and stream world RAD
  manifests through SparkJS.
- Clear interaction feedback and responsive UI.
- Build, browser, interaction, screenshot, and canvas verification.
- Report controls, state ownership, changed files, evidence, and risks.

**Acceptance criteria:**

- All 118 elements are present, in correct periodic-table positions, and every
  tile is clickable with the full enter/exit animation working.
- The flap visibly opens before the camera enters and visibly closes on exit;
  input locking prevents broken states from clicking mid-transition.
- Electron shell counts and electron configurations match real data; spot-check
  at least H, C, Fe, Au, and U.
- Property panels show units on every value and "—" for unknown values.
- All four settings (finish, background, color mode, mute) work live and
  persist across reloads.
- Runs smoothly on desktop and remains usable with touch on mobile.
