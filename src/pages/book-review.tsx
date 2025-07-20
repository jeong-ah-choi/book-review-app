import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import Head from 'next/head';

import { BookReviewForm } from '../components/BookReviewForm';
import { currentStepAtom } from '../atoms/bookReviewAtoms';

export default function BookReviewPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);

  useEffect(() => {
    // URL 쿼리 파라미터에서 step 읽기
    const stepFromQuery = router.query.step;
    if (stepFromQuery) {
      const step = parseInt(stepFromQuery as string, 10);
      if (step >= 1 && step <= 5 && step !== currentStep) {
        setCurrentStep(step);
      }
    } else if (router.isReady) {
      // 쿼리 파라미터가 없으면 현재 단계로 URL 업데이트
      router.replace(`/book-review?step=${currentStep}`, undefined, { shallow: true });
    }
  }, [router.query.step, router.isReady, currentStep, setCurrentStep]);

  // 초기 로딩 중일 때 빈 화면 표시
  if (!router.isReady) {
    return null;
  }

  return (
    <>
      <Head>
        <title>도서 리뷰 작성 - {currentStep}단계</title>
        <meta name="description" content="도서 리뷰를 단계별로 작성해보세요" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <BookReviewForm />
    </>
  );
} 