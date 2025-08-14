import { Step1Data, ValidationError, StepValidationResult } from '../types/bookReview';

export const validateStep1 = (data: Step1Data): StepValidationResult => {
  const errors: ValidationError[] = [];

  // 필수 필드 검증
  if (!data.title.trim()) {
    errors.push({ field: 'title', message: '도서 제목을 입력해주세요.' });
  }

  if (!data.author.trim()) {
    errors.push({ field: 'author', message: '저자를 입력해주세요.' });
  }

  if (!data.publishDate) {
    errors.push({ field: 'publishDate', message: '출판일을 선택해주세요.' });
  }

  // 전체 페이지 수 검증 (선택사항이지만 입력된 경우 유효성 검사)
  if (data.totalPages !== undefined) {
    if (data.totalPages <= 0) {
      errors.push({ field: 'totalPages', message: '페이지 수는 1 이상의 양수를 입력해주세요.' });
    } else if (data.totalPages > 10000) {
      errors.push({ field: 'totalPages', message: '페이지 수는 10,000 이하로 입력해주세요.' });
    }
  }

  // 독서 상태별 날짜 검증
  const { readingStatus, readingPeriod } = data;
  const { startDate, endDate } = readingPeriod;

  switch (readingStatus) {
    case 'want-to-read':
      // 읽고 싶은 책: 독서 기간이 입력되면 안 됨
      if (startDate || endDate) {
        errors.push({
          field: 'readingPeriod',
          message: '"읽고 싶은 책" 상태에서는 독서 기간을 입력할 수 없습니다.',
        });
      }
      break;

    case 'reading':
      // 읽는 중: 시작일만 입력, 종료일 입력 금지
      if (!startDate) {
        errors.push({
          field: 'startDate',
          message: '"읽는 중" 상태에서는 독서 시작일을 입력해주세요.',
        });
      }
      if (endDate) {
        errors.push({
          field: 'endDate',
          message: '"읽는 중" 상태에서는 독서 종료일을 입력할 수 없습니다.',
        });
      }
      break;

    case 'read':
      // 읽음: 시작일과 종료일 모두 필수
      if (!startDate) {
        errors.push({
          field: 'startDate',
          message: '"읽음" 상태에서는 독서 시작일을 입력해주세요.',
        });
      }
      if (!endDate) {
        errors.push({
          field: 'endDate',
          message: '"읽음" 상태에서는 독서 종료일을 입력해주세요.',
        });
      }
      break;

    case 'on-hold':
      // 보류 중: 시작일만 입력, 종료일 입력 금지
      if (!startDate) {
        errors.push({
          field: 'startDate',
          message: '"보류 중" 상태에서는 독서 시작일을 입력해주세요.',
        });
      }
      if (endDate) {
        errors.push({
          field: 'endDate',
          message: '"보류 중" 상태에서는 독서 종료일을 입력할 수 없습니다.',
        });
      }
      break;
  }

  // 날짜 범위 검증
  if (startDate && endDate) {
    if (startDate > endDate) {
      errors.push({
        field: 'dateRange',
        message: '독서 시작일은 종료일보다 이후일 수 없습니다.',
      });
    }
  }

  // 독서 시작일과 출판일 비교
  if (startDate && data.publishDate) {
    if (startDate < data.publishDate) {
      errors.push({
        field: 'startDate',
        message: '독서 시작일은 도서 출판일 이후여야 합니다.',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 실시간 필드 검증 (개별 필드용)
export const validateField = (fieldName: string, value: string | Date | null | undefined, data: Step1Data): ValidationError | null => {
  switch (fieldName) {
    case 'title':
      return !value || typeof value !== 'string' || !value.trim() ? { field: 'title', message: '도서 제목을 입력해주세요.' } : null;
    
    case 'author':
      return !value || typeof value !== 'string' || !value.trim() ? { field: 'author', message: '저자를 입력해주세요.' } : null;
    
    case 'publishDate':
      return !value ? { field: 'publishDate', message: '출판일을 선택해주세요.' } : null;
    
    case 'totalPages':
      if (value !== undefined && value !== null && value !== '') {
        const pages = typeof value === 'string' ? parseInt(value, 10) : (typeof value === 'number' ? value : NaN);
        if (isNaN(pages) || pages <= 0) {
          return { field: 'totalPages', message: '페이지 수는 1 이상의 양수를 입력해주세요.' };
        }
        if (pages > 10000) {
          return { field: 'totalPages', message: '페이지 수는 10,000 이하로 입력해주세요.' };
        }
      }
      return null;
    
    case 'startDate':
      if (data.readingStatus === 'want-to-read' && value) {
        return { field: 'startDate', message: '"읽고 싶은 책" 상태에서는 독서 시작일을 입력할 수 없습니다.' };
      }
      if ((data.readingStatus === 'reading' || data.readingStatus === 'read' || data.readingStatus === 'on-hold') && !value) {
        return { field: 'startDate', message: '독서 시작일을 입력해주세요.' };
      }
      if (value && data.publishDate && value < data.publishDate) {
        return { field: 'startDate', message: '독서 시작일은 도서 출판일 이후여야 합니다.' };
      }
      return null;
    
    case 'endDate':
      if ((data.readingStatus === 'reading' || data.readingStatus === 'on-hold') && value) {
        return { field: 'endDate', message: `"${data.readingStatus === 'reading' ? '읽는 중' : '보류 중'}" 상태에서는 독서 종료일을 입력할 수 없습니다.` };
      }
      if (data.readingStatus === 'read' && !value) {
        return { field: 'endDate', message: '"읽음" 상태에서는 독서 종료일을 입력해주세요.' };
      }
      if (value && data.readingPeriod.startDate && value < data.readingPeriod.startDate) {
        return { field: 'endDate', message: '독서 종료일은 시작일 이후여야 합니다.' };
      }
      return null;
    
    default:
      return null;
  }
}; 