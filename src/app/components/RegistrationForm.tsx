"use client";

import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

// 드롭다운 옵션 정의
const TEAM_OPTIONS = [
  "프로덕트",
  "마케팅",
  "세일즈",
  "컨설팅",
  "개발",
  "디자인",
  "경영지원",
  "기타",
];

const RANK_OPTIONS = ["사원", "대리", "과장", "차장", "부장", "임원"];

const AI_EXPERIENCE_OPTIONS = [
  "처음이에요",
  "ChatGPT 정도 써봤어요",
  "Claude도 써봤어요",
  "Claude Code까지 써봤어요",
];

const GOAL_OPTIONS = [
  "업무 자동화",
  "데이터 분석",
  "웹서비스 만들기",
  "AI 도구 전반",
  "기타",
];

type FormState = {
  name: string;
  email: string;
  team: string;
  rank: string;
  aiExperience: string;
  goal: string;
  dietary: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  team: "",
  rank: "",
  aiExperience: "",
  goal: "",
  dietary: "",
};

// 회사 이메일 형식 검증 (일반적인 이메일 형식)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegistrationForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // 제출 단계에서 발생한 폼 전체 에러(네트워크/서버 등)
  const [submitError, setSubmitError] = useState<string | null>(null);
  // 프론트엔드에서만 중복 이메일 방지
  const [submittedEmails, setSubmittedEmails] = useState<string[]>([]);

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};

    if (!form.name.trim()) next.name = "이름을 입력해 주세요.";

    if (!form.email.trim()) {
      next.email = "이메일을 입력해 주세요.";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      next.email = "올바른 회사 이메일 형식으로 입력해 주세요.";
    } else if (submittedEmails.includes(form.email.trim().toLowerCase())) {
      next.email = "이미 신청한 이메일입니다.";
    }

    if (!form.team) next.team = "소속 팀/부서를 선택해 주세요.";
    if (!form.rank) next.rank = "직급을 선택해 주세요.";
    if (!form.aiExperience)
      next.aiExperience = "AI 도구 사용 경험을 선택해 주세요.";
    if (!form.goal) next.goal = "가장 배우고 싶은 것을 선택해 주세요.";

    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = { ...form, name: form.name.trim(), email: form.email.trim() };

    // Supabase 미설정 시: 기존처럼 콘솔에만 출력하고 완료 처리(개발/미연동 환경 안전장치).
    if (!isSupabaseConfigured || !supabase) {
      console.log("신청 데이터(Supabase 미연동):", payload);
      setSubmittedEmails((prev) => [...prev, payload.email.toLowerCase()]);
      setSubmitted(true);
      return;
    }

    // signups 테이블 컬럼명에 맞춰 매핑해서 insert.
    setSubmitting(true);
    const { error } = await supabase.from("signups").insert({
      name: payload.name,
      email: payload.email,
      department: payload.team,
      position: payload.rank,
      ai_experience: payload.aiExperience,
      learning_goal: payload.goal,
      dietary_restrictions: payload.dietary.trim() || null,
    });
    setSubmitting(false);

    if (error) {
      // unique 제약 위반(23505) → 이메일 중복으로 안내
      if (error.code === "23505") {
        setErrors((prev) => ({ ...prev, email: "이미 신청한 이메일입니다." }));
      } else {
        setSubmitError("신청 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        console.error("Supabase insert error:", error);
      }
      return;
    }

    setSubmittedEmails((prev) => [...prev, payload.email.toLowerCase()]);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-xl shadow-black/30 sm:p-12">
        <div className="text-5xl">🎉</div>
        <h3 className="mt-4 text-2xl font-bold text-[#0f1b3d]">
          신청이 완료되었습니다!
        </h3>
        <p className="mt-3 text-base text-slate-600">
          당일 노트북 꼭 챙겨오세요.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(EMPTY_FORM);
            setSubmitted(false);
          }}
          className="mt-8 rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          다른 신청서 작성하기
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl bg-white p-6 shadow-xl shadow-black/30 sm:p-8"
    >
      <h3 className="text-xl font-bold text-[#0f1b3d]">참가 신청</h3>
      <p className="mt-1 text-sm text-slate-500">
        아래 정보를 입력하고 신청해 주세요.
      </p>

      <div className="mt-6 space-y-5">
        {/* 이름 */}
        <Field label="이름" required error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="홍길동"
            className={inputClass(errors.name)}
          />
        </Field>

        {/* 이메일 */}
        <Field label="이메일" required error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="name@company.com"
            className={inputClass(errors.email)}
          />
        </Field>

        {/* 소속 팀/부서 */}
        <Field label="소속 팀/부서" required error={errors.team}>
          <Select
            value={form.team}
            onChange={(v) => update("team", v)}
            options={TEAM_OPTIONS}
            placeholder="선택해 주세요"
            error={errors.team}
          />
        </Field>

        {/* 직급 */}
        <Field label="직급" required error={errors.rank}>
          <Select
            value={form.rank}
            onChange={(v) => update("rank", v)}
            options={RANK_OPTIONS}
            placeholder="선택해 주세요"
            error={errors.rank}
          />
        </Field>

        {/* AI 도구 사용 경험 */}
        <Field
          label="AI 도구 사용 경험"
          required
          error={errors.aiExperience}
        >
          <Select
            value={form.aiExperience}
            onChange={(v) => update("aiExperience", v)}
            options={AI_EXPERIENCE_OPTIONS}
            placeholder="선택해 주세요"
            error={errors.aiExperience}
          />
        </Field>

        {/* 가장 배우고 싶은 것 */}
        <Field
          label="강의에서 가장 배우고 싶은 것"
          required
          error={errors.goal}
        >
          <Select
            value={form.goal}
            onChange={(v) => update("goal", v)}
            options={GOAL_OPTIONS}
            placeholder="선택해 주세요"
            error={errors.goal}
          />
        </Field>

        {/* 식이 제한 / 알레르기 (선택) */}
        <Field label="식이 제한이나 알레르기" optional>
          <input
            type="text"
            value={form.dietary}
            onChange={(e) => update("dietary", e.target.value)}
            placeholder="간식 준비 참고용"
            className={inputClass()}
          />
        </Field>
      </div>

      {submitError && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 w-full rounded-lg bg-[#ff6b35] px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-[#ff6b35]/30 transition hover:bg-[#e85d2a] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "신청 중…" : "신청하기"}
      </button>
    </form>
  );
}

// 공통 input 스타일
function inputClass(error?: string) {
  return [
    "w-full rounded-lg border bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400",
    "outline-none transition focus:ring-2 focus:ring-[#ff6b35]/40",
    error
      ? "border-red-400 focus:border-red-400"
      : "border-slate-300 focus:border-[#ff6b35]",
  ].join(" ");
}

// 라벨 + 에러 래퍼
function Field({
  label,
  required,
  optional,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-[#ff6b35]">*</span>}
        {optional && (
          <span className="ml-1 text-xs font-normal text-slate-400">(선택)</span>
        )}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// 셀렉트(드롭다운)
function Select({
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  error?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={[
        inputClass(error),
        value ? "text-slate-900" : "text-slate-400",
      ].join(" ")}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="text-slate-900">
          {opt}
        </option>
      ))}
    </select>
  );
}
