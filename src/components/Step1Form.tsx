import React, { useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';

import { step1DataAtom, validationErrorsAtom } from '../atoms/bookReviewAtoms';
import { ReadingStatus } from '../types/bookReview';
import { validateField } from '../utils/validation';
import { 
  readingStatusOptions,
  getStatusInfo,
  getDateHelpText,
  shouldDisableStartDate,
  shouldDisableEndDate,
  isStartDateRequired,
  isEndDateRequired
} from '../utils/readingStatus';
import { 
  FormRow, 
  Input, 
  Select, 
  Field, 
  ErrorMessage
} from './ui/FormField';

// DatePicker를 클라이언트에서만 로드
const ClientOnlyDatePicker = dynamic(
  () => import('./ClientOnlyDatePicker').then(mod => ({ default: mod.ClientOnlyDatePicker })),
  { 
    ssr: false,
    loading: () => (
      <input 
        type="text" 
        placeholder="날짜 선택..." 
        disabled 
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          backgroundColor: '#f9fafb',
          color: '#6b7280'
        }}
      />
    )
  }
);

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
`;

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



const StatusInfo = styled.div`
  background-color: #f0f9ff;
  border: 1px solid #e0f2fe;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #0369a1;
`;



export const Step1Form: React.FC = () => {
  const [step1Data, setStep1Data] = useAtom(step1DataAtom);
  const [validationErrors, setValidationErrors] = useAtom(validationErrorsAtom);

  // 에러 발생 시 첫 번째 에러 필드로 focus 이동
  useEffect(() => {
    if (validationErrors.length > 0) {
      const firstError = validationErrors[0];
      const errorField = document.getElementById(`field-${firstError.field.toLowerCase().replace(/\s+/g, '-')}`);
      if (errorField) {
        errorField.focus();
      }
    }
  }, [validationErrors]);

  const getFieldError = (fieldName: string) => {
    return validationErrors.find(error => error.field === fieldName)?.message;
  };

  const handleFieldChange = useCallback((fieldName: string, value: string | Date | null) => {
    setStep1Data({ [fieldName]: value });

    // 실시간 유효성 검증
    const error = validateField(fieldName, value, step1Data);
    setValidationErrors(prev => {
      const filtered = prev.filter(e => e.field !== fieldName);
      return error ? [...filtered, error] : filtered;
    });
  }, [step1Data, setStep1Data, setValidationErrors]);

  const handleReadingPeriodChange = useCallback((field: 'startDate' | 'endDate', value: Date | null) => {
    const newReadingPeriod = {
      ...step1Data.readingPeriod,
      [field]: value,
    };
    
    setStep1Data({ readingPeriod: newReadingPeriod });

    // 실시간 유효성 검증
    const newData = { ...step1Data, readingPeriod: newReadingPeriod };
    const error = validateField(field, value, newData);
    setValidationErrors(prev => {
      const filtered = prev.filter(e => e.field !== field);
      return error ? [...filtered, error] : filtered;
    });
  }, [step1Data, setStep1Data, setValidationErrors]);

  // 독서 상태 변경 시 날짜 필드 초기화
  useEffect(() => {
    if (shouldDisableStartDate(step1Data.readingStatus)) {
      if (step1Data.readingPeriod.startDate || step1Data.readingPeriod.endDate) {
        setStep1Data({
          readingPeriod: { startDate: null, endDate: null }
        });
      }
    }
  }, [step1Data.readingStatus, step1Data.readingPeriod, setStep1Data]);

  return (
    <FormContainer>
      <FormTitle>1단계: 도서 기본 정보</FormTitle>
      
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
          onChange={(e) => handleFieldChange('title', e.target.value)}
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
          onChange={(e) => handleFieldChange('author', e.target.value)}
          hasError={!!getFieldError('author')}
        />
      </Field>

      <FormRow>
        <Field label="출판사" id="field-publisher">
          <Input
            type="text"
            placeholder="출판사를 입력하세요"
            value={step1Data.publisher || ''}
            onChange={(e) => handleFieldChange('publisher', e.target.value)}
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
              handleFieldChange('totalPages', value);
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
            onChange={(date) => handleFieldChange('publishDate', date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="출판일을 선택하세요"
            maxDate={new Date()}
          />
        </DatePickerWrapper>
      </Field>

      <Field 
        label="독서 상태" 
        required
        id="field-readingstatus"
      >
        <Select
          value={step1Data.readingStatus}
          onChange={(e) => handleFieldChange('readingStatus', e.target.value as ReadingStatus)}
        >
          {readingStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>

      <StatusInfo>
        {getStatusInfo(step1Data.readingStatus)}
      </StatusInfo>

      <FormRow>
        <Field 
          label="독서 시작일"
          required={isStartDateRequired(step1Data.readingStatus)}
          disabled={shouldDisableStartDate(step1Data.readingStatus)}
          error={getFieldError('startDate')}
          helpText={getDateHelpText('start', step1Data.readingStatus)}
          id="field-startdate"
        >
          <DatePickerWrapper hasError={!!getFieldError('startDate')} isDisabled={shouldDisableStartDate(step1Data.readingStatus)}>
            <ClientOnlyDatePicker
              selected={step1Data.readingPeriod.startDate}
              onChange={(date) => handleReadingPeriodChange('startDate', date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="시작일을 선택하세요"
              disabled={shouldDisableStartDate(step1Data.readingStatus)}
              minDate={step1Data.publishDate || undefined}
              maxDate={step1Data.readingPeriod.endDate || new Date()}
            />
          </DatePickerWrapper>
        </Field>

        <Field 
          label="독서 종료일"
          required={isEndDateRequired(step1Data.readingStatus)}
          disabled={shouldDisableEndDate(step1Data.readingStatus)}
          error={getFieldError('endDate')}
          helpText={getDateHelpText('end', step1Data.readingStatus)}
          id="field-enddate"
        >
          <DatePickerWrapper hasError={!!getFieldError('endDate')} isDisabled={shouldDisableEndDate(step1Data.readingStatus)}>
            <ClientOnlyDatePicker
              selected={step1Data.readingPeriod.endDate}
              onChange={(date) => handleReadingPeriodChange('endDate', date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="종료일을 선택하세요"
              disabled={shouldDisableEndDate(step1Data.readingStatus)}
              minDate={step1Data.readingPeriod.startDate || step1Data.publishDate || undefined}
              maxDate={new Date()}
            />
          </DatePickerWrapper>
        </Field>
      </FormRow>

      {(getFieldError('readingPeriod') || getFieldError('dateRange')) && (
        <ErrorMessage>
          {getFieldError('readingPeriod') || getFieldError('dateRange')}
        </ErrorMessage>
      )}
    </FormContainer>
  );
}; 