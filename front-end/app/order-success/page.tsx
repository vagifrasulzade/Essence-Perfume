import { Suspense } from "react";
import OrderSuccess from "@/components/Order-Succes";
import MainLayout from "@/layout/MainLayout";

export default function OrderSuccessPage() {
    return (
        <MainLayout>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                <OrderSuccess />
            </Suspense>
        </MainLayout>
    );
}
