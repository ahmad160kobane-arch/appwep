"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VidsrcItem } from "@/constants/api";
import { useAuth } from "@/context/AuthContext";

interface HeroItem extends VidsrcItem {
  source?: string;
}

interface Props {
  items: HeroItem[];
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

          {/* Subscribe button */}
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

export default function HeroSlider({ items }: Props) {
  const [current, setCurrent] = useState(0);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const { isPremium, isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % items.length),
    [items.length],
  );

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, items.length]);

  if (!items.length) return null;

  const item = items[current];
  const type = item.vod_type === "series" ? "tv" : "movie";
  const isLulu = item.source === "lulu";
  const href = isLulu
    ? `/detail?id=${item.id}&type=${type}&source=lulu&title=${encodeURIComponent(item.title)}&poster=${encodeURIComponent(item.poster || "")}`
    : `/detail?id=${item.tmdb_id || item.id}&type=${type}&title=${encodeURIComponent(item.title)}&poster=${encodeURIComponent(item.poster || "")}`;
  const bg = imgErrors.has(current) ? null : item.backdrop || item.poster;

  const handleWatch = (e: React.MouseEvent) => {
    if (authLoading) return;
    if (!isLoggedIn || !isPremium) {
      e.preventDefault();
      setShowModal(true);
    }
  };

  return (
    <>
      {/* Premium Modal */}
      {showModal && (
        <PremiumModal
          onClose={() => setShowModal(false)}
          onSubscribe={() => {
            setShowModal(false);
            router.push("/subscription");
          }}
        />
      )}

      <div
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(260px, 45vw, 620px)" }}
      >
        {/* Background image */}
        {bg ? (
          <img
            key={current}
            src={bg}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            onError={() => setImgErrors((s) => new Set(s).add(current))}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-dark-card to-dark-bg" />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"
          style={{ direction: "ltr" }}
        />

        {/* Content */}
        <div
          className="absolute bottom-0 right-0 left-0 p-5 md:p-8 max-w-2xl mr-0 ml-auto"
          style={{ textAlign: "right" }}
        >
          {/* Type + Year + Lock chips */}
          <div className="flex items-center gap-2 mb-2 justify-end">
            {item.year && (
              <span className="text-xs text-white/70 font-medium">
                {item.year}
              </span>
            )}
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold ${item.vod_type === "series" ? "bg-indigo-500 text-white" : "bg-brand-primary text-black"}`}
            >
              {item.vod_type === "series" ? "مسلسل" : "فيلم"}
            </span>
            {item.rating && (
              <div className="flex items-center gap-0.5 bg-black/40 px-1.5 py-0.5 rounded">
                <svg
                  className="w-2.5 h-2.5 text-amber-400 fill-amber-400"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs text-white font-bold">
                  {item.rating}
                </span>
              </div>
            )}
            {/* Lock badge — always visible for non-premium */}
            {!authLoading && !isPremium && (
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm border border-amber-400/40 px-2 py-0.5 rounded-full">
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
                <span className="text-[10px] text-amber-400 font-bold">
                  بريميوم
                </span>
              </div>
            )}
          </div>

          <h1 className="text-white font-black text-xl md:text-3xl leading-tight mb-3 line-clamp-2">
            {item.title}
          </h1>

          {item.genres && item.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4 justify-end">
              {item.genres.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="px-2 py-0.5 rounded-full bg-white/10 text-white text-xs"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Watch button — changes based on premium status */}
          {!authLoading && isPremium ? (
            /* Premium: normal link */
            <Link
              href={href}
              className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-dark text-black font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-primary/30"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              مشاهدة الآن
            </Link>
          ) : (
            /* Non-premium: shows lock button → opens modal */
            <button
              onClick={handleWatch}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-amber-400/50 text-white font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              <svg
                className="w-4 h-4 text-amber-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 1C8.676 1 6 3.676 6 7v1H4a1 1 0 00-1 1v12a1 1 0 001 1h16a1 1 0 001-1V9a1 1 0 00-1-1h-2V7c0-3.324-2.676-6-6-6zm4 7V7a4 4 0 10-8 0v1h8zm-5 5a1 1 0 112 0v3a1 1 0 11-2 0v-3z"
                  clipRule="evenodd"
                />
              </svg>
              <span>اشترك لمشاهدة</span>
            </button>
          )}
        </div>

        {/* Pagination dots */}
        {items.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${i === current ? "w-5 h-1.5 bg-brand-primary" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
