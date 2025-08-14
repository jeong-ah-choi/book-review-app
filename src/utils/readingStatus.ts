import { ReadingStatus } from '../types/bookReview';

export const readingStatusOptions: { value: ReadingStatus; label: string }[] = [
  { value: 'want-to-read', label: '읽고 싶은 책' },
  { value: 'reading', label: '읽는 중' },
  { value: 'read', label: '읽음' },
  { value: 'on-hold', label: '보류 중' },
];

// 독서 상태별 안내 메시지
export const getStatusInfo = (status: ReadingStatus): string => {
  switch (status) {
    case 'want-to-read':
      return '📚 읽고 싶은 책으로 설정되었습니다. 독서 기간은 입력하지 않습니다.';
    case 'reading':
      return '📖 현재 읽고 있는 책입니다. 독서 시작일만 입력해주세요.';
    case 'read':
      return '✅ 완독한 책입니다. 독서 시작일과 종료일을 모두 입력해주세요.';
    case 'on-hold':
      return '⏸️ 잠시 중단한 책입니다. 독서 시작일만 입력해주세요.';
    default:
      return '';
  }
};

// 날짜 필드별 도움말 텍스트
export const getDateHelpText = (fieldType: 'start' | 'end', status: ReadingStatus): string => {
  if (fieldType === 'start') {
    switch (status) {
      case 'want-to-read':
        return '읽고 싶은 책 상태에서는 입력할 수 없습니다.';
      case 'reading':
        return '독서를 시작한 날짜를 선택해주세요.';
      case 'read':
        return '독서를 시작한 날짜를 선택해주세요.';
      case 'on-hold':
        return '독서를 시작한 날짜를 선택해주세요.';
      default:
        return '';
    }
  } else {
    switch (status) {
      case 'want-to-read':
        return '읽고 싶은 책 상태에서는 입력할 수 없습니다.';
      case 'reading':
        return '아직 읽고 있는 책이므로 입력할 수 없습니다.';
      case 'read':
        return '독서를 완료한 날짜를 선택해주세요.';
      case 'on-hold':
        return '중단한 책이므로 입력할 수 없습니다.';
      default:
        return '';
    }
  }
};

// 독서 상태에 따른 날짜 필드 비활성화 여부 확인
export const shouldDisableStartDate = (status: ReadingStatus): boolean => {
  return status === 'want-to-read';
};

export const shouldDisableEndDate = (status: ReadingStatus): boolean => {
  return ['want-to-read', 'reading', 'on-hold'].includes(status);
};

// 독서 상태에 따른 날짜 필드 필수 여부 확인
export const isStartDateRequired = (status: ReadingStatus): boolean => {
  return ['reading', 'read', 'on-hold'].includes(status);
};

export const isEndDateRequired = (status: ReadingStatus): boolean => {
  return status === 'read';
}; 