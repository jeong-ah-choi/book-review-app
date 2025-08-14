import { atom } from 'jotai';
import { BookReviewData, Step1Data, ValidationError } from '../types/bookReview';
import { saveToLocalStorage } from '../utils/localStorage';

// 기본 초기값 (서버/클라이언트 동일)
const getDefaultBookReviewData = (): BookReviewData => ({
  currentStep: 1,
  step1: {
    title: '',
    author: '',
    publisher: '',
    publishDate: null,
    totalPages: undefined,
    readingStatus: 'want-to-read' as const,
    readingPeriod: {
      startDate: null,
      endDate: null,
    },
  },
  step2: {
    recommend: null,
    rating: 0,
  },
  step3: {
    review: '',
  },
  step4: {
    quotes: [],
  },
  step5: {
    isPublic: false,
  },
});

// 메인 데이터 atom (초기값은 기본값 사용)
export const bookReviewDataAtom = atom<BookReviewData>(getDefaultBookReviewData());

// 현재 단계 atom
export const currentStepAtom = atom(
  (get) => get(bookReviewDataAtom).currentStep,
  (get, set, newStep: number) => {
    const currentData = get(bookReviewDataAtom);
    const updatedData = { ...currentData, currentStep: newStep };
    set(bookReviewDataAtom, updatedData);
    saveToLocalStorage({ currentStep: newStep });
  }
);

// Step 1 데이터 atom
export const step1DataAtom = atom(
  (get) => get(bookReviewDataAtom).step1,
  (get, set, newStep1Data: Partial<Step1Data>) => {
    const currentData = get(bookReviewDataAtom);
    const updatedStep1 = { ...currentData.step1, ...newStep1Data };
    const updatedData = { ...currentData, step1: updatedStep1 };
    set(bookReviewDataAtom, updatedData);
    saveToLocalStorage({ step1: updatedStep1 });
  }
);

// 유효성 검증 에러 atom
export const validationErrorsAtom = atom<ValidationError[]>([]);

// 로딩 상태 atom
export const isLoadingAtom = atom<boolean>(false);

// 클라이언트 초기화 완료 상태
export const isClientInitializedAtom = atom<boolean>(false); 