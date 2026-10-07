export function StudioStatement() {
  return (
    <section
      className="studio-statement"
      aria-labelledby="studio-statement-title"
    >
      <div className="shell studio-statement__grid">
        <p
          className="eyebrow"
          data-reveal
        >
          رؤيتنا في التصميم
        </p>

        <div data-reveal>
          <h2 id="studio-statement-title">
            لا نبحث عن تصميم يصلح لكل مشروع.
            <br />
            نبحث عن{" "}
            <em>الحل المناسب</em>{" "}
            لكل مساحة.
          </h2>

          <p>
            في ديكور لاين الرياض نتعامل مع التصميم الداخلي
            باعتباره توازنا بين الجمال والوظيفة،
            وبين الضوء والخامات وتوزيع المساحات،
            وبين الخصوصية والراحة وطبيعة الاستخدام.
            نعمل على مشاريع سكنية وتجارية في
            الرياض مع مراعاة أن يكون كل قرار
            قابلا للتنفيذ ومناسبا للمكان وأصحابه.
          </p>
        </div>
      </div>
    </section>
  );
}
