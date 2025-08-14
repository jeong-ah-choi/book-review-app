import React from 'react';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import styled from '@emotion/styled';

import { step1DataAtom, validationErrorsAtom } from '../../atoms/bookReviewAtoms';
import { validateField } from '../../utils/validation';
import { Field, FormRow, Input } from '../ui/FormField';
import { LoadingInput } from '../ui/LoadingInput';

// DatePicker를 클라이언트에서만 로드
const ClientOnlyDatePicker = dynamic(
  () => import('../ClientOnlyDatePicker').then(mod => ({ default: mod.ClientOnlyDatePicker })),
  { 
    ssr: false,
    loading: () => <LoadingInput placeholder="날짜 선택..." />
  }
);

const DatePickerWrapper = styled.div<{ hasError?: boolean; isDisabled?: boolean }>`
  transition: all 0.2s ease;
  opacity: ${({ isDisabled }) => isDisabled ? 0.6 : 1};
  
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid ${({ hasError, isDisabled }) => {
      if (isDisabled) return '#e5e7eb';
      return hasError ? '#ef4444' : '#d1d5db';
    }};
    border-radius: 0.375rem;
    font-size: 0.875rem;
    background-color: ${({ isDisabled }) => isDisabled ? '#f9fafb' : 'white'};
    color: ${({ isDisabled }) => isDisabled ? '#9ca3af' : '#374151'};
    cursor: ${({ isDisabled }) => isDisabled ? 'not-allowed' : 'pointer'};
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, background-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${({ hasError, isDisabled }) => {
        if (isDisabled) return '#e5e7eb';
        return hasError ? '#ef4444' : '#3b82f6';
      }};
      box-shadow: ${({ hasError, isDisabled }) => {
        if (isDisabled) return 'none';
        return hasError ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : '0 0 0 3px rgba(59, 130, 246, 0.1)';
      }};
    }
  }
`;

interface BasicInfoFormProps {
  onFieldChange: (fieldName: string, value: string | Date | null) => void;
  getFieldError: (fieldName: string) => string | undefined;
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ onFieldChange, getFieldError }) => {
  const [step1Data, setStep1Data] = useAtom(step1DataAtom);

  return (
    <>
      <Field 
        label="도서 제목" 
        required 
        error={getFieldError('title')}
        id="field-title"
      >
        <Input
          type="text"
          placeholder="도서 제목을 입력하세요"
          value={step1Data.title}
          onChange={(e) => onFieldChange('title', e.target.value)}
          hasError={!!getFieldError('title')}
        />
      </Field>

      <Field 
        label="저자" 
        required 
        error={getFieldError('author')}
        id="field-author"
      >
        <Input
          type="text"
          placeholder="저자명을 입력하세요"
          value={step1Data.author}
          onChange={(e) => onFieldChange('author', e.target.value)}
          hasError={!!getFieldError('author')}
        />
      </Field>

      <FormRow>
        <Field label="출판사" id="field-publisher">
          <Input
            type="text"
            placeholder="출판사를 입력하세요"
            value={step1Data.publisher || ''}
            onChange={(e) => onFieldChange('publisher', e.target.value)}
          />
        </Field>

        <Field 
          label="전체 페이지 수"
          error={getFieldError('totalPages')}
          id="field-totalpages"
        >
          <Input
            type="number"
            placeholder="페이지 수"
            value={step1Data.totalPages || ''}
            onChange={(e) => {
              const value = e.target.value;
              const pages = value ? parseInt(value, 10) : undefined;
              setStep1Data({ totalPages: pages });
              onFieldChange('totalPages', value);
            }}
            hasError={!!getFieldError('totalPages')}
            min="1"
            max="10000"
          />
        </Field>
      </FormRow>

      <Field 
        label="출판일" 
        required 
        error={getFieldError('publishDate')}
        id="field-publishdate"
      >
        <DatePickerWrapper hasError={!!getFieldError('publishDate')}>
          <ClientOnlyDatePicker
            selected={step1Data.publishDate}
            onChange={(date) => onFieldChange('publishDate', date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="출판일을 선택하세요"
            maxDate={new Date()}
          />
        </DatePickerWrapper>
      </Field>
    </>
  );
}; 