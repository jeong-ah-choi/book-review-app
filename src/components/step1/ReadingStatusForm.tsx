import React from 'react';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import styled from '@emotion/styled';

import { step1DataAtom } from '../../atoms/bookReviewAtoms';
import { 
  readingStatusOptions,
  getStatusInfo,
  getDateHelpText,
  shouldDisableStartDate,
  shouldDisableEndDate,
  isStartDateRequired,
  isEndDateRequired
} from '../../utils/readingStatus';
import { Field, FormRow, Select } from '../ui/FormField';

// DatePicker를 클라이언트에서만 로드
const ClientOnlyDatePicker = dynamic(
  () => import('../ClientOnlyDatePicker').then(mod => ({ default: mod.ClientOnlyDatePicker })),
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

const StatusInfo = styled.div`
  background-color: #f0f9ff;
  border: 1px solid #e0f2fe;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #0369a1;
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

interface ReadingStatusFormProps {
  onFieldChange: (fieldName: string, value: string | Date | null) => void;
  onReadingPeriodChange: (field: 'startDate' | 'endDate', value: Date | null) => void;
  getFieldError: (fieldName: string) => string | undefined;
}

export const ReadingStatusForm: React.FC<ReadingStatusFormProps> = ({ 
  onFieldChange, 
  onReadingPeriodChange, 
  getFieldError 
}) => {
  const [step1Data] = useAtom(step1DataAtom);

  return (
    <>
      <Field 
        label="독서 상태" 
        required
        id="field-readingstatus"
      >
        <Select
          value={step1Data.readingStatus}
          onChange={(e) => onFieldChange('readingStatus', e.target.value)}
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
              onChange={(date) => onReadingPeriodChange('startDate', date)}
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
              onChange={(date) => onReadingPeriodChange('endDate', date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="종료일을 선택하세요"
              disabled={shouldDisableEndDate(step1Data.readingStatus)}
              minDate={step1Data.readingPeriod.startDate || step1Data.publishDate || undefined}
              maxDate={new Date()}
            />
          </DatePickerWrapper>
        </Field>
      </FormRow>
    </>
  );
}; 