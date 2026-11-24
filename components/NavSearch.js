"use client";
import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "./StoreLink";
import Bottle from "./ProductBottle";
import { searchProducts, priceFor, productSizes } from "../lib/catalog";
import { canSearch } from "../lib/search-index";
import { markets, scentFamily, familyColors } from "../lib/store-config";
import usePopularSearches, { recordSearch } from "./usePopularSearches";

export default function NavSearch({ products, country }) {
  const root = useRef(null), input = useRef(null), router = useRouter();
  const [query, setQuery] = useState(''), [settled, setSettled] = useState('');
  const [open, setOpen] = useState(false), [active, setActive] = useState(-1);
  const suggestions = usePopularSearches(products);
  const ready = canSearch(query), pending = query !== settled;
  const matches = ready && !pending ? searchProducts(products, settled).slice(0, 6) : [];
  const currency = markets[country].currency;
  useEffect(() => {
    const timer = setTimeout(() => setSettled(query), 180);
    return () => clearTimeout(timer);
  }, [query]);
  useEffect(() => {
    const outside = e => { if (!root.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, []);
  const choose = () => { recordSearch(query); setOpen(false); };
  return <form ref={root} className="nav-search-pill" role="search" action="/shop"
    onBlur={e => { if (!root.current.contains(e.relatedTarget)) setOpen(false); }}
    onSubmit={e => {
      e.preventDefault();
      if (!ready) { setOpen(true); input.current.focus(); return; }
      choose();
      router.push(matches[active] ? '/product/' + matches[active].slug : '/shop?q=' + encodeURIComponent(query));
    }}>
    <input ref={input} type="search" name="q" value={query} placeholder="Search" aria-label="Search perfumes or SKU"
      role="combobox" aria-autocomplete="list" aria-controls="nav-matches" aria-expanded={open}
      aria-activedescendant={matches[active] ? 'nav-match-' + active : undefined} autoComplete="off" maxLength={100}
      onFocus={() => setOpen(true)} onChange={e => { setQuery(e.target.value); setOpen(true); setActive(-1); }}
      onKeyDown={e => {
        if (e.key === 'Escape') { setOpen(false); setActive(-1); }
        if (matches.length && ['ArrowDown', 'ArrowUp'].includes(e.key)) {
          e.preventDefault(); setOpen(true);
          const next = e.key === 'ArrowDown' ? (active + 1) % matches.length : (active <= 0 ? matches.length - 1 : active - 1);
          setActive(next); root.current.querySelector('#nav-match-' + next)?.scrollIntoView({ block: 'nearest' });
        }
      }} />
    {query && <button type="button" className="nav-clear" aria-label="Clear search" onClick={() => { setQuery(''); setActive(-1); input.current.focus(); }}><X size={16} /></button>}
    <button type="submit" aria-label="Submit search"><Search size={18} /></button>
    {open && <div className="nav-results">
      {!ready && <div className="nav-suggestions"><p>{query ? 'Enter at least three letters, or a SKU number.' : 'Search suggestions'}</p>
        {!query && suggestions.map(term => <button type="button" key={term} onClick={() => { setQuery(term); setActive(-1); input.current.focus(); }}>{term}</button>)}
      </div>}
      <ul id="nav-matches" role="listbox" aria-label="Matching perfumes" aria-busy={pending && ready}>
        {matches.map((p, i) => {
          const price = priceFor(p, productSizes(p)[0], currency), family = scentFamily(p);
          return <li key={p.id} role="presentation"><Link role="option" aria-selected={active === i} id={'nav-match-' + i} href={'/product/' + p.slug} onClick={choose}>
            <span className="nav-thumb"><Bottle product={p} small /></span>
            <span className="nav-result-copy"><strong>{p.name}</strong>{family && <small><img src={'/scent-families/' + family.toLowerCase() + '.png'} width="18" height="18" alt="" /><span style={{ '--family-tone': familyColors[family] }}>{family}</span></small>}</span>
            <span className="nav-result-price">{price === null ? 'Unavailable' : currency + ' ' + price.toLocaleString('en')}</span>
          </Link></li>;
        })}
      </ul>
      {ready && <p className="nav-search-status" role="status">{pending ? 'Searching…' : matches.length ? `${matches.length} suggestions` : `No perfumes match “${query}”.`}</p>}
      {matches.length > 0 && <Link className="nav-all" href={'/shop?q=' + encodeURIComponent(query)} onClick={choose}>View all results</Link>}
    </div>}
  </form>;
}
