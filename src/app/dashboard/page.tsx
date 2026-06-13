"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import {
  AI_EXPERIENCES,
  DEPARTMENTS,
  LEARNING_GOALS,
  countByCategory,
  countToday,
  dailyTrend,
  topCategory,
  type Signup,
} from "@/lib/signups";
import {
  AiExperienceBar,
  DailyTrendLine,
  DepartmentDoughnut,
  LearningGoalPie,
} from "./charts";

export default function DashboardPage() {
  const [rows, setRows] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 마운트 시 1회 조회 → 페이지 새로고침하면 최신 데이터 반영
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let active = true;
    (async () => {
      const { data, error } = await supabase!
        .from("signups")
        .select("*")
        .order("created_at", { ascending: false });

      if (!active) return;
      if (error) {
        setError("데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        console.error("Supabase select error:", error);
      } else {
        setRows((data as Signup[]) ?? []);
      }
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  // 집계 (rows 변경 시에만 재계산)
  const stats = useMemo(() => {
    const byDept = countByCategory(rows, "department", DEPARTMENTS);
    const byAi = countByCategory(rows, "ai_experience", AI_EXPERIENCES);
    const byGoal = countByCategory(rows, "learning_goal", LEARNING_GOALS);
    return {
      total: rows.length,
      today: countToday(rows),
      topDept: topCategory(byDept),
      topAi: topCategory(byAi),
      byDept,
      byAi,
      byGoal,
      trend: dailyTrend(rows),
    };
  }, [rows]);

  return (
    <main className="min-h-screen bg-[#0f0f1a] px-4 py-10 text-slate-100 sm:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold sm:text-3xl">
            AI 바이브 코딩 마스터클래스
            <span className="text-[#ff6b35]"> — 신청 현황</span>
          </h1>
        </header>

        {!isSupabaseConfigured ? (
          <Banner>
            Supabase가 아직 연동되지 않았습니다. <code>.env.local</code>에 키를
            입력한 뒤 dev 서버를 재시작해 주세요.
          </Banner>
        ) : loading ? (
          <Banner>불러오는 중…</Banner>
        ) : error ? (
          <Banner tone="error">{error}</Banner>
        ) : (
          <>
            {/* 요약 카드 4개 */}
            <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard label="총 신청 인원" value={`${stats.total}명`} />
              <StatCard label="오늘 신청 (KST)" value={`${stats.today}명`} />
              <StatCard label="가장 많은 소속 팀" value={stats.topDept} />
              <StatCard label="가장 많은 AI 경험" value={stats.topAi} />
            </section>

            {/* 차트 4개 */}
            <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ChartCard title="소속 팀별 신청 분포">
                <DepartmentDoughnut count={stats.byDept} />
              </ChartCard>
              <ChartCard title="AI 도구 사용 경험 분포">
                <AiExperienceBar count={stats.byAi} />
              </ChartCard>
              <ChartCard title="가장 배우고 싶은 것 분포">
                <LearningGoalPie count={stats.byGoal} />
              </ChartCard>
              <ChartCard title="일별 신청 추이 (최근 7일, KST)">
                <DailyTrendLine count={stats.trend} />
              </ChartCard>
            </section>

            {/* 신청자 목록 */}
            <section className="mt-6 rounded-2xl bg-[#1a1a2e] p-5 shadow-lg shadow-black/40 ring-1 ring-white/5">
              <h2 className="text-lg font-semibold">신청자 목록</h2>
              {stats.total === 0 ? (
                <p className="py-10 text-center text-sm text-slate-400">
                  아직 신청자가 없습니다.
                </p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[860px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-slate-400">
                      <tr className="border-b border-white/10">
                        {[
                          "이름",
                          "이메일",
                          "소속 팀",
                          "직급",
                          "AI 경험",
                          "배우고 싶은 것",
                          "식이 제한",
                          "신청일시",
                        ].map((h) => (
                          <th key={h} className="px-3 py-3 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {rows.map((row) => {
                        const hasDietary = Boolean(
                          row.dietary_restrictions &&
                            row.dietary_restrictions.trim()
                        );
                        return (
                          <tr key={row.id} className="hover:bg-white/5">
                            <td className="px-3 py-3 font-medium text-white">
                              {row.name}
                            </td>
                            <td className="px-3 py-3 text-slate-300">
                              {row.email}
                            </td>
                            <td className="px-3 py-3 text-slate-300">
                              {row.department}
                            </td>
                            <td className="px-3 py-3 text-slate-300">
                              {row.position}
                            </td>
                            <td className="px-3 py-3 text-slate-300">
                              {row.ai_experience}
                            </td>
                            <td className="px-3 py-3 text-slate-300">
                              {row.learning_goal}
                            </td>
                            <td
                              className={
                                hasDietary
                                  ? "px-3 py-3 bg-yellow-300/20 font-medium text-yellow-200"
                                  : "px-3 py-3 text-slate-500"
                              }
                            >
                              {hasDietary ? row.dietary_restrictions : "—"}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-slate-400">
                              {formatDateTime(row.created_at)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#1a1a2e] p-5 shadow-lg shadow-black/40 ring-1 ring-white/5">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-2 truncate text-2xl font-bold text-[#ff6b35]" title={value}>
        {value}
      </p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-[#1a1a2e] p-5 shadow-lg shadow-black/40 ring-1 ring-white/5">
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      <div className="mt-4 h-64">{children}</div>
    </div>
  );
}

function Banner({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "error";
}) {
  return (
    <div
      className={`mt-8 rounded-2xl bg-[#1a1a2e] px-6 py-12 text-center text-sm ring-1 ring-white/5 ${
        tone === "error" ? "text-red-400" : "text-slate-400"
      }`}
    >
      {children}
    </div>
  );
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
