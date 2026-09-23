"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import type { MediaRef, Project, ProjectType } from "@/lib/types";
import { ImageUploader, type UploadedMedia } from "./ImageUploader";

const projectTypes: Array<{ value: ProjectType; label: string }> = [
  { value: "residential", label: "سكني" },
  { value: "commercial", label: "تجاري" },
  { value: "hospitality", label: "ضيافة" },
  { value: "office", label: "مكاتب" },
  { value: "renovation", label: "تجديد" }
];

type ProjectEditor = {
  title: string;
  type: ProjectType;
  style: string;
  area: string;
  duration: string;
  excerpt: string;
  story: string;
  cover?: MediaRef;
  gallery: MediaRef[];
  before?: MediaRef;
  after?: MediaRef;
  featured: boolean;
  order: number;
  status: "draft" | "published";
};

function initialState(project?: Project): ProjectEditor {
  return {
    title: project?.title || "",
    type: project?.type || "residential",
    style: project?.style || "",
    area: project?.area ? String(project.area) : "",
    duration: project?.duration || "",
    excerpt: project?.excerpt || "",
    story: project?.story || "",
    cover: project?.cover,
    gallery: project?.gallery || [],
    before: project?.before,
    after: project?.after,
    featured: project?.featured || false,
    order: project?.order || 1,
    status: project?.status || "draft"
  };
}

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();

  const [form, setForm] = useState<ProjectEditor>(() =>
    initialState(project)
  );

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof ProjectEditor>(
    key: K,
    value: ProjectEditor[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  async function save(event: React.FormEvent) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    const response = await fetch(
      project
        ? `/api/admin/projects/${project.id}`
        : "/api/admin/projects",
      {
        method: project ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: form.title,
          type: form.type,
          style: form.style,
          area: form.area
            ? Number(form.area)
            : undefined,
          duration: form.duration,
          excerpt: form.excerpt,
          story: form.story,
          cover: form.cover,
          gallery: form.gallery,
          before: form.before,
          after: form.after,
          featured: form.featured,
          order: form.order,
          status: form.status
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(
        data.error || "تعذر حفظ المشروع"
      );
    } else {
      router.push("/admin/projects");
      router.refresh();
    }

    setSaving(false);
  }


  function moveGallery(
    index: number,
    direction: -1 | 1
  ) {
    setForm((prev) => {
      const next = [...prev.gallery];

      const target = index + direction;

      if (
        target < 0 ||
        target >= next.length
      ) {
        return prev;
      }

      [
        next[index],
        next[target]
      ] = [
        next[target],
        next[index]
      ];

      return {
        ...prev,
        gallery: next
      };
    });
  }


  return (
    <form
      className="admin-form"
      onSubmit={save}
    >

      <div className="admin-form-section">

        <div className="admin-form-section__head">
          <span>01</span>

          <div>
            <h2>
              بيانات المشروع
            </h2>

            <p>
              المعلومات الأساسية التي يحتاجها الزائر لفهم المشروع.
            </p>
          </div>
        </div>


        <div className="admin-form__grid">

          <div className="field field--full">
            <label>
              اسم المشروع
            </label>

            <input
              value={form.title}
              onChange={(e)=>
                set(
                  "title",
                  e.target.value
                )
              }
              required
            />
          </div>


          <div className="field">
            <label>
              نوع المشروع
            </label>

            <select
              value={form.type}
              onChange={(e)=>
                set(
                  "type",
                  e.target.value as ProjectType
                )
              }
            >
              {projectTypes.map((item)=>(
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>


          <div className="field">
            <label>
              ترتيب العرض
            </label>

            <input
              type="number"
              min="1"
              value={form.order}
              onChange={(e)=>
                set(
                  "order",
                  Number(e.target.value)
                )
              }
            />
          </div>


          <div className="field">
            <label>
              الأسلوب - اختياري
            </label>

            <input
              value={form.style}
              onChange={(e)=>
                set(
                  "style",
                  e.target.value
                )
              }
              placeholder="مثال: معاصر دافئ"
            />
          </div>


          <div className="field">
            <label>
              المساحة التقريبية - اختياري
            </label>

            <input
              type="number"
              min="1"
              value={form.area}
              onChange={(e)=>
                set(
                  "area",
                  e.target.value
                )
              }
              placeholder="م²"
            />
          </div>


          <div className="field">
            <label>
              مدة التنفيذ - اختياري
            </label>

            <input
              value={form.duration}
              onChange={(e)=>
                set(
                  "duration",
                  e.target.value
                )
              }
              placeholder="مثال: 4 أشهر"
            />
          </div>

        </div>

      </div>


      {/* باقي الصفحة كما هي بدون تغيير */}
      
      {message && (
        <div className="notice">
          {message}
        </div>
      )}


      <button
        className="button button--solid"
        style={{
          marginTop:22
        }}
        disabled={
          saving ||
          !form.cover?.url
        }
      >
        {
          saving
            ? "جاري الحفظ..."
            : "حفظ المشروع"
        }
      </button>

    </form>
  );
}
