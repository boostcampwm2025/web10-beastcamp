# 팀 맹수

# 티켓팅 시뮬레이터 (Ticketing Simulator)

> 실전과 가장 유사한 티켓팅 연습 환경을 제공하는 시뮬레이터

## 배포 주소

https://web10.site/

## 프로젝트 소개

**티켓팅 시뮬레이터**는 경쟁이 치열한 공연 티켓팅을 앞둔 사람들을 위한 실전 연습 서비스입니다.

단순한 클릭 게임이 아닌, **날짜 선택 예매버튼 활성화부터 좌석 선택 좌석 결제하러가기 버튼 클릭까지, 전체 E2E 프로세스**를 실제 환경과 유사하게 구현하는것이 목표입니다. 봇을 활용한 가상 트래픽 생성으로 실제 경쟁 상황을 재현하고, 단계별 소요 시간 분석을 통해 약점을 파악하고 개선할 수 있습니다.

### 해결하고자 하는 문제

**Problem**

- 티켓팅 성공률이 매우 낮고, 원하는 시간과 좌석을 선택하기 어렵습니다
- 티켓팅을 연습할 공간이 부족하고, 실패하면 다시 기회가 오지 않습니다

**Solution**

- 실제 티켓팅과 유사한 전체 과정을 무제한으로 반복 연습
- Agent 기반 가상 트래픽으로 실전과 동일한 경쟁 환경 제공
- 단계별 정밀한 피드백으로 개선점 파악 및 실력 향상

## 핵심 기능

### 1. 모의 티켓팅 시뮬레이션

실제 티켓팅 환경과 동일한 흐름으로 **예매 버튼 활성화 → 날짜/회차 선택 → 대기열 → 보안문자 → 좌석 선택 → 예매 완료**까지의 과정을 그대로 구현했습니다. 봇을 활용해 실제 상황과 유사한 수준의 가상 트래픽을 생성하여 실존 트래픽 경쟁에 가까운 환경을 제공합니다.

### 2. 티켓팅 결과 피드백 제공

각 단계별 소요 시간 측정(접속, 대기열, 보안문자, 좌석선택), 전체 소요 시간, 전체 사용자 대비 순위를 제공하여 자신의 약점을 파악하고 집중 연습할 수 있습니다.

### 3. 실제 티켓팅 정보 연동

현재 연습하는 공연의 실제 티켓팅 정보와 예정된 티켓팅 일정을 제공하여 실전 준비를 돕습니다.

### 4. 네트워크 환경 점검

현재 환경의 네트워크 속도·ping 값을 확인해 티켓팅 시 성공률에 중요한 네트워크 상태 정보를 표시합니다.

### 5. 실시간 트래픽 모니터링

인터파크·YES24·멜론티켓 등 실제 예매 사이트의 실시간 트래픽 유입량을 그래프로 시각화하여 현재 경쟁 강도를 예측할 수 있습니다.

## 기술 스택

<div>

### Frontend
<div>
  <img src="https://img.shields.io/badge/next.js-16.1.1-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/react-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/typescript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/tailwindcss-4.1.18-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
</div>
<div>
  <img src="https://img.shields.io/badge/tanstack%20query-5.90.12-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="TanStack Query"/>
</div>

### Backend
<div>
  <img src="https://img.shields.io/badge/nestjs-11.0.1-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"/>
  <img src="https://img.shields.io/badge/typescript-5.7.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/typeorm-0.3.28-FE0803?style=for-the-badge&logo=typeorm&logoColor=white" alt="TypeORM"/>
</div>

### Database
<div>
  <img src="https://img.shields.io/badge/mysql-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/redis-7.2-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis"/>
</div>

### DevOps
<div>
  <img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/naver%20cloud%20platform-03C75A?style=for-the-badge&logo=naver&logoColor=white" alt="NCP"/>
</div>

</div>


