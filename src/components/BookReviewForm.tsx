import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';

import { StepIndicator } from './StepIndicator';
import { Step1Form } from './Step1Form';
import { currentStepAtom, step1DataAtom, validationErrorsAtom } from '../atoms/bookReviewAtoms';
import { validateStep1 } from '../utils/validation';
import { useClientInitialization } from '../hooks/useClientInitialization';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 2rem 1rem;
`;

const FormWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 0 2rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  
  ${({ variant = 'primary' }) => {
    if (variant === 'primary') {
      return `
        background-color: #3b82f6;
        color: white;
        
        &:hover:not(:disabled) {
          background-color: #2563eb;
        }
        
        &:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }
      `;
    } else {
      return `
        background-color: #6b7280;
        color: white;
        
        &:hover:not(:disabled) {
          background-color: #4b5563;
        }
        
        &:disabled {
          background-color: #e5e7eb;
          color: #9ca3af;
          cursor: not-allowed;
        }
      `;
    }
  }}
`;

const ErrorSummary = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 2rem;
`;

const ErrorTitle = styled.h3`
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ErrorList = styled.ul`
  color: #dc2626;
  font-size: 0.75rem;
  margin: 0;
  padding-left: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  font-size: 1rem;
  color: #6b7280;
`;

const TOTAL_STEPS = 5;

export const BookReviewForm: React.FC = () => {
  const router = useRouter();
  const isClientInitialized = useClientInitialization();
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);
  const [step1Data] = useAtom(step1DataAtom);
  const [validationErrors, setValidationErrors] = useAtom(validationErrorsAtom);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      router.push(`/book-review?step=${newStep}`, undefined, { shallow: true });
    }
  }, [currentStep, setCurrentStep, router]);

  const handleNext = useCallback(() => {
    // 현재 단계 유효성 검증
    if (currentStep === 1) {
      const validation = validateStep1(step1Data);
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        return;
      }
      setValidationErrors([]);
    }

    if (currentStep < TOTAL_STEPS) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      router.push(`/book-review?step=${newStep}`, undefined, { shallow: true });
    }
  }, [currentStep, step1Data, setCurrentStep, setValidationErrors, router]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Form />;
      case 2:
        return <div>2단계 - 도서 추천 여부, 별점 (준비 중)</div>;
      case 3:
        return <div>3단계 - 독후감 (준비 중)</div>;
      case 4:
        return <div>4단계 - 인용구 (준비 중)</div>;
      case 5:
        return <div>5단계 - 공개 여부 (준비 중)</div>;
      default:
        return <Step1Form />;
    }
  };

  // 클라이언트 초기화가 완료될 때까지 로딩 표시
  if (!isClientInitialized) {
    return (
      <Container>
        <LoadingContainer>
          데이터를 불러오는 중...
        </LoadingContainer>
      </Container>
    );
  }

  const hasErrors = validationErrors.length > 0;

  return (
    <Container>
      <FormWrapper>
        <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        
        {hasErrors && (
          <ErrorSummary>
            <ErrorTitle>다음 항목들을 확인해주세요:</ErrorTitle>
            <ErrorList>
              {validationErrors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ErrorList>
          </ErrorSummary>
        )}

        {renderCurrentStep()}

        <NavigationContainer>
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            이전 단계
          </Button>

          <Button
            variant="primary"
            onClick={handleNext}
            disabled={currentStep === TOTAL_STEPS}
          >
            {currentStep === TOTAL_STEPS ? '완료' : '다음 단계'}
          </Button>
        </NavigationContainer>
      </FormWrapper>
    </Container>
  );
}; 