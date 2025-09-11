import React from 'react';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const StyledButton = styled.button<ButtonProps>`
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    var(--amber-600) 0%,
    var(--amber-500) 45%,
    var(--amber-300) 100%
  );
  color: #000000;
  border: 1px solid var(--amber-600);
  border-radius: 9999px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: breathe 3s ease-in-out infinite;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  
  /* Size variants */
  ${props => {
    switch (props.size) {
      case 'sm':
        return `
          padding: 8px 16px;
          font-size: 14px;
        `;
      case 'lg':
        return `
          padding: 16px 32px;
          font-size: 18px;
        `;
      default: // md
        return `
          padding: 12px 24px;
          font-size: 16px;
        `;
    }
  }}

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
      var(--amber-600) 0%,
      var(--amber-500) 45%,
      var(--amber-300) 100%
    );
    box-shadow:
      0 0 0 2px #fff,
      0 0 0 4px var(--amber-500),
      0 8px 26px rgba(0,0,0,.18),
      0 0 36px color-mix(in srgb, var(--amber-500) 35%, transparent);
  }

  /* Amber glow effect layer */
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: conic-gradient(
      from 0deg,
      var(--amber-600) 0%,
      var(--amber-500) 35%,
      var(--amber-300) 70%,
      var(--amber-600) 100%
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
      var(--amber-600) 0%,
      var(--amber-500) 35%,
      var(--amber-300) 70%,
      var(--amber-600) 100%
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

  /* Dark mode styles - orange with white text */
  html[data-theme="dark"] & {
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

  /* Light mode styles - orange with black text */
  html[data-theme="light"] & {
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
    animation: none;
    
    &::before,
    &::after {
      animation: none;
    }
  }

  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    animation: none;
    
    &::before,
    &::after {
      animation: none;
    }
  }
`;

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant: _variant = 'primary', 
  size = 'md', 
  className = '',
  ...props 
}) => {
  return (
    <StyledButton
      className={`button ${className}`}
      size={size}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
