import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

import useFetchPhotos from "./hooks/useFetchPhotos";
import PhotoCard from "./components/PhotoCard";

const STORAGE_KEY = "celebrare-photo-gallery-favourites";

// Load saved favourite IDs when the app starts.
function loadFavourites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Manage adding and removing favourites.
function favouritesReducer(state, action) {
  switch (action.type) {
    case "TOGGLE":
      return state.includes(action.id)
        ? state.filter((id) => id !== action.id)
        : [...state, action.id];

    default:
      return state;
  }
}

export default function App() {
  const { photos, loading, error } = useFetchPhotos();

  const [searchTerm, setSearchTerm] = useState("");

  const [favouriteIds, dispatch] = useReducer(
    favouritesReducer,
    [],
    loadFavourites,
  );

  // Save favourites whenever the list changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favouriteIds));
    } catch {
      // The gallery can still work if storage is unavailable.
    }
  }, [favouriteIds]);

  // Handle search input changes.
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  // Filter the photos already fetched from the API.
  const filteredPhotos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return photos.filter((photo) => photo.author.toLowerCase().includes(query));
  }, [photos, searchTerm]);

  function handleToggleFavourite(id) {
    dispatch({ type: "TOGGLE", id });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
            Celebrare · Frontend Assignment
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Photo Gallery
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Explore photographs and save your favourite moments.
          </p>
        </header>

        <section aria-label="Search photos">
          <label
            htmlFor="photo-search"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Search by author
          </label>

          <input
            id="photo-search"
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Type an author's name..."
            className="w-full max-w-xl rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
          />
        </section>

        <section aria-label="Photo gallery" className="mt-8">
          {loading ? (
            <div
              className="flex flex-col items-center justify-center gap-4 py-20"
              role="status"
            >
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />

              <p className="text-slate-600">Loading photos...</p>
            </div>
          ) : error ? (
            <p
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-700"
            >
              {error}
            </p>
          ) : filteredPhotos.length === 0 ? (
            <p className="py-12 text-center text-slate-600">
              No photos found for this author.
            </p>
          ) : (
            <>
              <p className="mb-5 text-sm text-slate-500">
                Showing {filteredPhotos.length} photos
              </p>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {filteredPhotos.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    isFavourite={favouriteIds.includes(photo.id)}
                    onToggleFavourite={handleToggleFavourite}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
