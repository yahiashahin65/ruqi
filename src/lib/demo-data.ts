import type { Article, Project, Service } from "./types";

const img = (id: string, alt: string) => ({
  url: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=88`,
  alt
});

export const demoProjects: Project[] = [
  {
    id: "demo-1",
    title: "فيلا السكينة",
    slug: "villa-al-sakinah",
    subtitle: "منزل عائلي هادئ بكتل دافئة وتفاصيل حجرية",
    type: "residential",
    style: "Warm Contemporary",
    city: "المدينة المنورة",
    district: "العريض",
    year: 2026,
    area: 620,
    duration: "18 أسبوع",
    scope: "تصميم داخلي · إشراف · تأثيث",
    excerpt: "بيت معاصر يوازن بين الخصوصية والضوء الطبيعي ويمنح كل مجلس وغرفة إيقاعها الخاص.",
    story: "بدأ المشروع من رغبة واضحة: منزل عائلي فخم من دون استعراض. بُنيت لوحة المواد حول الحجر الطبيعي والخشب المعتّق والمنسوجات الهادئة، مع فصل بصري مرن بين الضيافة والحياة اليومية. تم ضبط الإضاءة على طبقات حتى يتبدل إحساس الفراغ من النهار إلى المساء من دون أن يفقد هدوءه.",
    cover: img("photo-1600210492486-724fe5c67fb0", "تصميم داخلي دافئ لفيلا عصرية"),
    gallery: [
      img("photo-1618221195710-dd6b41faaea6", "غرفة معيشة بتفاصيل طبيعية"),
      img("photo-1600566753086-00f18fb6b3ea", "فراغ داخلي معاصر"),
      img("photo-1600607687939-ce8a6c25118c", "تفاصيل أثاث وإضاءة")
    ],
    before: img("photo-1600566753086-00f18fb6b3ea", "قبل التطوير"),
    after: img("photo-1618221195710-dd6b41faaea6", "بعد التطوير"),
    services: ["interior-design", "fit-out", "furniture-styling"],
    featured: true,
    status: "published",
    order: 1
  },
  {
    id: "demo-2",
    title: "مجلس قباء",
    slug: "quba-majlis",
    subtitle: "هوية محلية بترجمة معاصرة للحجر والنسيج",
    type: "residential",
    style: "Contemporary Saudi",
    city: "المدينة المنورة",
    district: "قباء",
    year: 2026,
    area: 180,
    duration: "10 أسابيع",
    scope: "تصميم · تنفيذ · تنسيق",
    excerpt: "مجلس معاصر يجمع دفء الضيافة السعودية مع خامات هادئة وتفاصيل قابلة للاستخدام اليومي.",
    story: "استبدلنا الزخرفة الثقيلة بإيقاع هادئ من الظلال والكتل، مع حجر طبيعي وأخشاب دافئة وأقمشة محايدة. النتيجة مساحة ضيافة رسمية لكنها مريحة، وعناصرها مناسبة للاستخدام اليومي وتبقى متوازنة بصريا على المدى الطويل.",
    cover: img("photo-1615874694520-474822394e73", "مجلس سعودي معاصر"),
    gallery: [
      img("photo-1600607688969-a5bfcd646154", "مجلس معاصر"),
      img("photo-1600607687920-4e2a09cf159d", "تفاصيل إضاءة داخلية"),
      img("photo-1600607688960-e095ff83135c", "خامات حجرية وخشبية")
    ],
    services: ["interior-design", "fit-out"],
    featured: true,
    status: "published",
    order: 2
  },
  {
    id: "demo-3",
    title: "عيادة النور",
    slug: "al-noor-clinic",
    subtitle: "رحلة هادئة للمراجع من الاستقبال حتى غرف الخدمة",
    type: "commercial",
    style: "Soft Minimal",
    city: "المدينة المنورة",
    district: "سلطانة",
    year: 2026,
    area: 340,
    duration: "14 أسبوع",
    scope: "هوية مكانية · تصميم داخلي · تنفيذ",
    excerpt: "مساحة صحية بألوان مطفأة ومسارات واضحة تقلل الإحساس بالتوتر.",
    story: "صممنا الحركة قبل الشكل: نقاط الاستقبال والانتظار والخصوصية البصرية كانت أساس المخطط، ثم جاءت لوحة الخامات لتدعم الإحساس بالنظافة والهدوء. استخدمنا تفاصيل سهلة الصيانة من دون أن تبدو تجارية أو باردة.",
    cover: img("photo-1600566753190-17f0baa2a6c3", "تصميم تجاري هادئ"),
    gallery: [
      img("photo-1600585154340-be6161a56a0c", "مساحة استقبال معاصرة"),
      img("photo-1600607687920-4e2a09cf159d", "تفاصيل داخلية"),
      img("photo-1600566752355-35792bedcfea", "إضاءة ومواد داخلية")
    ],
    services: ["commercial-interiors", "fit-out"],
    featured: true,
    status: "published",
    order: 3
  },
  {
    id: "demo-4",
    title: "مقهى البستان",
    slug: "al-bustan-cafe",
    subtitle: "ضيافة معاصرة تركز على الضوء والملمس",
    type: "hospitality",
    style: "Earthy Hospitality",
    city: "المدينة المنورة",
    district: "قباء",
    year: 2025,
    area: 260,
    duration: "12 أسبوع",
    scope: "Concept · Interior · Styling",
    excerpt: "مقهى بمواد ترابية وإضاءة مسائية تمنح كل جلسة خصوصيتها.",
    story: "بُنيت الفكرة حول تبدل الضوء خلال اليوم. الواجهات أكثر انفتاحا صباحا، بينما تتحول الإضاءة الداخلية مساء إلى نقاط دافئة حول الطاولات. الأثاث موزع بحيث يخلق خيارات فردية وجماعية من دون ازدحام بصري.",
    cover: img("photo-1554118811-1e0d58224f24", "تصميم مقهى راق"),
    gallery: [
      img("photo-1552566626-52f8b828add9", "جلسات مقهى"),
      img("photo-1555396273-367ea4eb4db5", "إضاءة مطعم ومقهى"),
      img("photo-1501339847302-ac426a4a7cbb", "تفاصيل ضيافة")
    ],
    services: ["commercial-interiors", "brand-space"],
    featured: false,
    status: "published",
    order: 4
  }
];

export const demoServices: Service[] = [
  {
    id: "service-1",
    title: "التصميم الداخلي",
    slug: "interior-design",
    eyebrow: "من الفكرة إلى المخططات",
    excerpt: "تخطيط المساحة، المواد، الإضاءة، الأثاث والتفاصيل التنفيذية في منظومة واحدة.",
    body: "نبدأ بفهم طريقة استخدامك للمكان قبل اختيار أي خامة. نحول الاحتياجات إلى مخطط واضح، ثم Concept بصري و3D ومخططات تنفيذية وجداول مواد تساعد المشروع على الانتقال إلى الموقع بأقل مفاجآت ممكنة.",
    deliverables: ["Space planning", "Mood & material direction", "3D visualization", "Lighting concept", "Construction drawings", "FF&E schedule"],
    image: img("photo-1618221195710-dd6b41faaea6", "تصميم داخلي"),
    order: 1,
    status: "published"
  },
  {
    id: "service-2",
    title: "التنفيذ والتشطيب",
    slug: "fit-out",
    eyebrow: "تفاصيل قابلة للبناء",
    excerpt: "إدارة التنفيذ والتشطيبات وربط التصميم بالموردين والموقع حتى التسليم.",
    body: "نحوّل التصميم إلى نطاق تنفيذي مضبوط: عينات، جداول كميات، تنسيق الموردين، زيارات الموقع، مراجعة الجودة، وإقفال الملاحظات حتى التسليم.",
    deliverables: ["BOQ support", "Material approvals", "Site coordination", "Quality reviews", "Snagging", "Handover"],
    image: img("photo-1600566753086-00f18fb6b3ea", "تنفيذ وتشطيبات داخلية"),
    order: 2,
    status: "published"
  },
  {
    id: "service-3",
    title: "التجديد وإعادة التأهيل",
    slug: "renovation",
    eyebrow: "إعادة قراءة الموجود",
    excerpt: "إعادة توزيع وتحسين المساحات القائمة مع الحفاظ على ما يستحق البقاء.",
    body: "نقيّم الفراغ القائم فنيا ووظيفيا، ثم نحدد ما يمكن الاحتفاظ به وما يحتاج الاستبدال. الهدف تجديد واضح الأثر من دون هدم غير ضروري أو إنفاق بلا عائد.",
    deliverables: ["Existing condition audit", "Renovation concept", "Phasing plan", "Finishes refresh", "MEP coordination", "Execution support"],
    image: img("photo-1600607687939-ce8a6c25118c", "تجديد داخلي"),
    order: 3,
    status: "published"
  },
  {
    id: "service-4",
    title: "المشاريع التجارية والضيافة",
    slug: "commercial-interiors",
    eyebrow: "المكان جزء من البراند",
    excerpt: "مطاعم، مقاه، عيادات، متاجر ومكاتب تجمع التشغيل والهوية في تجربة واحدة.",
    body: "في المشاريع التجارية لا يكفي أن يكون المكان جميلا؛ يجب أن يعمل. ندرس رحلة العميل، سرعة الخدمة، نقاط العرض، التخزين، الصيانة، والهوية البصرية قبل تكوين الشكل النهائي.",
    deliverables: ["Customer journey", "Operational zoning", "Brand translation", "Material strategy", "Wayfinding", "Site execution"],
    image: img("photo-1555396273-367ea4eb4db5", "تصميم تجاري"),
    order: 4,
    status: "published"
  }
];

export const demoArticles: Article[] = [
  {
    id: "article-1",
    title: "كيف تبدأ مشروع تصميم داخلي في المدينة المنورة من دون قرارات مكلفة؟",
    slug: "start-interior-design-project-madinah",
    excerpt: "خطوات عملية قبل اختيار الرخام أو الألوان: نطاق العمل، الميزانية، المخططات، الأولويات وجدول التنفيذ.",
    content: "المشروع الجيد يبدأ قبل الـ 3D. أول خطوة هي كتابة نطاق واضح للمساحات المطلوبة وطريقة استخدامها، ثم تحديد ميزانية واقعية تشمل التنفيذ وليس التصميم فقط. بعد ذلك تأتي معاينة الموقع ورفع المقاسات ومراجعة الكهرباء والتكييف والإنارة. كل قرار مبكر صحيح يقلل التغييرات المكلفة أثناء التنفيذ.\n\nفي مشاريع المدينة المنورة نهتم كذلك بطبيعة الضوء والحرارة وطريقة استخدام المجالس ومساحات الضيافة، لأن التصميم الناجح يجب أن يكون مناسبا للحياة اليومية وليس للصورة فقط.",
    cover: img("photo-1600607687920-4e2a09cf159d", "مخطط وتصميم داخلي"),
    category: "دليل المشروع",
    publishedAt: "2026-09-10",
    status: "published"
  },
  {
    id: "article-2",
    title: "تصميم المجلس المعاصر: كيف نحافظ على الهيبة من دون ازدحام؟",
    slug: "modern-majlis-design",
    excerpt: "التناسب، مسافات الحركة، طبقات الإضاءة والخامات أهم من كثرة الزخرفة.",
    content: "المجلس المعاصر لا يحتاج إلى حشو بصري حتى يبدو فخما. المسافة الصحيحة بين الجلسات، ارتفاعات الطاولات، خط النظر، توزيع الإنارة، وملمس المواد تصنع الإحساس الحقيقي بالجودة.\n\nنستخدم الزخرفة كعنصر مقصود لا كخلفية لكل شيء، ونترك للخامة والضوء مساحة ليظهرا.",
    cover: img("photo-1615874694520-474822394e73", "مجلس معاصر"),
    category: "إلهام",
    publishedAt: "2026-09-05",
    status: "published"
  },
  {
    id: "article-3",
    title: "قبل تجديد الفيلا: 7 عناصر يجب فحصها قبل الهدم",
    slug: "villa-renovation-checklist",
    excerpt: "من التمديدات إلى الرطوبة والتكييف: فحص الموجود يحمي الميزانية ويكشف الأولويات الحقيقية.",
    content: "قبل الهدم يجب فحص حالة الكهرباء والسباكة والتكييف والعزل والرطوبة والأرضيات والفتحات الإنشائية. التجديد الذكي يبدأ بخريطة للمشاكل وليس بقائمة مشتريات.\n\nبعد الفحص نقسم القرارات إلى ضرورية، محسنة، وجمالية. بهذه الطريقة تبقى الميزانية تحت السيطرة ويصبح التصميم مرتبطا بواقع المبنى.",
    cover: img("photo-1600566752355-35792bedcfea", "تجديد فيلا"),
    category: "تجديد",
    publishedAt: "2026-08-28",
    status: "published"
  }
];
