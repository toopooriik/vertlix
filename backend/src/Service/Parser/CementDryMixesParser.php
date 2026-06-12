<?php

namespace App\Service\Parser;

final readonly class CementDryMixesParser
{
    public const DEFAULT_URL = 'https://habarovsk.lemanapro.ru/catalogue/suhie-smesi-i-gruntovki/';
    public const CATEGORY_NAME = 'Цемент и сухие смеси';

    public function __construct(
        private MainCatalogParser $mainCatalogParser,
    ) {
    }

    /**
     * @return ParsedProduct[]
     */
    public function parse(
        ?string $url,
        ?string $cookie,
        int $maxSections,
        int $maxPages,
        int $limit,
        string $defaultSource,
        string $site,
        string $defaultImage,
        ?callable $logger = null,
    ): array {
        return $this->mainCatalogParser->parse(
            startUrl: $url ?: self::DEFAULT_URL,
            cookie: $cookie,
            maxSections: $maxSections,
            maxPages: $maxPages,
            limit: $limit,
            defaultSource: $defaultSource,
            site: $site,
            defaultImage: $defaultImage,
            logger: $logger,
        );
    }
}
