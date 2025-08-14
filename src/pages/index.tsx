import React from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import Head from 'next/head';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const MainCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const StartButton = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  text-align: left;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: #4b5563;
  font-size: 0.875rem;
  
  &::before {
    content: "📚";
    margin-right: 0.75rem;
    font-size: 1rem;
  }
`;

export default function Home() {
  return (
    <>
      <Head>
        <title>도서 리뷰 앱</title>
        <meta name="description" content="나만의 도서 리뷰를 단계별로 작성해보세요" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Container>
        <MainCard>
          <Title>📖 도서 리뷰</Title>
          <Subtitle>
            읽은 책에 대한 생각을 체계적으로 정리하고<br />
            나만의 독서 기록을 만들어보세요
          </Subtitle>
          
          <FeatureList>
            <FeatureItem>도서 기본 정보 및 독서 상태 관리</FeatureItem>
            <FeatureItem>별점과 추천 여부 평가</FeatureItem>
            <FeatureItem>독후감 작성</FeatureItem>
            <FeatureItem>인상 깊은 인용구 수집</FeatureItem>
            <FeatureItem>공개/비공개 설정</FeatureItem>
          </FeatureList>
          
          <Link href="/book-review?step=1">
            <StartButton>
              리뷰 작성 시작하기
            </StartButton>
          </Link>
        </MainCard>
      </Container>
    </>
  );
}
