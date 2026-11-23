"use client";
import { useEffect, useState } from 'react';
import { canSearch, normalizeSearch } from '../lib/search-index';

const key = 'lrt-search-frequency';
function readCounts() {
  try {
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    return Object.fromEntries(Object.entries(data).filter(([term, count]) => term.length <= 80 && Number.isFinite(count) && count > 0));
  } catch { return {}; }
}
export function recordSearch(query) {
  const term = normalizeSearch(query).slice(0, 80);
  if (!canSearch(term)) return;
  try {
    const counts = readCounts();
    counts[term] = (counts[term] || 0) + 1;
    localStorage.setItem(key, JSON.stringify(Object.fromEntries(Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 30))));
    window.dispatchEvent(new Event('lrt:search'));
  } catch { /* Search still works without storage. */ }
}
export default function usePopularSearches(products) {
  const [counts, setCounts] = useState({});
  useEffect(() => {
    const update = () => setCounts(readCounts());
    update();
    window.addEventListener('lrt:search', update);
    window.addEventListener('storage', update);
    return () => { window.removeEventListener('lrt:search', update); window.removeEventListener('storage', update); };
  }, []);
  const notes = {};
  for (const product of products) for (const note of product.notes || []) notes[note] = (notes[note] || 0) + 1;
  return [...new Set([...Object.entries(counts).sort((a,b) => b[1] - a[1]).map(([term]) => term), ...Object.entries(notes).sort((a,b) => b[1] - a[1]).map(([term]) => term)])].slice(0, 6);
}
