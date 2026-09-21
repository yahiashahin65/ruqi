import { BrandMark } from "@/components/BrandMark";
import { LoginForm } from "@/components/admin/LoginForm";
import { verifySessionCookie } from "@/lib/firebase/session";
import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
  if (await verifySessionCookie()) redirect("/admin");
  return (
    <main className="login-page">
      <div className="login-card">
        <BrandMark inverted />
        <h1>إدارة رقي الجمال</h1>
        <LoginForm />
      </div>
    </main>
  );
}
