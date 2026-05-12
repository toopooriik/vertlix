import Hero from "@/components/sections/home/Hero";
import About from "@/components/sections/home/About";
import PopularCategories from "@/components/sections/home/PopularCategories";
import FAQ from "@/components/sections/home/FAQ";
export default function HomePage() {
    return (
        <main>
            <Hero/>
            <About/>
            <PopularCategories/>
            <FAQ/>
        </main>
    );
}