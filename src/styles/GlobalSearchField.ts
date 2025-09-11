import { createGlobalStyle, keyframes } from "styled-components";

const breathe = keyframes`
  0%,100% { box-shadow: 0 0 0 rgba(255,138,0,0), 0 0 0 rgba(255,208,153,0); }
  50%     { box-shadow: 0 0 24px rgba(255,138,0,.28), 0 0 60px rgba(255,208,153,.18); }
`;

export const GlobalSearchField = createGlobalStyle`
  :root{
    --amber-600:#F77E2D; --amber-500:#FF9A54; --amber-300:#FFD1B0;
    --cosmic-700:#C96522; --cosmic-600:#F77E2D; --cosmic-500:#FF9A54; --cosmic-300:#FFD1B0;
    --sf-bg:#f1f1f1; --sf-text:#111; --sf-wrap:rgba(255,255,255,.35);
  }
  [data-theme="dark"]{
    --sf-bg:#141414; --sf-text:#fafafa; --sf-wrap:rgba(255,255,255,.06);
    --amber-600:#F77E2D; --amber-500:#FF8E40; --amber-300:#FFC8A0;
  }

  .search-field__wrap{
    position: relative;
    display: flex; align-items: center;
    padding: 12px; border-radius: 20px;
    background: var(--sf-wrap);
    transition: box-shadow .25s ease, background .25s ease;
    will-change: box-shadow;
    /* Always-on subtle amber halo */
    box-shadow:
      0 0 0 rgba(0,0,0,0),
      0 0 28px rgba(255,138,0,.18),
      0 0 64px rgba(255,208,153,.14);
  }
  .search-field__wrap::before{
    content:"";
    position:absolute; inset:0; z-index:-1; border-radius:20px; filter: blur(22px);
    background:
      radial-gradient(40% 40% at 30% 70%, color-mix(in srgb, var(--amber-600) 28%, transparent), transparent 70%),
      radial-gradient(35% 35% at 70% 30%, color-mix(in srgb, var(--amber-300) 22%, transparent), transparent 70%);
  }

  /* The input itself: neumorphic depth with inset shadow */
  .search-field,
  .search-field__wrap input,
  .search-field__wrap select {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    border: 0; outline: 0;
    border-radius: 18px;
    padding: 0.85em 1em;
    background: var(--sf-bg);
    color: var(--sf-text);
    box-shadow: inset 2px 5px 10px rgba(0,0,0,.30);
    transition: transform .18s ease, background .2s ease, color .2s ease, box-shadow .25s ease;
  }

  /* Hover keeps depth; slight lift via outer soft shadow */
  .search-field:hover,
  .search-field__wrap:hover input,
  .search-field__wrap:hover select {
    box-shadow:
      inset 2px 5px 10px rgba(0,0,0,.30),
      0 2px 10px rgba(0,0,0,.10);
  }

  /* Focus: scale + amber ring and glow */
  .search-field:focus,
  .search-field:focus-visible,
  .search-field__wrap:has(input:focus),
  .search-field__wrap:has(select:focus){
    transform: scale(1.03);
    background: var(--sf-bg);
    box-shadow:
      inset 2px 5px 10px rgba(0,0,0,.28),
      0 0 0 2px #fff,
      0 0 0 4px var(--amber-500),
      0 8px 26px rgba(0,0,0,.18),
      0 0 36px color-mix(in srgb, var(--amber-500) 35%, transparent);
  }

  /* Intensify while focused */
  .search-field__wrap:has(input:focus),
  .search-field__wrap:has(select:focus){
    box-shadow:
      0 0 0 rgba(0,0,0,0),
      0 0 34px rgba(255,138,0,.22),
      0 0 80px rgba(255,208,153,.18);
  }

  /* No animation variant: always lit */
`;

export default GlobalSearchField;


