<?php

namespace App\Service\Parser;

final readonly class ParsedProduct
{
    /**
     * @param array<string, string> $characteristics
     */
    public function __construct(
        public string $name,
        public string $source,
        public string $site,
        public int $price,
        public string $link,
        public string $image,
        public string $description,
        public array $characteristics = [],
    ) {
    }
}
