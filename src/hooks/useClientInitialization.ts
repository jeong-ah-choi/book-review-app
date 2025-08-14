import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { bookReviewDataAtom, isClientInitializedAtom } from '../atoms/bookReviewAtoms';
import { getFromLocalStorage } from '../utils/localStorage';

export const useClientInitialization = () => {
  const [, setBookReviewData] = useAtom(bookReviewDataAtom);
  const [isClientInitialized, setIsClientInitialized] = useAtom(isClientInitializedAtom);

  useEffect(() => {
    // 클라이언트에서만 실행
    if (typeof window !== 'undefined' && !isClientInitialized) {
      const savedData = getFromLocalStorage();
      
      if (Object.keys(savedData).length > 0) {
        // localStorage에 저장된 데이터가 있으면 현재 상태와 병합
        setBookReviewData(prev => ({
          ...prev,
          ...savedData,
          step1: { ...prev.step1, ...savedData.step1 },
          step2: { ...prev.step2, ...savedData.step2 },
          step3: { ...prev.step3, ...savedData.step3 },
          step4: { ...prev.step4, ...savedData.step4 },
          step5: { ...prev.step5, ...savedData.step5 },
        }));
      }
      
      setIsClientInitialized(true);
    }
  }, [isClientInitialized, setBookReviewData, setIsClientInitialized]);

  return isClientInitialized;
}; 