const steps = [
  ["01", "نكتشف", "زيارة أو اجتماع لفهم المكان والاحتياج والميزانية والأولويات."],
  ["02", "نخطط", "توزيع الفراغات والمسارات والوظائف قبل أي قرار جمالي."],
  ["03", "نصمم", "خامات وإضاءة و3D وتفاصيل تعكس هوية المشروع."],
  ["04", "نحوّلها للتنفيذ", "مخططات وجداول ومراجعات تقلل الاجتهاد في الموقع."],
  ["05", "نراقب التفاصيل", "تنسيق عينات وموردين وجودة حتى لحظة التسليم."]
];

export function ProcessStrip() {
  return (
    <section className="process-strip">
      <div className="shell">
        <div className="process-strip__intro" data-reveal>
          <p className="eyebrow">طريقة العمل</p>

          <h2>
            وضوح قبل الجمال.
            <br />
            تفاصيل قبل التسليم.
          </h2>
        </div>

        <div className="process-strip__steps">
          {steps.map(([number, title, text]) => (
            <article key={number} data-reveal>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
