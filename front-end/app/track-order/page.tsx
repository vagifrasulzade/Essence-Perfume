import { Suspense } from "react";
import MainLayout from "@/layout/MainLayout";
import TrackOrder from "@/page-components/components/TrackOrder";


export default function TrackOrderPage() {
    return(
        <MainLayout>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                <TrackOrder />
            </Suspense>
        </MainLayout>
    );

}