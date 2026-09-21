import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { getAdminService } from "@/lib/firebase/data";
import { requireAdminPage } from "@/lib/firebase/session";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const { id } = await params;
  const service = await getAdminService(id);
  if (!service) notFound();

  return (
    <AdminShell title={`تعديل: ${service.title}`}>
      <div className="admin-record-actions"><DeleteButton endpoint={`/api/admin/services/${service.id}`} returnTo="/admin/services" label="حذف الخدمة" /></div>
      <ServiceForm service={service} />
    </AdminShell>
  );
}