## 팀원 소개
<table>
  <!-- 사진 + 영어이름 -->
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/de6d9fe8-09df-4320-a688-4bdb42ac0470" width="120"><br>
      <b>Jerry</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/9a4c1b24-6dba-4146-925d-1ca42fc9e148" width="120"><br>
      <b>Parrot</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/eee30aa1-ecf8-46c8-8591-dc65ab354287" width="120"><br>
      <b>Happy</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/ac219718-515d-4183-b938-9eab324dfd28" width="120"><br>
      <b>Jude</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/0d5ac7dc-6fb4-4c1a-b9a4-057f09bcf186" width="120"><br>
      <b>Chad</b>
    </td>
  </tr>

  <!-- 캠퍼 ID (sub 전용 행) -->
  <tr>
    <td align="center"><a href="https://github.com/viixix">J285_함형민</a></td>
    <td align="center"><a href="https://github.com/flowersayo">J042_김서연</a></td>
    <td align="center"><a href="https://github.com/ParkTjgus">J110_박서현</a></td>
    <td align="center"><a href="https://github.com/JichanPark12">J124_박지찬</a></td>
    <td align="center"><a href="https://github.com/shininghyunho">J277_최현호</a></td>
  </tr>
</table>

---

## 프로젝트 구조

본 프로젝트는 MSA 환경에서의 모노레포 아키텍처로 구성되어 있습니다.

```
ticketing-system/
├── pnpm-workspace.yaml          # 모노레포 workspace 설정
├── package.json                 # 루트 package.json (모노레포 스크립트)
├── pnpm-lock.yaml              # 전역 lock file
│
├── frontend/                    # 프론트엔드 (Next.js)
│   ├── src/
│   └── package.json
│
├── backend/                     # 백엔드 서버들
│   ├── api-server/             # 일반 API 서버
│   │   ├── src/
│   │   └── package.json
│   │
│   └── ticket-server/          # 티켓 예매 전용 서버
│       ├── src/
│       └── package.json
│
├── queue-backend/              # 대기열 큐 서버
│   ├── src/
│   └── package.json
│
└── packages/                   # 공유 패키지
    └── shared-types/           # 공통 타입 정의
        ├── src/
        │   ├── booking.ts
        │   ├── queue.ts
        │   └── events.ts
        └── package.json
```

---

## 시작하기

### 1. 패키지 설치

프로젝트 루트에서 다음 명령어를 실행하여 모든 workspace의 의존성을 설치합니다.

```bash
pnpm install
```

모노레포 구조이므로 루트에서 한 번만 실행하면 모든 하위 프로젝트의 의존성이 자동으로 설치됩니다.

### 2. 개발 서버 실행

각 서버를 개별적으로 실행할 수 있습니다.

```bash
# API 서버 실행
pnpm dev:api

# 티켓 서버 실행
pnpm dev:ticket

# 대기열 큐 서버 실행
pnpm dev:queue

# 프론트엔드 실행
pnpm dev:frontend
```

### 3. 빌드

```bash
# API 서버 빌드
pnpm build:api

# 티켓 서버 빌드
pnpm build:ticket

# 대기열 큐 서버 빌드
pnpm build:queue

# 프론트엔드 빌드
pnpm build:frontend
```

### 4. 린트 실행

```bash
# API 서버 린트
pnpm lint:api

# 티켓 서버 린트
pnpm lint:ticket

# 대기열 큐 서버 린트
pnpm lint:queue

# 프론트엔드 린트
pnpm lint:frontend
```

---

## 공유 타입 패키지 사용하기

각 서버에서 공통 타입을 사용하려면 다음과 같이 import합니다.

```typescript
import { BookingRequest, QueueToken } from '@beastcamp/shared-types';
```

---

## 기술 스택

- **Frontend**: Next.js
- **Backend**: NestJS
- **Package Manager**: pnpm (모노레포)
- **Language**: TypeScript
