import { FC, InputHTMLAttributes } from 'react';
import { Text } from '@telegram-apps/telegram-ui';
import './FormField.css';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
  isValid?: boolean;
}

export const FormField: FC<FormFieldProps> = ({
  label,
  error,
  helpText,
  isValid,
  id,
  required,
  className,
  ...inputProps
}) => {
  const fieldId = id || `field-${Math.random().toString(36).slice(2)}`;
  const errorId = `${fieldId}-error`;
  const helpTextId = `${fieldId}-help`;

  return (
    <div className={`form-field ${error ? 'form-field--error' : ''} ${isValid ? 'form-field--valid' : ''}`}>
      <label htmlFor={fieldId} className="form-field__label">
        {label}
        {required && <span className="form-field__required">*</span>}
      </label>
      
      <div className="form-field__input-wrapper">
        <input
          {...inputProps}
          id={fieldId}
          className={`form-field__input ${className || ''}`}
          aria-invalid={!!error}
          aria-describedby={`${error ? errorId : ''} ${helpText ? helpTextId : ''}`}
          required={required}
        />
        {isValid && (
          <svg className="form-field__valid-icon" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {error && (
        <Text id={errorId} className="form-field__error" role="alert">
          {error}
        </Text>
      )}
      
      {helpText && !error && (
        <Text id={helpTextId} className="form-field__help-text">
          {helpText}
        </Text>
      )}
    </div>
  );
};