import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* Amber glow variables */
  :root {
    --amber-600: #ff6a00;
    --amber-500: #ff8a00;
    --amber-300: #ffc38a;
  }

  /* Keyframes for animations */
  @keyframes breathe {
    0%, 100% {
      box-shadow: 
        0 0 20px rgba(255, 106, 0, 0.3),
        0 0 40px rgba(255, 106, 0, 0.2),
        0 0 60px rgba(255, 106, 0, 0.1);
    }
    50% {
      box-shadow: 
        0 0 30px rgba(255, 106, 0, 0.4),
        0 0 50px rgba(255, 106, 0, 0.3),
        0 0 70px rgba(255, 106, 0, 0.2);
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Global button styles with warm orange/amber fill */
  button.button,
  [data-ambient="amber"] {
    position: relative;
    overflow: hidden;
    background: linear-gradient(
      135deg,
      var(--amber-600),
      var(--amber-500),
      var(--amber-300),
      var(--amber-500)
    );
    color: #000000;
    border: 1px solid var(--amber-600);
    border-radius: 9999px;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    animation: breathe 3s ease-in-out infinite;
    
    /* Focus styles - enhanced orange glow */
    &:focus-visible {
      outline: 3px solid var(--amber-600);
      outline-offset: 2px;
      box-shadow: 
        0 0 0 3px var(--amber-600),
        0 0 20px rgba(255, 106, 0, 0.6),
        0 0 40px rgba(255, 106, 0, 0.4),
        0 0 60px rgba(255, 106, 0, 0.2);
    }

    /* Hover styles - intensified orange glow */
    &:hover {
      transform: translateY(-2px);
      background: linear-gradient(
        135deg,
        #ff7a00,
        #ff9a00,
        #ffd38a,
        #ff9a00
      );
      box-shadow: 
        0 0 30px rgba(255, 106, 0, 0.7),
        0 0 50px rgba(255, 106, 0, 0.5),
        0 0 70px rgba(255, 106, 0, 0.3);
    }

    /* Orange glow effect layer */
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: conic-gradient(
        from 0deg,
        var(--amber-600),
        var(--amber-500),
        var(--amber-300),
        var(--amber-500),
        var(--amber-600)
      );
      border-radius: 9999px;
      z-index: -1;
      animation: spin 8s linear infinite;
      filter: blur(8px);
      pointer-events: none;
    }

    /* Hover glow effect layer - intensified orange */
    &::after {
      content: '';
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      background: conic-gradient(
        from 0deg,
        #ff7a00,
        #ff9a00,
        #ffd38a,
        #ff9a00,
        #ff7a00
      );
      border-radius: 9999px;
      z-index: -2;
      animation: spin 8s linear infinite;
      filter: blur(12px);
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    &:hover::after {
      opacity: 0.8;
    }

    &:focus-visible::after {
      opacity: 1;
    }
  }

  /* Dark mode button styles - orange with white text */
  html[data-theme="dark"] button.button,
  html[data-theme="dark"] [data-ambient="amber"] {
    background: linear-gradient(
      135deg,
      var(--amber-600),
      var(--amber-500),
      var(--amber-300),
      var(--amber-500)
    );
    color: #ffffff;
    border-color: var(--amber-600);
  }

  /* Light mode button styles - orange with black text */
  html[data-theme="light"] button.button,
  html[data-theme="light"] [data-ambient="amber"] {
    background: linear-gradient(
      135deg,
      var(--amber-600),
      var(--amber-500),
      var(--amber-300),
      var(--amber-500)
    );
    color: #000000;
    border-color: var(--amber-600);
  }

  /* Reduced motion fallback */
  @media (prefers-reduced-motion: reduce) {
    button.button,
    [data-ambient="amber"] {
      animation: none;
      
      &::before,
      &::after {
        animation: none;
      }
    }
  }

  /* Ensure buttons remain keyboard navigable */
  button.button:focus,
  [data-ambient="amber"]:focus {
    outline: none;
  }

  button.button:focus-visible,
  [data-ambient="amber"]:focus-visible {
    outline: 3px solid var(--amber-600);
    outline-offset: 2px;
  }
`;
