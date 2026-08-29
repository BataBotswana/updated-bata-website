/**
 * Botswana in Motion store finder: interactive in-page country map with accessible branch markers.
 * It is a resilient map presentation: branch selection, highlight state, and directions work without a third-party tile dependency.
 */
import { stores } from "@/data/catalog";

type StoreLocatorProps = {
  selectedStoreId: string;
  onSelectStore: (id: string) => void;
};

const markerPositions: Record<string, { x: number; y: number }> = {
  maun: { x: 198, y: 151 },
  francistown: { x: 375, y: 179 },
  "selibe-phikwe": { x: 403, y: 244 },
  gamecity: { x: 413, y: 362 },
  riverwalk: { x: 424, y: 352 },
  airport: { x: 442, y: 342 },
  railpark: { x: 405, y: 350 },
  lobatse: { x: 401, y: 407 },
};

export function StoreLocator({ selectedStoreId, onSelectStore }: StoreLocatorProps) {
  return (
    <div className="store-map store-map--fallback" role="group" aria-label="Interactive map of Bata Botswana store locations">
      <svg viewBox="0 0 640 470" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <path className="botswana-map-shape" d="M156 58 L438 59 L490 98 L510 171 L548 235 L516 306 L480 333 L462 414 L366 426 L329 398 L287 405 L237 380 L165 358 L129 286 L93 245 L112 186 L101 120 Z" />
        <path className="botswana-map-route" d="M195 153 C248 164 310 166 374 179 C389 205 397 223 403 244 C412 287 422 317 423 351 C420 372 409 390 401 407" />
        <path className="botswana-map-route botswana-map-route--minor" d="M403 244 C440 264 458 284 480 304" />
        <text x="186" y="123">NORTH WEST</text><text x="363" y="145">NORTH EAST</text><text x="330" y="294">CENTRAL</text><text x="194" y="332">GHANZI</text><text x="437" y="393">SOUTH EAST</text>
      </svg>
      <div className="store-map__caption"><span /> Botswana <small>Choose a pin</small></div>
      {stores.map((store) => {
        const location = markerPositions[store.id];
        return <button
          key={store.id}
          className={`map-marker ${store.id === selectedStoreId ? "is-selected" : ""}`}
          style={{ left: `${(location.x / 640) * 100}%`, top: `${(location.y / 470) * 100}%` }}
          onClick={() => onSelectStore(store.id)}
          aria-label={`Select ${store.name}`}
        >
          <span>{store.city === "Gaborone" ? "G" : store.city.slice(0, 1)}</span>
        </button>;
      })}
    </div>
  );
}
