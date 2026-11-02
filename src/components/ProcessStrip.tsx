const steps = [
  [
    "01",
    "نفهم المشروع",
    "زيارة أو اجتماع لفهم المساحة والاحتياجات والميزانية والأولويات قبل بدء التصميم."
  ],
  [
    "02",
    "نخطط المساحة",
    "توزيع الفراغات ومسارات الحركة والوظائف للوصول إلى تخطيط عملي ومريح."
  ],
  [
    "03",
    "نطور التصميم",
    "اختيار الخامات والإضاءة والألوان والتصورات ثلاثية الأبعاد بما يعكس هوية المشروع."
  ],
  [
    "04",
    "نجهز للتنفيذ",
    "مخططات تنفيذية وجداول وتفاصيل واضحة تساعد على تقليل الاجتهاد والأخطاء في الموقع."
  ],
  [
    "05",
    "نتابع حتى التسليم",
    "تنسيق العينات والموردين ومتابعة جودة التنفيذ والتفاصيل حتى اكتمال المشروع."
  ]
];

export function ProcessStrip() {
  return (
    <section
      className="process-strip"
      aria-labelledby="process-strip-title"
    >
      <div className="shell">
        <div
          className="process-strip__intro"
          data-reveal
        >
          <p className="eyebrow">
            مراحل التصميم والتنفيذ
          </p>

          <h2 id="process-strip-title">
            من دراسة المساحة
            <br />
            إلى التصميم والتنفيذ.
          </h2>

          <p className="section-heading__text">
            نتبع خطوات واضحة في مشاريع التصميم الداخلي
            والتنفيذ تبدأ بفهم المساحة والاحتياجات،
            ثم التخطيط والتصميم، وتنتهي بمتابعة التفاصيل
            حتى التسليم.
          </p>
        </div>

        <div className="process-strip__steps">
          {steps.map(
            ([number, title, text]) => (
              <article
                key={number}
                data-reveal
              >
                <span>{number}</span>

                <h3>{title}</h3>

                <p>{text}</p>
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}
