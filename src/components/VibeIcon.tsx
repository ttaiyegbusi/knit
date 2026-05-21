import type { CategoryId } from "@/lib/types";

// The four vibe icons, transcribed faithfully from the provided SVGs:
// self-contained tiles (rx=7) with their own fill color, white glyph, and a
// subtle inner-shadow "glass" treatment.
const TILES: Record<CategoryId, { fill: string; glyph: string }> = {
  eat_out: {
    fill: "#0088FF",
    glyph:
      "M20.75 6.5V21.5H19.25V16.25H16.25V11C16.25 9.80653 16.7241 8.66193 17.568 7.81802C18.4119 6.97411 19.5565 6.5 20.75 6.5V6.5ZM19.25 8.3975C18.6275 8.75 17.75 9.6275 17.75 11V14.75H19.25V8.3975V8.3975ZM11.75 15.425V21.5H10.25V15.425C9.40311 15.2518 8.64199 14.7915 8.09536 14.1219C7.54872 13.4523 7.25011 12.6144 7.25 11.75V7.25H8.75V12.5H10.25V7.25H11.75V12.5H13.25V7.25H14.75V11.75C14.7499 12.6144 14.4513 13.4523 13.9046 14.1219C13.358 14.7915 12.5969 15.2518 11.75 15.425V15.425Z",
  },
  play_sport: {
    fill: "#FF4275",
    glyph:
      "M14 6.5C18.1422 6.5 21.5 9.85775 21.5 14C21.5 18.1422 18.1422 21.5 14 21.5C9.85775 21.5 6.5 18.1422 6.5 14C6.5 9.85775 9.85775 6.5 14 6.5ZM15.2525 17H12.7475L11.7125 18.4227L12.128 19.7023C12.7323 19.9002 13.3642 20.0007 14 20C14.6532 20 15.2825 19.895 15.872 19.7023L16.2867 18.4227L15.2517 17H15.2525ZM8.9705 13.154L8.0015 13.8568L8 14C8 15.2975 8.41175 16.4982 9.1115 17.48H10.544L11.5363 16.115L10.7652 13.7375L8.9705 13.154V13.154ZM19.0295 13.154L17.2347 13.7375L16.4637 16.115L17.4553 17.48H18.8878C19.6129 16.4646 20.0018 15.2477 20 14L19.9977 13.8575L19.0295 13.154V13.154ZM14 12.152L12.242 13.4285L12.914 15.5H15.0852L15.7573 13.4285L14 12.152ZM15.7183 8.24975L14.75 8.95475V10.8425L16.7705 12.3102L18.4498 11.765L18.8652 10.4877C18.091 9.4159 16.9849 8.62929 15.7183 8.24975V8.24975ZM12.281 8.24975C11.0146 8.62963 9.90871 9.41651 9.13475 10.4885L9.55025 11.765L11.2295 12.3102L13.25 10.8425V8.95475L12.281 8.24975V8.24975Z",
  },
  grab_drink: {
    fill: "#FA7319",
    glyph:
      "M17 14.75V8.75H9.5V14.75C9.5 15.1478 9.65804 15.5294 9.93934 15.8107C10.2206 16.092 10.6022 16.25 11 16.25H15.5C15.8978 16.25 16.2794 16.092 16.5607 15.8107C16.842 15.5294 17 15.1478 17 14.75ZM8.75 7.25H20C20.3978 7.25 20.7794 7.40804 21.0607 7.68934C21.342 7.97064 21.5 8.35218 21.5 8.75V11C21.5 11.3978 21.342 11.7794 21.0607 12.0607C20.7794 12.342 20.3978 12.5 20 12.5H18.5V14.75C18.5 15.5457 18.1839 16.3087 17.6213 16.8713C17.0587 17.4339 16.2956 17.75 15.5 17.75H11C10.2044 17.75 9.44129 17.4339 8.87868 16.8713C8.31607 16.3087 8 15.5457 8 14.75V8C8 7.80109 8.07902 7.61032 8.21967 7.46967C8.36032 7.32902 8.55109 7.25 8.75 7.25ZM18.5 8.75V11H20V8.75H18.5ZM6.5 19.25H20V20.75H6.5V19.25Z",
  },
  do_fun: {
    fill: "#7D52F4",
    glyph: "M14.75 12.5H20L13.25 22.25V15.5H8L14.75 5.75V12.5Z",
  },
};

export function VibeIcon({
  category,
  size = 36,
}: {
  category: CategoryId;
  size?: number;
}) {
  const tile = TILES[category];
  const fid = `vibe-inner-${category}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Dual inner shadow (top + bottom) — the glass treatment from the asset */}
        <filter
          id={fid}
          x="0"
          y="0"
          width="28"
          height="28"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="bg" />
          <feBlend mode="normal" in="SourceGraphic" in2="bg" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="shape" result="e1" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha2"
          />
          <feOffset dy="-4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha2" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="e1" result="e2" />
        </filter>
      </defs>
      <g filter={`url(#${fid})`}>
        <rect width="28" height="28" rx="7" fill={tile.fill} />
        <path d={tile.glyph} fill="white" />
      </g>
    </svg>
  );
}
