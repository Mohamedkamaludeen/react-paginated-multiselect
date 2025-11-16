import React from 'react';

interface SpinnerProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 18,
  className = '',
  style,
}) => {
  return (
    <div
      className={`rpms-spinner ${className}`}
      style={{
        width: size,
        height: size,
        ...style,
      }}
      role="status"
      aria-label="Loading"
    >
      <svg
        className="rpms-spinner-svg"
        viewBox="0 0 50 50"
      >
        <circle
          className="rpms-spinner-circle"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        />
      </svg>
    </div>
  );
};
