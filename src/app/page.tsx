import RegistrationForm from "./components/RegistrationForm";

// 행사 정보 항목
const EVENT_DETAILS = [
  {
    icon: "📅",
    label: "일시",
    value: "2026년 4월 2일 (목) 오후 1시 ~ 5시 (4시간)",
  },
  {
    icon: "📍",
    label: "장소",
    value: "본사 대회의실",
  },
  {
    icon: "👥",
    label: "대상",
    value: "전 직원 (개발 / 비개발 무관)",
  },
  {
    icon: "💻",
    label: "준비물",
    value: "개인 노트북",
  },
];

export default function Home() {
  return (
    <main className="flex-1 bg-[#0f1b3d] text-white">
      <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
        {/* 헤드라인 */}
        <header className="text-center">
          <span className="inline-block rounded-full bg-[#ff6b35]/15 px-4 py-1.5 text-sm font-semibold text-[#ff6b35]">
            사내 AI 강의 · 외부 초청
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
            AI 바이브 코딩
            <br className="sm:hidden" /> 마스터클래스
          </h1>
          <p className="mt-4 text-lg text-slate-300 sm:text-xl">
            코딩 없이 AI로 업무 도구를 만드는 법
          </p>
          <p className="mt-3 text-sm text-slate-400">
            강사 ·{" "}
            <span className="font-medium text-slate-200">AI커피챗</span>{" "}
            (외부 초청 강사)
          </p>
        </header>

        {/* 강의 소개 */}
        <section className="mx-auto mt-12 max-w-2xl rounded-2xl bg-white/5 p-7 text-center ring-1 ring-white/10 sm:p-9">
          <p className="text-lg leading-relaxed text-slate-200 sm:text-xl">
            AI에게 <span className="font-semibold text-[#ff6b35]">말로 지시</span>
            하면 앱이 만들어집니다.
            <br />
            코딩 경험이 전혀 없어도 괜찮아요.
            <br />
            <span className="font-semibold text-white">4시간</span>이면 여러분만의
            업무 도구를 직접 만들 수 있습니다.
          </p>
        </section>

        {/* 행사 정보 섹션 */}
        <section className="mt-12">
          <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-slate-400">
            행사 정보
          </h2>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {EVENT_DETAILS.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-xl bg-white/5 p-5 ring-1 ring-white/10"
              >
                <span className="text-2xl" aria-hidden>
                  {item.icon}
                </span>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-[#ff6b35]">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-base text-slate-100">{item.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </section>

        {/* 신청 폼 */}
        <section className="mt-14">
          <RegistrationForm />
        </section>

        {/* 푸터 */}
        <footer className="mt-12 text-center text-xs text-slate-500">
          Powered by Listeningmind ☕
        </footer>
      </div>
    </main>
  );
}
