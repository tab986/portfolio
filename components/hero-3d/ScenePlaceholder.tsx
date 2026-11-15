/** Desktop lanyard stage size. Matches the mounted card so the column does not jump. */
export const cardStageClassName =
  "relative h-[min(82vh,700px)] w-full lg:h-[min(78vh,660px)] lg:min-h-[560px]";

export function RoomPlaceholder() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-transparent"
      role="status"
    >
      <span className="sr-only">Loading 3D workspace</span>
      <svg
        aria-hidden
        viewBox="0 0 200 140"
        className="h-[62%] w-[78%] max-w-xl text-chrome"
        fill="none"
      >
        <path
          d="M100 18 L168 52 V108 L100 126 L32 108 V52 Z"
          stroke="currentColor"
          strokeOpacity="0.28"
          strokeWidth="1.25"
        />
        <path
          d="M100 18 L100 78 L168 52 M100 78 L32 52 M100 78 V126"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1.25"
        />
        <rect
          x="86"
          y="86"
          width="28"
          height="18"
          stroke="#d4af37"
          strokeOpacity="0.55"
          strokeWidth="1.25"
        />
      </svg>
    </div>
  );
}

export function CardPlaceholder() {
  return (
    <div
      className={`${cardStageClassName} flex items-center justify-center bg-transparent`}
      role="status"
    >
      <span className="sr-only">Loading 3D ID card</span>
      <div
        aria-hidden
        className="flex aspect-[3/4.2] h-[68%] flex-col justify-between rounded-[1.25rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-5"
      >
        <span className="h-2 w-10 rounded-full bg-gold/70" />
        <span className="flex flex-col gap-2">
          <span className="h-2 w-24 rounded-full bg-white/25" />
          <span className="h-2 w-16 rounded-full bg-white/15" />
        </span>
      </div>
    </div>
  );
}
