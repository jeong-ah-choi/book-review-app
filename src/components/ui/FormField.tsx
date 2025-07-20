import React from 'react';
import styled from '@emotion/styled';

// Base styles for form inputs
const inputStyles = `
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

// Styled Components
export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  ${inputStyles}
  border: 1px solid ${({ hasError }) => hasError ? '#ef4444' : '#d1d5db'};

  &:focus {
    border-color: ${({ hasError }) => hasError ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 0 0 3px ${({ hasError }) => hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }
`;

const StyledSelect = styled.select<{ hasError?: boolean }>`
  ${inputStyles}
  border: 1px solid ${({ hasError }) => hasError ? '#ef4444' : '#d1d5db'};
  background-color: white;

  &:focus {
    border-color: ${({ hasError }) => hasError ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 0 0 3px ${({ hasError }) => hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }
`;

const LabelContainer = styled.label<{ isDisabled?: boolean }>`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ isDisabled }) => isDisabled ? '#9ca3af' : '#374151'};
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;
`;

const RequiredMark = styled.span`
  color: #ef4444;
  margin-left: 0.25rem;
`;

const OptionalMark = styled.span`
  color: #9ca3af;
  margin-left: 0.25rem;
  font-weight: 400;
`;

const DisabledMark = styled.span`
  color: #9ca3af;
  margin-left: 0.25rem;
  font-weight: 400;
`;

export const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

export const HelpText = styled.div`
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  font-style: italic;
`;

// Component Props
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
  children: React.ReactNode;
}

interface FieldLabelProps {
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  htmlFor?: string;
}

// Components
export const Input: React.FC<InputProps> = ({ hasError, ...props }) => (
  <StyledInput hasError={hasError} {...props} />
);

export const Select: React.FC<SelectProps> = ({ hasError, children, ...props }) => (
  <StyledSelect hasError={hasError} {...props}>
    {children}
  </StyledSelect>
);

export const FieldLabel: React.FC<FieldLabelProps> = ({ 
  children, 
  required, 
  optional, 
  disabled, 
  htmlFor 
}) => (
  <LabelContainer isDisabled={disabled} htmlFor={htmlFor}>
    {children}
    {disabled && <DisabledMark>(입력 불가)</DisabledMark>}
    {!disabled && required && <RequiredMark>*</RequiredMark>}
    {!disabled && !required && optional && <OptionalMark>(선택사항)</OptionalMark>}
  </LabelContainer>
);

// Complete Field component that combines label, input, and error message
interface FieldProps {
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({
  label,
  error,
  helpText,
  required,
  disabled,
  children
}) => (
  <FormGroup>
    <FieldLabel required={required} disabled={disabled}>
      {label}
    </FieldLabel>
    {children}
    {error && <ErrorMessage>{error}</ErrorMessage>}
    {helpText && <HelpText>{helpText}</HelpText>}
  </FormGroup>
); 