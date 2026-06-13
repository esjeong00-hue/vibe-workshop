// signups 테이블 행 타입 및 집계 헬퍼 (순수 함수 — UI/차트와 분리)

export type Signup = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  department: string;
  position: string;
  ai_experience: string;
  learning_goal: string;
  dietary_restrictions: string | null;
};

// 설문 폼 기준 고정 카테고리 (차트 라벨 순서 기준)
export const DEPARTMENTS = [
  "프로덕트",
  "마케팅",
  "세일즈",
  "컨설팅",
  "개발",
  "디자인",
  "경영지원",
  "기타",
] as const;

export const AI_EXPERIENCES = [
  "처음이에요",
  "ChatGPT 정도 써봤어요",
  "Claude도 써봤어요",
  "Claude Code까지 써봤어요",
] as const;

export const LEARNING_GOALS = [
  "업무 자동화",
  "데이터 분석",
  "웹서비스 만들기",
  "AI 도구 전반",
  "기타",
] as const;

export type CategoryCount = { labels: string[]; data: number[] };

// 고정 카테고리 기준으로 개수를 세고, 예상 밖 값은 "기타"로 처리.
// "기타"가 카테고리에 없으면 필요 시 끝에 추가한다.
export function countByCategory(
  rows: Signup[],
  key: "department" | "ai_experience" | "learning_goal",
  categories: readonly string[]
): CategoryCount {
  const counts: Record<string, number> = Object.fromEntries(
    categories.map((c) => [c, 0])
  );
  let other = 0;

  for (const row of rows) {
    const value = row[key];
    if (value in counts) counts[value] += 1;
    else other += 1;
  }

  const labels = [...categories];
  const data = categories.map((c) => counts[c]);

  if (other > 0) {
    const idx = labels.indexOf("기타");
    if (idx >= 0) data[idx] += other;
    else {
      labels.push("기타");
      data.push(other);
    }
  }

  return { labels, data };
}

// 가장 많은 카테고리. 동률이면 카테고리 순서상 먼저 오는 값을 안정적으로 반환.
// 데이터가 0건이면 "-".
export function topCategory(count: CategoryCount): string {
  let best = -1;
  let bestLabel = "-";
  for (let i = 0; i < count.data.length; i += 1) {
    if (count.data[i] > best) {
      best = count.data[i];
      bestLabel = count.labels[i];
    }
  }
  return best > 0 ? bestLabel : "-";
}

// Asia/Seoul 기준 YYYY-MM-DD 문자열
export function seoulDate(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  // en-CA 로케일은 YYYY-MM-DD 형식
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

// Asia/Seoul 기준 오늘 신청 인원
export function countToday(rows: Signup[]): number {
  const today = seoulDate(new Date());
  return rows.filter((r) => seoulDate(r.created_at) === today).length;
}

// 최근 7일(오늘 포함) Asia/Seoul 기준 일별 신청 추이
export function dailyTrend(rows: Signup[]): CategoryCount {
  const days: string[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    days.push(seoulDate(d));
  }

  const counts: Record<string, number> = Object.fromEntries(
    days.map((d) => [d, 0])
  );
  for (const row of rows) {
    const day = seoulDate(row.created_at);
    if (day in counts) counts[day] += 1;
  }

  // 라벨은 MM/DD 로 짧게 표시
  const labels = days.map((d) => d.slice(5).replace("-", "/"));
  return { labels, data: days.map((d) => counts[d]) };
}
