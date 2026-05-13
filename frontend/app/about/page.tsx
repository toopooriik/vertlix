import Hero from "@/components/sections/about/Hero";
import Reasons from "@/components/sections/about/Reasons";
import Description from "@/components/sections/about/Description";
import Works from "@/components/sections/about/Works";
import Community from "@/components/sections/about/Community/Community";
export default function HomePage() {
    return (
        <main>
            <Hero/>
            <Reasons/>
            <Description/>
            <Works/>
            <Community/>
        </main>
    );
}