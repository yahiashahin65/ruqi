"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Trash2, Plus } from "lucide-react";
import type { Service } from "@/lib/types";
import { ImageUploader, type UploadedMedia } from "./ImageUploader";

type ServiceEditor = {
  title: string;
  excerpt: string;
  body: string;
  deliverables: string[];
  image?: UploadedMedia;
  gallery: UploadedMedia[];
  status: "draft" | "published";
};

function initialState(service?: Service): ServiceEditor {
  return {
    title: service?.title || "",
    excerpt: service?.excerpt || "",
    body: service?.body || "",
    deliverables: service?.deliverables?.length
      ? service.deliverables
      : [""],
    image: service?.image as UploadedMedia | undefined,
    gallery: (service?.gallery || []) as UploadedMedia[],
    status: service?.status || "draft"
  };
}

export function ServiceForm({
  service
}: {
  service?: Service;
}) {
  const router = useRouter();

  const [form, setForm] = useState<ServiceEditor>(() =>
    initialState(service)
  );

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);


  const set = <K extends keyof ServiceEditor>(
    key: K,
    value: ServiceEditor[K]
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
      service
        ? `/api/admin/services/${service.id}`
        : "/api/admin/services",
      {
        method: service ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: form.title,
          excerpt: form.excerpt,
          body: form.body,
          deliverables: form.deliverables
            .map((item) => item.trim())
            .filter(Boolean),
          image: form.image,
          gallery: form.gallery,
          status: form.status
        })
      }
    );


    const data = await response.json();


    if (!response.ok) {
      setMessage(
        data.error || "تعذر حفظ الخدمة"
      );
    } else {
      router.push("/admin/services");
      router.refresh();
    }


    setSaving(false);
  }



  function updateDeliverable(
    index: number,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      deliverables:
        prev.deliverables.map(
          (item, i) =>
            i === index ? value : item
        )
    }));
  }



  function moveGallery(
    index: number,
    direction: -1 | 1
  ) {
    setForm((prev) => {

      const next = [
        ...prev.gallery
      ];

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
              الخدمة
            </h2>

            <p>
              المعلومات الأساسية للخدمة.
            </p>
          </div>
        </div>


        <div className="admin-form__grid">


          <div className="field field--full">

            <label>
              اسم الخدمة
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



          <div className="field field--full">

            <label>
              وصف مختصر
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
              تفاصيل الخدمة
            </label>

            <textarea
              className="admin-textarea--large"
              value={form.body}
              onChange={(e)=>
                set(
                  "body",
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

          <span>02</span>

          <div>
            <h2>
              ماذا تشمل الخدمة؟
            </h2>
          </div>

        </div>



        <div className="admin-repeat-list">


          {form.deliverables.map(
            (item,index)=>(

              <div
                className="admin-repeat-row"
                key={index}
              >

                <input
                  value={item}
                  onChange={(e)=>
                    updateDeliverable(
                      index,
                      e.target.value
                    )
                  }
                />


                <button
                  type="button"
                  onClick={()=>
                    set(
                      "deliverables",
                      form.deliverables.filter(
                        (_,i)=>i !== index
                      )
                    )
                  }
                >

                  <Trash2 size={16}/>

                </button>


              </div>

            )
          )}



          <button
            type="button"
            className="button button--ghost admin-add-row"
            onClick={()=>
              set(
                "deliverables",
                [
                  ...form.deliverables,
                  ""
                ]
              )
            }
          >

            <Plus size={16}/>
            إضافة نقطة

          </button>


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
              الصورة الرئيسية ثم صور معرض الخدمة.
            </p>

          </div>

        </div>



        <div className="admin-form__grid">


          <ImageUploader
            label="الصورة الرئيسية"
            value={form.image}
            onChange={(media)=>
              set(
                "image",
                media
              )
            }
            onClear={()=>
              set(
                "image",
                undefined
              )
            }
            folder="services"
          />



          <ImageUploader
            label="إضافة صورة للخدمة"
            onChange={(media)=>
              set(
                "gallery",
                [
                  ...form.gallery,
                  media
                ]
              )
            }
            folder="services"
          />



          {form.gallery.length > 0 && (

            <div className="field field--full">

              <label>
                صور الخدمة
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
                          `صورة ${index+1}`
                        }
                      />


                      <div className="admin-gallery-item__actions">


                        <button
                          type="button"
                          onClick={()=>
                            moveGallery(
                              index,
                              -1
                            )
                          }
                          disabled={
                            index === 0
                          }
                        >
                          <ArrowUp size={15}/>
                        </button>



                        <button
                          type="button"
                          onClick={()=>
                            moveGallery(
                              index,
                              1
                            )
                          }
                          disabled={
                            index ===
                            form.gallery.length - 1
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
                                (_,i)=>
                                  i !== index
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
                منشورة
              </option>

            </select>

          </div>


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
          !form.image?.url
        }
      >

        {
          saving
            ? "جاري الحفظ..."
            : "حفظ الخدمة"
        }


      </button>



    </form>
  );
}
