import Hero from '@/components/sections/home/Hero';
import TopProducts from '@/components/sections/home/TopProducts';
import PopularCategories from '@/components/sections/home/PopularCategories';
import OriginalSite from '@/components/sections/home/OriginalSite';

export default function HomePage() {
    return (
        <main>
            <Hero />
            <TopProducts />
            <OriginalSite />
            <PopularCategories />
        </main>
    );
}