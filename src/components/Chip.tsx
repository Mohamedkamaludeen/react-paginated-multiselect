import React from 'react';

interface ChipProps {
  label: string;
  onDelete?: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  onDelete,
  disabled = false,
  className = '',
  style,
}) => {
  return (
    <div
      className={`rpms-chip ${disabled ? 'rpms-chip-disabled' : ''} ${className}`}
      style={style}
    >
      <span className="rpms-chip-label">{label}</span>
      {onDelete && !disabled && (
        <button
          className="rpms-chip-delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Remove"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
};
