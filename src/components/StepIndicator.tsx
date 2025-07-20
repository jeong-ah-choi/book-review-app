import React from 'react';
import styled from '@emotion/styled';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
`;

const StepContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StepCircle = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  ${({ isActive, isCompleted }) => {
    if (isCompleted) {
      return `
        background-color: #10b981;
        color: white;
        border: 2px solid #10b981;
      `;
    } else if (isActive) {
      return `
        background-color: #3b82f6;
        color: white;
        border: 2px solid #3b82f6;
      `;
    } else {
      return `
        background-color: #f3f4f6;
        color: #6b7280;
        border: 2px solid #e5e7eb;
      `;
    }
  }}
`;

const StepConnector = styled.div<{ isCompleted: boolean }>`
  width: 3rem;
  height: 2px;
  margin: 0 0.5rem;
  transition: all 0.2s ease;
  
  ${({ isCompleted }) => 
    isCompleted 
      ? 'background-color: #10b981;' 
      : 'background-color: #e5e7eb;'
  }
`;

const StepLabel = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  color: ${({ isActive }) => isActive ? '#3b82f6' : '#6b7280'};
`;

const StepWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const stepLabels = [
  '도서 정보',
  '평가',
  '독후감',
  '인용구',
  '공개 설정'
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <Container>
      <StepContainer>
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <React.Fragment key={stepNumber}>
              <StepWrapper>
                <StepCircle isActive={isActive} isCompleted={isCompleted}>
                  {isCompleted ? '✓' : stepNumber}
                </StepCircle>
                <StepLabel isActive={isActive}>
                  {stepLabels[index]}
                </StepLabel>
              </StepWrapper>
              {stepNumber < totalSteps && (
                <StepConnector isCompleted={isCompleted} />
              )}
            </React.Fragment>
          );
        })}
      </StepContainer>
    </Container>
  );
}; 