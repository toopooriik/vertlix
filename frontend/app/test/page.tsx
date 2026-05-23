'use client';

import {useState, useEffect} from "react";
import Selector from '@/components/ui/selector/index';
import Container from "@/components/layout/Container";
import {categories} from "@/components/ui/filter/categories";
import {SelectorItem} from "@/components/ui/selector/type";
export default function HomePage() {
    const [selectedPoint, setSelectedPoint] = useState<SelectorItem | string>('Категории');
    useEffect(() => {
        console.log(selectedPoint);
    }, [selectedPoint]);
    return (
        <main>
            <Container>
                <Selector
                    items={categories}
                    value={selectedPoint}
                    onChangeAction={setSelectedPoint}
                />
            </Container>

        </main>
    );
}