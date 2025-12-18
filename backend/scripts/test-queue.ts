import { Redis } from 'ioredis';

// Redis 설정
const REDIS_HOST = 'localhost';
const REDIS_PORT_WAIT = 6380;
//const REDIS_PASSWORD_WAIT = 'redis_password_wait';

const waitRedis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT_WAIT,
  //password: REDIS_PASSWORD_WAIT,
});

// 설정값
const TOTAL_USERS = 200; // 전체 유저 수 늘림
const MAX_CAPACITY = 5; // 입장 정원
const EXIT_COUNT = 20; // 퇴장 시뮬레이션 횟수

async function main() {
  console.log('🎠 대기열 시뮬레이션 시작\n');

  // 1. 초기화
  await waitRedis.flushall();
  console.log('🧹 Redis 데이터 초기화 완료\n');

  // 2. 대규모 유저 등록 시뮬레이션 (동시성 느낌)
  console.log(`🏃 유저 ${TOTAL_USERS}명 대기열 진입 시도...`);

  const users = Array.from({ length: TOTAL_USERS }, (_, i) => `User${i + 1}`);
  let score = 0;

  // 한 번에 등록하는 것처럼 빠르게 처리 (Promise.all)
  await Promise.all(
    users.map(async (user) => {
      // 1~5ms 랜덤 지연으로 실제 상황 흉내
      await new Promise((r) => setTimeout(r, Math.random() * 5));
      //const timestamp = Date.now() + index; // 순서 보장용 미세 조정
      await waitRedis.zadd('queue:waiting', score, user);
      score++;
    }),
  );

  console.log(`✅ ${TOTAL_USERS}명 대기열 등록 완료\n`);

  // 3. 1차 입장 확인 (Worker 동작 대기)
  console.log(`⏳ Worker가 초기 정원(${MAX_CAPACITY}명) 채우는 중...`);
  await sleep(2000);

  let activeUsers = await waitRedis.zrange('queue:active', 0, -1);
  console.log(
    `🎉 1차 입장 완료: [ ${activeUsers.join(', ')} ] (${activeUsers.length}명)\n`,
  );

  // 4. 지속적인 퇴장 및 순환 시뮬레이션
  console.log('🔄 퇴장 및 순환 시작 (User1부터 순차적으로 퇴장)');

  // 입장한 유저들을 한 명씩 퇴장시킴
  for (let i = 0; i < EXIT_COUNT; i++) {
    // 현재 입장 중인 유저 중 한 명 선택 (가장 먼저 들어온 사람)
    activeUsers = await waitRedis.zrange('queue:active', 0, -1);

    if (activeUsers.length === 0) break;

    const leavingUser = activeUsers[0]; // 선입선출 퇴장
    console.log(`👋 ${leavingUser} 퇴장 신호 전송 -> 빈자리 발생!`);
    await waitRedis.publish('channel:finish', leavingUser);

    // Worker 반응 대기 (처리 속도 확인)
    await sleep(1500);

    // 상태 확인
    const currentActive = await waitRedis.zrange('queue:active', 0, -1);
    const waitingCount = await waitRedis.zcard('queue:waiting');

    console.log(`   👉 현재 입장: [ ${currentActive.join(', ')} ]`);
    console.log(`   👉 남은 대기: ${waitingCount}명`);
    console.log('------------------------------------------------');
  }

  // 5. 최종 상태 점검
  const finalActive = await waitRedis.zrange('queue:active', 0, -1);
  const finalWaiting = await waitRedis.zrange('queue:waiting', 0, -1);
  const finalWaitingCount = await waitRedis.zcard('queue:waiting');

  console.log('\n📊 최종 리포트');
  console.log('------------------------------------------------');
  console.log(`[🎪 활성 큐] 입장 중인 유저 (${finalActive.length}명):`);
  console.log(`   👉 [ ${finalActive.join(', ')} ]`);

  console.log(`\n[⏳ 대기 큐] 기다리는 유저 (${finalWaitingCount}명):`);
  // 대기 유저가 너무 많으면 앞부분만 출력
  const displayWaiting =
    finalWaiting.length > 10
      ? [...finalWaiting.slice(0, 10), '...']
      : finalWaiting;
  console.log(`   👉 [ ${displayWaiting.join(', ')} ]`);
  console.log('------------------------------------------------');

  // 6. 스케줄러(Interval) 동작 테스트
  console.log('\n🧪 스케줄러(Interval) 동작 테스트 시작...');

  if (finalActive.length > 0) {
    const forcedLeaver = finalActive[0];
    // 이벤트 없이 강제로 삭제 (Redis에서 직접 삭제)
    await waitRedis.zrem('queue:active', forcedLeaver);
    console.log(`👋 ${forcedLeaver} 강제 퇴장 (이벤트 발행 X)`);

    console.log('⏳ 스케줄러가 감지할 때까지 대기 중... (2초)');
    await sleep(2000);

    const afterSchedulerActive = await waitRedis.zrange('queue:active', 0, -1);
    console.log(
      `🎉 스케줄러 처리 후 입장 목록: [ ${afterSchedulerActive.join(', ')} ] (${afterSchedulerActive.length}명)`,
    );

    if (afterSchedulerActive.length === 10) {
      console.log('✅ 테스트 성공: 스케줄러가 빈자리를 자동으로 채웠습니다!');
    } else {
      console.log(
        '❌ 테스트 실패: 스케줄러가 작동하지 않았거나 빈자리가 채워지지 않았습니다.',
      );
    }
  } else {
    console.log('⚠️ 활성 유저가 없어서 스케줄러 테스트를 건너뜁니다.');
  }

  console.log('\n✨ 시뮬레이션 종료');
  process.exit(0);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

main().catch(console.error);
