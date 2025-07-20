import { BookReviewData } from '../types/bookReview';

const STORAGE_KEY = 'book-review-draft';

export const saveToLocalStorage = (data: Partial<BookReviewData>): void => {
  // 브라우저 환경에서만 실행
  if (typeof window === 'undefined') return;
  
  try {
    const existingData = getFromLocalStorage();
    const updatedData = { ...existingData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData, (key, value) => {
      // Date 객체를 ISO 문자열로 변환
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const getFromLocalStorage = (): Partial<BookReviewData> => {
  // 브라우저 환경에서만 실행
  if (typeof window === 'undefined') return {};
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return {};
    
    return JSON.parse(data, (key, value) => {
      // ISO 문자열을 Date 객체로 변환
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        return new Date(value);
      }
      return value;
    });
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return {};
  }
};

export const clearLocalStorage = (): void => {
  // 브라우저 환경에서만 실행
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

// 이 함수는 더 이상 사용하지 않음 (클라이언트 초기화 훅에서 처리)
export const getInitialBookReviewData = (): BookReviewData => {
  const savedData = getFromLocalStorage();
  
  return {
    currentStep: savedData.currentStep || 1,
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
      ...savedData.step1,
    },
    step2: {
      recommend: null,
      rating: 0,
      ...savedData.step2,
    },
    step3: {
      review: '',
      ...savedData.step3,
    },
    step4: {
      quotes: [],
      ...savedData.step4,
    },
    step5: {
      isPublic: false,
      ...savedData.step5,
    },
  };
}; 