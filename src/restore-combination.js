const STORAGE_KEY = 'blueblack-pen-combination-query';
const PART_IDS = ['cap_body', 'cap_end', 'nib_grip', 'metal_parts', 'barrel_body', 'barrel_end'];

const current = new URLSearchParams(location.search);
const alreadyHasSelection = PART_IDS.some((id) => current.has(id));

if (!alreadyHasSelection) {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const savedQuery = new URLSearchParams(saved);
    for (const id of PART_IDS) {
      const value = savedQuery.get(id);
      if (value) current.set(id, value);
    }
    const language = savedQuery.get('lang');
    if (language && !current.has('lang')) current.set('lang', language);
    history.replaceState(null, '', `${location.pathname}?${current}`);
  }
}
