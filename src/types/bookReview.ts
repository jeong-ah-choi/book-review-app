export type ReadingStatus = 'want-to-read' | 'reading' | 'read' | 'on-hold';

export interface BookBasicInfo {
  title: string;
  author: string;
  publisher?: string;
  publishDate: Date | null;
  totalPages?: number;
}

export interface ReadingPeriod {
  startDate: Date | null;
  endDate: Date | null;
}

export interface Step1Data extends BookBasicInfo {
  readingStatus: ReadingStatus;
  readingPeriod: ReadingPeriod;
}

export interface Step2Data {
  recommend: boolean | null;
  rating: number;
}

export interface Step3Data {
  review: string;
}

export interface Step4Data {
  quotes: Array<{
    text: string;
    page?: number;
  }>;
}

export interface Step5Data {
  isPublic: boolean;
}

export interface BookReviewData {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  step5: Step5Data;
  currentStep: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface StepValidationResult {
  isValid: boolean;
  errors: ValidationError[];
} 