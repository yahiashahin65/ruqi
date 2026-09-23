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
    order: project?.order ?? 1,
    status: project?.status || "draft"
  };
}

export function ProjectForm({
  project
}: {
  project?: Project;
}) {
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

          order: Number(form.order),

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
                  e.target.value
                    ? Number(e.target.value)
                    : 1
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



      <div className="admin-form-section">

        <div className="admin-form-section__head">

          <span>02</span>

          <div>

            <h2>
              المحتوى
            </h2>

            <p>
              وصف المشروع وقصته.
            </p>

          </div>

        </div>



        <div className="admin-form__grid">


          <div className="field field--full">

            <label>
              الوصف المختصر
            </label>

            <textarea
              value={form.excerpt}
              onChange={(e)=>
                set(
                  "excerpt",
                  e.target.value
                )
              }
              required
            />

          </div>



          <div className="field field--full">

            <label>
              عن المشروع
            </label>

            <textarea
              className="admin-textarea--large"
              value={form.story}
              onChange={(e)=>
                set(
                  "story",
                  e.target.value
                )
              }
              required
            />

          </div>


        </div>

      </div>



      <div className="admin-form-section">

        <div className="admin-form-section__head">

          <span>03</span>

          <div>

            <h2>
              الصور
            </h2>

            <p>
              الصورة الرئيسية والجاليري وصور قبل وبعد.
            </p>

          </div>

        </div>



        <div className="admin-form__grid">


          <ImageUploader
            label="الصورة الرئيسية"
            value={
              form.cover as UploadedMedia | undefined
            }
            onChange={(media)=>
              set(
                "cover",
                media
              )
            }
            onClear={()=>
              set(
                "cover",
                undefined
              )
            }
            folder="projects"
          />



          <ImageUploader
            label="إضافة صورة للجاليري"
            onChange={(media)=>
              set(
                "gallery",
                [
                  ...form.gallery,
                  media
                ]
              )
            }
            folder="projects"
          />



          {form.gallery.length > 0 && (

            <div className="field field--full">

              <label>
                صور المشروع
              </label>


              <div className="admin-gallery-manager">

                {form.gallery.map(
                  (image,index)=>(
                    
                    <div
                      className="admin-gallery-item"
                      key={`${image.url}-${index}`}
                    >

                      <img
                        src={image.url}
                        alt={
                          image.alt ||
                          `صورة ${index + 1}`
                        }
                      />


                      <div className="admin-gallery-item__actions">


                        <button
                          type="button"
                          onClick={()=>
                            moveGallery(index,-1)
                          }
                          disabled={index===0}
                        >
                          <ArrowUp size={15}/>
                        </button>


                        <button
                          type="button"
                          onClick={()=>
                            moveGallery(index,1)
                          }
                          disabled={
                            index === form.gallery.length - 1
                          }
                        >
                          <ArrowDown size={15}/>
                        </button>


                        <button
                          type="button"
                          onClick={()=>
                            set(
                              "gallery",
                              form.gallery.filter(
                                (_,i)=>i!==index
                              )
                            )
                          }
                        >
                          <Trash2 size={15}/>
                        </button>


                      </div>


                    </div>

                  )
                )}

              </div>


            </div>

          )}



          <ImageUploader
            label="صورة قبل - اختياري"
            value={
              form.before as UploadedMedia | undefined
            }
            onChange={(media)=>
              set(
                "before",
                media
              )
            }
            onClear={()=>
              set(
                "before",
                undefined
              )
            }
            folder="projects"
          />



          <ImageUploader
            label="صورة بعد - اختياري"
            value={
              form.after as UploadedMedia | undefined
            }
            onChange={(media)=>
              set(
                "after",
                media
              )
            }
            onClear={()=>
              set(
                "after",
                undefined
              )
            }
            folder="projects"
          />


        </div>

      </div>
            <div className="admin-form-section">

        <div className="admin-form-section__head">
          <span>04</span>

          <div>
            <h2>
              النشر
            </h2>
          </div>

        </div>


        <div className="admin-form__grid">

          <div className="field">

            <label>
              الحالة
            </label>

            <select
              value={form.status}
              onChange={(e)=>
                set(
                  "status",
                  e.target.value as
                  "draft" | "published"
                )
              }
            >

              <option value="draft">
                مسودة
              </option>

              <option value="published">
                منشور
              </option>

            </select>

          </div>


          <label className="field admin-check-field">

            <span>
              إظهاره ضمن المشاريع المختارة في الرئيسية
            </span>

            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e)=>
                set(
                  "featured",
                  e.target.checked
                )
              }
            />

          </label>


        </div>

      </div>


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
