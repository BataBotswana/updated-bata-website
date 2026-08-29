/**
 * Botswana in Motion store finder: a calm service page that lets customers move from a branch list to a live map.
 */
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Clock3, MapPin, Navigation, Phone, Search, Store } from "lucide-react";
import { Link } from "wouter";
import { stores } from "@/data/catalog";
import { useSupabaseStorefront } from "@/data/supabaseStorefront";
import { StoreLocator } from "@/components/StoreLocator";

export default function StoreFinder() {
  const { content: storefrontMaterial } = useSupabaseStorefront();
  const [query, setQuery] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState(stores[0].id);
  const matchingStores = useMemo(() => stores.filter((store) => `${store.name} ${store.city} ${store.address}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const selectedStore = stores.find((store) => store.id === selectedStoreId) ?? stores[0];
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${selectedStore.address}, ${selectedStore.city}, Botswana`)}`;
  return <div className="store-finder-page"><header className="store-finder-header"><Link href="/"><ArrowLeft size={18} /> Back to Bata Botswana</Link><Link className="product-logo" href="/">{storefrontMaterial?.logo_url ? <img src={storefrontMaterial.logo_url} alt="Bata" /> : <span>Bata</span>}</Link><Link href="/catalog">Shop the collection <ArrowRight size={16} /></Link></header><main><section className="finder-hero"><div className="finder-hero__status"><span>Nationwide</span><b>{stores.length} stores</b></div><p className="eyebrow">Bata Botswana / Store locator</p><h1>Good shoes<br /><em>close to home.</em></h1><p>Choose a branch to see it on the map, get directions, or plan your visit.</p></section><section className="store-locator-layout"><aside className="store-list-panel"><div className="store-search"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search city or store" /></div><div className="store-list-panel__count"><span>{matchingStores.length} locations</span><span>Across Botswana</span></div><div className="store-list">{matchingStores.map((store, index) => <button style={{ animationDelay: `${index * 40}ms` }} className={selectedStoreId === store.id ? "is-selected" : ""} key={store.id} onClick={() => setSelectedStoreId(store.id)}><span className="store-list__pin"><MapPin size={18} /></span><span><strong>{store.name}</strong><small>{store.address}</small><i>{store.city}</i></span><ArrowRight size={16} /></button>)}{matchingStores.length === 0 && <div className="store-empty"><Store size={27} /><p>No branches match that search. Try a city such as Gaborone, Maun or Francistown.</p></div>}</div></aside><div className="store-map-panel"><StoreLocator selectedStoreId={selectedStoreId} onSelectStore={setSelectedStoreId} /><div className="store-map-panel__card"><div><p className="eyebrow">Selected location</p><h2>{selectedStore.name}</h2><p>{selectedStore.address}</p></div><div className="store-map-panel__meta"><span><Clock3 size={15} /> {selectedStore.hours}</span><span><Phone size={15} /> {selectedStore.phone}</span></div><a href={directionsUrl} target="_blank" rel="noreferrer" className="button button--red"><Navigation size={16} /> Get directions</a></div></div></section></main></div>;
}
