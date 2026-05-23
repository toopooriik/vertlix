import Hero from "@/components/sections/about/Hero";
import About from "@/components/sections/about/About";
import Reasons from "@/components/sections/about/Reasons";
import Description from "@/components/sections/about/Description";
import Works from "@/components/sections/about/Works";
export default function HomePage() {
    return (
        <main>
            <Hero/>
            <Reasons/>
            <Description/>
            <About/>
            <Works/>
        </main>
    );
}