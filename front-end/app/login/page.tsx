import { Suspense } from "react";
import Login from "@/components/auth/Login";
import MainLayout from "@/layout/MainLayout";

export default function LoginPage()
{
    return(
        <MainLayout>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                <Login />
            </Suspense>
        </MainLayout>
    );
}