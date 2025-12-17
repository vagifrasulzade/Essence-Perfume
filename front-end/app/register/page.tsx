import { Suspense } from "react";
import Register from "@/components/auth/Register";
import MainLayout from "@/layout/MainLayout";

export default function RegisterPage() {
    return (
        <MainLayout>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                <Register />
            </Suspense>
        </MainLayout>
    );
}