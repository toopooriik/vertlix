import Image from 'next/image';

import Container from '@/components/layout/Container';
import style from './OriginalSite.module.scss';

type OriginalSiteType = {
    id: number;
    name: string;
    link: string;
    logo?: string;
};

const originalSite: OriginalSiteType[] = [
    {
        id: 1,
        name: 'ЛеманаПро',
        link: 'https://habarovsk.lemanapro.ru/',
        logo: '/site/lemano.png',
    },
    {
        id: 2,
        name: 'Столичный двор',
        link: 'https://st-dr.ru/',
        logo: '/site/stolichniDvor.png',
    },
    {
        id: 3,
        name: 'Территория ремонта Уровень',
        link: 'https://khabarovsk.uroven.pro/',
        logo: '/site/yroven.png',
    },
];

export default function OriginalSite() {
    return (
        <section className={style.original_site}>
            <Container>
                <div className={style.original_site__content}>
                    {originalSite.map((site) => (
                        <a
                            href={site.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={style.original_site__item}
                            key={site.id}
                            title={site.name}
                        >
                            {site.logo ? (
                                <Image
                                    src={site.logo}
                                    alt={site.name}
                                    title={site.name}
                                    width={220}
                                    height={100}
                                    className={style.original_site__logo}
                                />
                            ) : (
                                <h4 className={style.original_site__name}>
                                    {site.name}
                                </h4>
                            )}
                        </a>
                    ))}
                </div>
            </Container>
        </section>
    );
}