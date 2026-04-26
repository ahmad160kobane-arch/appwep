"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ContentItem {
  id: string;
  title: string;
  poster: string;
  vod_type: "movie" | "series";
  year?: string;
  rating?: string;
  tmdb_id?: string;
  source?: string;
}

interface Props {
  item: ContentItem;
}

function PremiumModal({
  onClose,
  onSubscribe,
}: {
  onClose: () => void;
  onSubscribe: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-xs rounded-2xl bg-dark-card border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition text-white/60 hover:text-white text-sm"
        >
          ✕
        </button>

        <div className="p-6 flex flex-col items-center text-center gap-4">
          {/* Lock icon */}
          <div className="w-16 h-16 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-amber-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 1C8.676 1 6 3.676 6 7v1H4a1 1 0 00-1 1v12a1 1 0 001 1h16a1 1 0 001-1V9a1 1 0 00-1-1h-2V7c0-3.324-2.676-6-6-6zm4 7V7a4 4 0 10-8 0v1h8zm-5 5a1 1 0 112 0v3a1 1 0 11-2 0v-3z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Text */}
          <div>
            <h3 className="text-white font-black text-lg mb-1">
              محتوى بريميوم
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              هذا المحتوى متاح فقط للمشتركين في الباقة البريميوم
            </p>
          </div>

          {/* Features */}
          <div className="w-full bg-white/5 rounded-xl p-3 flex flex-col gap-2">
            {[
              "🎬 أفلام ومسلسلات بلا قيود",
              "📺 قنوات بث مباشر",
              "🚀 جودة عالية بدون انقطاع",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 text-right justify-end"
              >
                <span className="text-white/70 text-xs">{f}</span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <button
            onClick={onSubscribe}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-black text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-amber-400/30"
          >
            🔓 فعّل الاشتراك الآن
          </button>

          <button
            onClick={onClose}
            className="text-white/40 text-xs hover:text-white/60 transition"
          >
            ربما لاحقاً
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ContentCard({ item }: Props) {
  const [imgError, setImgError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { isPremium, isLoggedIn, loading } = useAuth();
  const router = useRouter();

  const type = item.vod_type === "series" ? "series" : "movie";
  const href = `/detail?id=${item.id}&type=${type}&title=${encodeURIComponent(item.title)}&poster=${encodeURIComponent(item.poster || "")}${item.source ? "&source=" + item.source : ""}`;

  const handleClick = (e: React.MouseEvent) => {
    if (loading) return;
    if (!isLoggedIn || !isPremium) {
      e.preventDefault();
      setShowModal(true);
    }
  };

  const handleSubscribe = () => {
    setShowModal(false);
    router.push("/subscription");
  };

  return (
    <>
      {/* Premium Modal */}
      {showModal && (
        <PremiumModal
          onClose={() => setShowModal(false)}
          onSubscribe={handleSubscribe}
        />
      )}

      <Link
        href={href}
        onClick={handleClick}
        className="block w-full group cursor-pointer card-hover"
      >
        <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-light-input dark:bg-dark-input">
          {/* Poster */}
          {item.poster && !imgError ? (
            <img
              src={item.poster}
              alt={item.title}
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${!isPremium && !loading ? "brightness-[0.8]" : ""}`}
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-light-card dark:bg-dark-card">
              <svg
                className="w-10 h-10 text-dark-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* ─── TOP RIGHT: Type badge + Lock icon side by side ─── */}
          <div className="absolute top-2 right-2 flex items-center gap-1">
            {/* Type badge */}
            <div
              className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                item.vod_type === "series"
                  ? "bg-indigo-500/90 text-white"
                  : "bg-amber-500/90 text-white"
              }`}
            >
              {item.vod_type === "series" ? "مسلسل" : "فيلم"}
            </div>

            {/* Lock icon — always visible for non-premium */}
            {!isPremium && !loading && (
              <div className="flex items-center justify-center w-5 h-5 rounded-md bg-black/65 backdrop-blur-sm">
                <svg
                  className="w-3 h-3 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 1C8.676 1 6 3.676 6 7v1H4a1 1 0 00-1 1v12a1 1 0 001 1h16a1 1 0 001-1V9a1 1 0 00-1-1h-2V7c0-3.324-2.676-6-6-6zm4 7V7a4 4 0 10-8 0v1h8zm-5 5a1 1 0 112 0v3a1 1 0 11-2 0v-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Rating badge — top left */}
          {item.rating && (
            <div className="absolute top-2 left-2 flex items-center gap-0.5 bg-black/60 px-1.5 py-0.5 rounded-md">
              <svg
                className="w-2.5 h-2.5 text-amber-400 fill-amber-400"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-[9px] text-white font-bold">
                {item.rating}
              </span>
            </div>
          )}

          {/* Play button on hover — premium only */}
          {isPremium && !loading && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-10 h-10 rounded-full bg-brand-primary/90 flex items-center justify-center shadow-lg">
                <svg
                  className="w-5 h-5 text-white mr-[-2px]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Lock overlay on hover — non-premium */}
          {!isPremium && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/55">
              <svg
                className="w-7 h-7 text-amber-400 mb-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 1C8.676 1 6 3.676 6 7v1H4a1 1 0 00-1 1v12a1 1 0 001 1h16a1 1 0 001-1V9a1 1 0 00-1-1h-2V7c0-3.324-2.676-6-6-6zm4 7V7a4 4 0 10-8 0v1h8zm-5 5a1 1 0 112 0v3a1 1 0 11-2 0v-3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-[10px] text-amber-300 font-bold">
                بريميوم
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <p className="mt-1.5 text-xs font-medium text-light-text dark:text-dark-text line-clamp-1 px-0.5">
          {item.title}
        </p>
        {item.year && (
          <p className="text-[10px] text-light-muted dark:text-dark-muted px-0.5">
            {item.year}
          </p>
        )}
      </Link>
    </>
  );
}
