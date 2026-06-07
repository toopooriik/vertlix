'use client';

import {useState, useEffect} from "react";
import style from './filter.module.scss';
import {categories} from "@/components/ui/filter/categories";
import {sites} from '@/components/ui/filter/site';
import {sources} from '@/components/ui/filter/source';
import Selector from '@/components/ui/selector/index';
import {SelectorItem} from "@/components/ui/selector/type";
import Input from '@/components/ui/input';

export default function Filter(){
    const [category, setCategory] = useState<SelectorItem | string>('Категории');
    const [site, setSite] = useState<SelectorItem | string>('Сайт');
    const [source, setSource] = useState<SelectorItem | string>('Поставщик');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    return(
        <div className={style.filter}>
            <div className={style.filter__control}>
                <Selector items={categories} value={category} onChangeAction={setCategory}/>
                <Selector items={sites} value={site} onChangeAction={setSite}/>
                <Selector items={sources} value={source} onChangeAction={setSource}/>
                <div className={style.filter__min_max_price}>
                    <p>Диапазон цены</p>
                    <div className={style.filter__min_max_price_inputs}>
                        <Input
                            value={minPrice}
                            setValue={setMinPrice}
                            placeholder="От"
                            maxWidth={'250px'}
                            height={'30px'}
                            typeValue={'number'}
                        />
                        <Input
                            value={maxPrice}
                            setValue={setMaxPrice}
                            placeholder="До"
                            maxWidth={'250px'}
                            height={'30px'}
                            typeValue={'number'}
                        />
                    </div>
                </div>
            </div>
            <button className={style.filter__button}>
                Найти
            </button>
        </div>
    )
}