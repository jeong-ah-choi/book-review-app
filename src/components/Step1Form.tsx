import React, { useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';

import { step1DataAtom, validationErrorsAtom } from '../atoms/bookReviewAtoms';
import { validateField } from '../utils/validation';
import { shouldDisableStartDate } from '../utils/readingStatus';
import { ErrorMessage } from './ui/FormField';
import { BasicInfoForm } from './step1/BasicInfoForm';
import { ReadingStatusForm } from './step1/ReadingStatusForm';

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
      
      <BasicInfoForm 
        onFieldChange={handleFieldChange}
        getFieldError={getFieldError}
      />

      <ReadingStatusForm 
        onFieldChange={handleFieldChange}
        onReadingPeriodChange={handleReadingPeriodChange}
        getFieldError={getFieldError}
      />

      {(getFieldError('readingPeriod') || getFieldError('dateRange')) && (
        <ErrorMessage>
          {getFieldError('readingPeriod') || getFieldError('dateRange')}
        </ErrorMessage>
      )}
    </FormContainer>
  );
}; 