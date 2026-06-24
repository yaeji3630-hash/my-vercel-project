# TastyGo Delivery App

Next.js, Prisma, PostgreSQL, Docker, and Vercel로 구성한 배달앱 기말 프로젝트입니다.

## 필수 기능

- 회원가입, 로그인, 로그아웃
- 식당 목록과 메뉴 목록을 데이터베이스에서 조회
- 메뉴를 장바구니에 담기
- 주문 내용을 데이터베이스에 저장
- 로그인한 사용자의 주문 내역 조회

## 로컬 실행

Docker를 사용해 웹 앱과 PostgreSQL을 함께 실행합니다.

```bash
make up
```

브라우저에서 `http://localhost:3001`을 엽니다.

종료할 때는 아래 명령을 사용합니다.

```bash
make down
```

`make up`은 컨테이너를 빌드하고, Prisma migration을 적용한 뒤 seed 데이터까지 넣습니다.

## Vercel 배포

Vercel에서는 Docker Compose를 사용하지 않고 Next.js 앱으로 배포합니다.

Vercel 환경변수:

```env
DATABASE_URL=Neon PostgreSQL connection string
NEXTAUTH_SECRET=long random secret
```

배포 전 운영 DB에는 아래 명령으로 migration을 적용합니다.

```bash
pnpm prisma migrate deploy
```

## 주요 개발 도구

- 개발: 바이브 코딩
- 프레임워크: Next.js 풀스택
- 로컬 실행: Docker Compose, Makefile
- 데이터베이스: PostgreSQL, Prisma ORM
- 배포: GitHub -> Vercel
