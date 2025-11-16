import React from 'react';

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  indeterminate = false,
  onChange,
  disabled = false,
  className = '',
  style,
}) => {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <div
      className={`rpms-checkbox ${checked ? 'rpms-checkbox-checked' : ''} ${
        indeterminate ? 'rpms-checkbox-indeterminate' : ''
      } ${disabled ? 'rpms-checkbox-disabled' : ''} ${className}`}
      onClick={handleClick}
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      style={style}
    >
      <span className="rpms-checkbox-inner">
        {indeterminate ? (
          <span className="rpms-checkbox-indeterminate-icon">−</span>
        ) : checked ? (
          <span className="rpms-checkbox-check-icon">✓</span>
        ) : null}
      </span>
    </div>
  );
};
