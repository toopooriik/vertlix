import Selector from '@/components/ui/selector/index';
import Container from "@/components/layout/Container";
import {categories} from "@/components/ui/filter/categories";
export default function HomePage() {
    return (
        <main>
            <Container>
                <Selector items={categories} placeholder={'Категории'}/>
            </Container>

        </main>
    );
}