import React from 'react';
import styled from '@emotion/styled';

const StyledLoadingInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
  transition: all 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }
`;

interface LoadingInputProps {
  placeholder?: string;
}

export const LoadingInput: React.FC<LoadingInputProps> = ({ placeholder = "로딩 중..." }) => (
  <StyledLoadingInput 
    type="text" 
    placeholder={placeholder} 
    disabled 
  />
); 