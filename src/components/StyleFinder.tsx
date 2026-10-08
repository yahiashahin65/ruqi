"use client";

import { useMemo, useState } from "react";
import { CONTACT_WHATSAPP } from "@/lib/constants";

const questions = [
  {
    title: "أي إحساس أقرب لك؟",
    options: [
      { label: "هادئ ودافئ", value: "warm" },
      { label: "نظيف ومختصر", value: "minimal" },
      { label: "غني وفاخر", value: "luxury" }
    ]
  },
  {
    title: "كيف تحب حضور الخامة؟",
    options: [
      { label: "خشب وحجر طبيعي", value: "warm" },
      { label: "أسطح هادئة ومتجانسة", value: "minimal" },
      { label: "رخام ومعادن وتفاصيل", value: "luxury" }
    ]
  },
  {
    title: "ما شكل الإضاءة المفضل؟",
    options: [
      { label: "ناعمة ومتدرجة", value: "warm" },
      { label: "مخفية ودقيقة", value: "minimal" },
      { label: "مشهدية ونقاط بارزة", value: "luxury" }
    ]
  }
];

const results = {
  warm: {
    ar: "معاصر دافئ",
    text: "درجات ترابية وخشب وحجر ولمسات نسيجية، مع إضاءة طبقية ومساحات مريحة لا تبدو رسمية أكثر من اللازم."
  },
  minimal: {
    ar: "بساطة هادئة",
    text: "خطوط واضحة، تخزين مدمج، خامات قليلة لكن محسوبة، وتفاصيل تقلل الضوضاء البصرية من دون أن تجعل المكان باردا."
  },
  luxury: {
    ar: "فخامة متوازنة",
    text: "تباين مدروس بين الحجر والمعادن والأقمشة والإضاءة، مع حضور أقوى للتفاصيل من غير ازدحام زخرفي."
  }
};

type ResultKey = keyof typeof results;

/**
 * Generate WhatsApp link using the official number.
 */
function getWhatsappUrl(result: ResultKey): string {
  const item = results[result];

  const message = `السلام عليكم،
ارغب في بدء مشروع تصميم داخلي.

نتيجة اختبار الاتجاه:
${item.ar}

التفاصيل:
${item.text}

ارغب في مناقشة تفاصيل مشروعي معكم.`;

  return `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function StyleFinder() {
  const [answers, setAnswers] = useState<ResultKey[]>([]);
  const [step, setStep] = useState(0);

  const result = useMemo(() => {
    if (answers.length < questions.length) {
      return null;
    }

    const score = answers.reduce<Record<ResultKey, number>>(
      (acc, key) => ({
        ...acc,
        [key]: acc[key] + 1
      }),
      {
        warm: 0,
        minimal: 0,
        luxury: 0
      }
    );

    return (Object.keys(score) as ResultKey[]).sort(
      (a, b) => score[b] - score[a]
    )[0];
  }, [answers]);

  function choose(value: ResultKey) {
    const next = [...answers];

    next[step] = value;

    setAnswers(next);

    setStep((current) =>
      Math.min(questions.length, current + 1)
    );
  }

  function restart() {
    setAnswers([]);
    setStep(0);
  }

  if (result) {
    const item = results[result];

    return (
      <div className="wizard__step">
        <p className="eyebrow">
          اتجاهك الأقرب
        </p>

        <h2>{item.ar}</h2>

        <p className="page-hero__lead">
          {item.text}
        </p>

        <div className="wizard__actions">
          <button
            type="button"
            className="button"
            onClick={restart}
          >
            إعادة الاختبار
          </button>

          <a
            className="button button--solid"
            href={getWhatsappUrl(result)}
            target="_blank"
            rel="noopener noreferrer"
          >
            ابدأ مشروعك
          </a>
        </div>
      </div>
    );
  }

  const question = questions[step];

  return (
    <div className="wizard">
      <div className="wizard__progress">
        {questions.map((_, index) => (
          <span
            className={
              index <= step ? "is-active" : ""
            }
            key={index}
          />
        ))}
      </div>

      <div className="wizard__step">
        <p className="eyebrow">
          السؤال {step + 1} من {questions.length}
        </p>

        <h2>{question.title}</h2>

        <div className="choice-grid">
          {question.options.map((option) => (
            <button
              type="button"
              className="choice"
              key={option.label}
              onClick={() =>
                choose(option.value as ResultKey)
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
