export default function PhotoCard({ photo, isFavourite, onToggleFavourite }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={photo.download_url}
          alt={`Photograph by ${photo.author}`}
          loading="lazy"
          className="h-full w-full object-cover"
        />

        <button
          type="button"
          onClick={() => onToggleFavourite(photo.id)}
          aria-label={
            isFavourite ? "Remove from favourites" : "Add to favourites"
          }
          aria-pressed={isFavourite}
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full shadow transition focus:outline-none focus:ring-2 focus:ring-violet-500 ${
            isFavourite
              ? "bg-rose-500 text-white"
              : "bg-white text-slate-700 hover:text-rose-500"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill={isFavourite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className="px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Photographer
        </p>
        <h2 className="mt-1 font-semibold text-slate-900">{photo.author}</h2>
      </div>
    </article>
  );
}
