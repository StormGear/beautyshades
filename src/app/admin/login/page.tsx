import { Suspense } from "react";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export const metadata = { title: "Admin login" };

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}
