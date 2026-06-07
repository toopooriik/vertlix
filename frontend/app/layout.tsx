import type { Metadata } from 'next';

import '@/styles/globals.scss';
import '@/styles/reset.scss';
import { lato } from '@/lib/fonts';

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Navigation from "@/components/ui/navigation";

export const metadata: Metadata = {
    title: 'Veltrix',
    description: 'Сервис подбора строительных материалов',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <body className={lato.variable}>
            <Navigation/>
            <Header/>
                {children}
            <Footer/>
            </body>
        </html>
    );
}