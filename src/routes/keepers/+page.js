// src/routes/+page.js
import { loadKeepers } from '$lib/loadKeepers';

export async function load() {
  const keepers = await loadKeepers();
  return { keepers };
}
