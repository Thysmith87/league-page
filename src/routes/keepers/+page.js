// src/routes/+page.js
import { loadKeepers } from '$lib/utils/helperFunctions/loadKeepers';

export async function load() {
  const keepers = await loadKeepers();
  return { keepers };
}
