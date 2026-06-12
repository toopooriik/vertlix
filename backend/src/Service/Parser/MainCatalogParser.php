<?php

namespace App\Service\Parser;

use Symfony\Contracts\HttpClient\HttpClientInterface;

final readonly class MainCatalogParser
{
    private const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36';

    public function __construct(
        private HttpClientInterface $httpClient,
    ) {
    }

    /**
     * @return ParsedProduct[]
     */
    public function parse(
        string $startUrl,
        ?string $cookie,
        int $maxSections,
        int $maxPages,
        int $limit,
        string $defaultSource,
        string $site,
        string $defaultImage,
        ?callable $logger = null,
    ): array {
        $startUrl = $this->cleanUrl($startUrl);
        $startHtml = $this->fetchHtml($startUrl, $cookie);
        $sectionUrls = $this->extractSectionUrls($startHtml, $startUrl);

        if ($sectionUrls === []) {
            $sectionUrls = [$startUrl];
        }

        $sectionUrls = array_slice($sectionUrls, 0, $maxSections);
        $productUrls = [];

        foreach ($sectionUrls as $sectionUrl) {
            $logger?->__invoke(sprintf('Section: %s', $sectionUrl));

            foreach ($this->extractProductUrlsFromSection($sectionUrl, $cookie, $maxPages) as $productUrl) {
                $productUrls[$productUrl] = true;

                if (count($productUrls) >= $limit) {
                    break 2;
                }
            }
        }

        if ($productUrls === []) {
            throw new ParserException('Product links were not found. The page markup may have changed or the page requires browser-rendered data.');
        }

        $products = [];

        foreach (array_keys($productUrls) as $productUrl) {
            $logger?->__invoke(sprintf('Product: %s', $productUrl));
            $products[] = $this->parseProduct($productUrl, $cookie, $defaultSource, $site, $defaultImage);
        }

        return $products;
    }

    /**
     * @return string[]
     */
    private function extractProductUrlsFromSection(string $sectionUrl, ?string $cookie, int $maxPages): array
    {
        $urls = [];
        $nextUrl = $sectionUrl;

        for ($page = 1; $page <= $maxPages && $nextUrl !== null; $page++) {
            $html = $this->fetchHtml($nextUrl, $cookie);

            foreach ($this->extractProductUrls($html, $nextUrl) as $productUrl) {
                $urls[$productUrl] = true;
            }

            $nextUrl = $this->extractNextPageUrl($html, $nextUrl);
        }

        return array_keys($urls);
    }

    private function parseProduct(
        string $url,
        ?string $cookie,
        string $defaultSource,
        string $site,
        string $defaultImage,
    ): ParsedProduct {
        $html = $this->fetchHtml($url, $cookie);
        $document = $this->createDocument($html);
        $xpath = new \DOMXPath($document);
        $jsonLd = $this->extractProductJsonLd($xpath);

        $name = $this->normalizeText((string) ($jsonLd['name'] ?? ''))
            ?: $this->firstText($xpath, '//h1')
            ?: $this->metaContent($xpath, 'og:title')
            ?: 'Без названия';

        $description = $this->extractDescriptionBeforeFeatures($xpath)
            ?: $this->normalizeText((string) ($jsonLd['description'] ?? ''))
            ?: $this->metaContent($xpath, 'og:description')
            ?: $this->metaContent($xpath, 'description')
            ?: $name;
        $description = $this->trimDescriptionAtFeatures($description);

        $image = $this->normalizeImage($jsonLd['image'] ?? null, $xpath, $url, $defaultImage);
        $price = $this->extractPrice($jsonLd, $html);
        $source = $this->extractSource($jsonLd, $defaultSource);
        $characteristics = $this->extractCharacteristicsAfterHeading($xpath) ?: $this->extractCharacteristics($xpath);
        $characteristics = $this->prependProductMetaCharacteristics($site, $source, $price, $characteristics);

        return new ParsedProduct(
            name: $this->limit($name, 255),
            source: $this->limit($source, 255),
            site: $this->limit($site, 255),
            price: $price,
            link: $this->limit($url, 500),
            image: $this->limit($image, 255),
            description: $description,
            characteristics: $characteristics,
        );
    }

    private function fetchHtml(string $url, ?string $cookie): string
    {
        $headers = [
            'User-Agent' => self::USER_AGENT,
            'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language' => 'ru-RU,ru;q=0.9,en;q=0.8',
        ];

        if ($cookie) {
            $headers['Cookie'] = $cookie;
        }

        $response = $this->httpClient->request('GET', $url, [
            'headers' => $headers,
            'max_redirects' => 5,
            'timeout' => 20,
        ]);

        $statusCode = $response->getStatusCode();
        $html = $response->getContent(false);

        if ($statusCode === 401 && str_contains((string) parse_url($url, PHP_URL_HOST), 'lemanapro.ru')) {
            throw new ParserException('Lemanapro denied the request with HTTP 401. Run the command with a valid browser cookie using --cookie="..."');
        }

        if ($statusCode >= 400) {
            throw new ParserException(sprintf('Request failed with HTTP %d for %s', $statusCode, $url));
        }

        if ($this->isQratorChallenge($html)) {
            throw new ParserException('Lemanapro returned QRATOR challenge instead of HTML. Run the command with a valid browser cookie using --cookie="..."');
        }

        return $html;
    }

    /**
     * @return string[]
     */
    private function extractSectionUrls(string $html, string $baseUrl): array
    {
        $basePath = rtrim((string) parse_url($baseUrl, PHP_URL_PATH), '/') . '/';
        $urls = [];

        foreach ($this->extractLinks($html, $baseUrl) as $url) {
            $path = (string) parse_url($url, PHP_URL_PATH);

            if (!str_starts_with($path, '/catalogue/')) {
                continue;
            }

            if (rtrim($path, '/') === rtrim($basePath, '/')) {
                continue;
            }

            if (!str_starts_with(rtrim($path, '/') . '/', $basePath)) {
                continue;
            }

            $urls[$url] = true;
        }

        return array_keys($urls);
    }

    /**
     * @return string[]
     */
    private function extractProductUrls(string $html, string $baseUrl): array
    {
        $urls = [];

        foreach ($this->extractLinks($html, $baseUrl) as $url) {
            $path = (string) parse_url($url, PHP_URL_PATH);

            if (preg_match('~/(product|products|tovar|sku)/~i', $path) !== 1) {
                continue;
            }

            $urls[$url] = true;
        }

        return array_keys($urls);
    }

    private function extractNextPageUrl(string $html, string $baseUrl): ?string
    {
        $document = $this->createDocument($html);
        $xpath = new \DOMXPath($document);

        foreach ($xpath->query('//a[@href]') as $link) {
            if (!$link instanceof \DOMElement) {
                continue;
            }

            $label = mb_strtolower($this->normalizeText($link->textContent . ' ' . $link->getAttribute('aria-label') . ' ' . $link->getAttribute('rel')));

            if (!str_contains($label, 'next') && !str_contains($label, 'след')) {
                continue;
            }

            return $this->absoluteUrl($link->getAttribute('href'), $baseUrl);
        }

        return null;
    }

    /**
     * @return string[]
     */
    private function extractLinks(string $html, string $baseUrl): array
    {
        $document = $this->createDocument($html);
        $xpath = new \DOMXPath($document);
        $host = (string) parse_url($baseUrl, PHP_URL_HOST);
        $urls = [];

        foreach ($xpath->query('//a[@href]') as $link) {
            if (!$link instanceof \DOMElement) {
                continue;
            }

            $url = $this->absoluteUrl($link->getAttribute('href'), $baseUrl);

            if ($url === null || (string) parse_url($url, PHP_URL_HOST) !== $host) {
                continue;
            }

            $urls[$this->cleanUrl($url)] = true;
        }

        return array_keys($urls);
    }

    /**
     * @return array<string, mixed>
     */
    private function extractProductJsonLd(\DOMXPath $xpath): array
    {
        foreach ($xpath->query('//script[@type="application/ld+json"]') as $script) {
            $data = json_decode($script->textContent, true);

            if (!is_array($data)) {
                continue;
            }

            $product = $this->findProductJsonLd($data);

            if ($product !== null) {
                return $product;
            }
        }

        return [];
    }

    /**
     * @param array<mixed> $data
     * @return array<string, mixed>|null
     */
    private function findProductJsonLd(array $data): ?array
    {
        $type = $data['@type'] ?? null;

        if ((is_string($type) && mb_strtolower($type) === 'product') || (is_array($type) && in_array('Product', $type, true))) {
            return $data;
        }

        foreach ($data as $value) {
            if (is_array($value)) {
                $product = $this->findProductJsonLd($value);

                if ($product !== null) {
                    return $product;
                }
            }
        }

        return null;
    }

    /**
     * @return array<string, string>
     */
    private function prependProductMetaCharacteristics(string $site, string $source, int $price, array $characteristics): array
    {
        unset($characteristics['Сайт'], $characteristics['Поставщик'], $characteristics['Цена']);

        return [
            'Сайт' => $site,
            'Поставщик' => $source,
            'Цена' => sprintf('%d ₽', $price),
        ] + $characteristics;
    }

    /**
     * @return array<string, string>
     */
    private function extractCharacteristicsAfterHeading(\DOMXPath $xpath): array
    {
        $heading = $this->findHeading($xpath, 'h2', 'Характеристики');

        if (!$heading) {
            return [];
        }

        $nodes = $this->collectSectionNodesAfterHeading($heading, ['h2']);
        $items = [];

        foreach ($nodes as $node) {
            $items += $this->extractCharacteristicsFromNode($xpath, $node);
        }

        return $items;
    }

    /**
     * @return array<string, string>
     */
    private function extractCharacteristics(\DOMXPath $xpath): array
    {
        $root = $xpath->query('//body')->item(0) ?? $xpath->query('/*')->item(0);

        return $root ? $this->extractCharacteristicsFromNode($xpath, $root) : [];
    }

    /**
     * @return array<string, string>
     */
    private function extractCharacteristicsFromNode(\DOMXPath $xpath, \DOMNode $root): array
    {
        $items = [];

        foreach ($xpath->query('.//table//tr|self::table//tr', $root) as $row) {
            $cells = $xpath->query('./th|./td', $row);

            if ($cells->length < 2) {
                continue;
            }

            $name = $this->normalizeText($cells->item(0)?->textContent ?? '');
            $value = $this->normalizeText($cells->item(1)?->textContent ?? '');

            if ($name !== '' && $value !== '') {
                $items[$this->limit($name, 255)] = $value;
            }
        }

        foreach ($xpath->query('.//dl|self::dl', $root) as $list) {
            $terms = $xpath->query('./dt', $list);
            $values = $xpath->query('./dd', $list);
            $length = min($terms->length, $values->length);

            for ($index = 0; $index < $length; $index++) {
                $name = $this->normalizeText($terms->item($index)?->textContent ?? '');
                $value = $this->normalizeText($values->item($index)?->textContent ?? '');

                if ($name !== '' && $value !== '') {
                    $items[$this->limit($name, 255)] = $value;
                }
            }
        }

        if ($items === []) {
            $items = $this->extractTextPairsFromNode($xpath, $root);
        }

        return $items;
    }

    /**
     * @return array<string, string>
     */
    private function extractTextPairsFromNode(\DOMXPath $xpath, \DOMNode $root): array
    {
        $texts = [];

        foreach ($xpath->query('.//*[not(*)]', $root) as $node) {
            $text = $this->normalizeText($node->textContent);

            if ($text === '' || $this->isIgnoredCharacteristicText($text)) {
                continue;
            }

            $texts[] = $text;
        }

        $items = [];

        for ($index = 0; $index + 1 < count($texts); $index += 2) {
            $name = $texts[$index];
            $value = $texts[$index + 1];

            if (mb_strlen($name) > 120 || $name === $value) {
                continue;
            }

            $items[$this->limit($name, 255)] = $value;
        }

        return $items;
    }

    private function isIgnoredCharacteristicText(string $text): bool
    {
        return preg_match('~^(Характеристики|Показать|Скрыть|Все характеристики)$~ui', $text) === 1;
    }

    private function extractDescriptionBeforeFeatures(\DOMXPath $xpath): string
    {
        $heading = $this->findHeading($xpath, 'h3', 'Особенности');

        if (!$heading) {
            return '';
        }

        $description = $this->collectTextBeforeHeading($heading);

        return $this->trimDescriptionAtFeatures($description);
    }

    private function collectTextBeforeHeading(\DOMElement $heading): string
    {
        $parts = [];
        $node = $heading->previousSibling;

        while ($node) {
            if ($node instanceof \DOMElement && preg_match('~^h[1-3]$~i', $node->tagName) === 1) {
                break;
            }

            $text = $this->normalizeText($node->textContent ?? '');

            if ($text !== '') {
                array_unshift($parts, $text);
            }

            $node = $node->previousSibling;
        }

        if ($parts !== []) {
            return $this->normalizeText(implode(' ', $parts));
        }

        $parent = $heading->parentNode;

        if (!$parent) {
            return '';
        }

        foreach ($parent->childNodes as $child) {
            if ($child === $heading) {
                break;
            }

            $text = $this->normalizeText($child->textContent ?? '');

            if ($text !== '') {
                $parts[] = $text;
            }
        }

        return $this->normalizeText(implode(' ', $parts));
    }

    private function trimDescriptionAtFeatures(string $description): string
    {
        $parts = preg_split('~\s*Особенности\s*:.*$~ui', $description, 2);

        return $this->normalizeText($parts[0] ?? $description);
    }

    private function findHeading(\DOMXPath $xpath, string $tagName, string $needle): ?\DOMElement
    {
        foreach ($xpath->query(sprintf('//%s', $tagName)) as $heading) {
            if (!$heading instanceof \DOMElement) {
                continue;
            }

            if (str_contains(mb_strtolower($this->normalizeText($heading->textContent)), mb_strtolower($needle))) {
                return $heading;
            }
        }

        return null;
    }

    /**
     * @param string[] $stopTags
     * @return \DOMNode[]
     */
    private function collectSectionNodesAfterHeading(\DOMElement $heading, array $stopTags): array
    {
        $nodes = $this->collectFollowingSiblings($heading, $stopTags);

        if ($nodes !== []) {
            return $nodes;
        }

        return $heading->parentNode instanceof \DOMElement
            ? $this->collectFollowingSiblings($heading->parentNode, $stopTags)
            : [];
    }

    /**
     * @param string[] $stopTags
     * @return \DOMNode[]
     */
    private function collectFollowingSiblings(\DOMNode $startNode, array $stopTags): array
    {
        $nodes = [];
        $node = $startNode->nextSibling;

        while ($node) {
            if ($node instanceof \DOMElement && in_array(mb_strtolower($node->tagName), $stopTags, true)) {
                break;
            }

            if ($this->normalizeText($node->textContent ?? '') !== '') {
                $nodes[] = $node;
            }

            $node = $node->nextSibling;
        }

        return $nodes;
    }

    /**
     * @param array<string, mixed> $jsonLd
     */
    private function extractPrice(array $jsonLd, string $html): int
    {
        $offers = $jsonLd['offers'] ?? null;
        $price = null;

        if (is_array($offers)) {
            $offer = array_is_list($offers) ? ($offers[0] ?? []) : $offers;
            $price = is_array($offer) ? ($offer['price'] ?? $offer['lowPrice'] ?? null) : null;
        }

        if ($price === null && preg_match('~"price"\s*:\s*"?([0-9\s.,]+)"?~u', $html, $matches) === 1) {
            $price = $matches[1];
        }

        $normalized = preg_replace('~[^\d]~', '', (string) $price);

        return $normalized !== '' ? (int) $normalized : 0;
    }

    /**
     * @param array<string, mixed> $jsonLd
     */
    private function extractSource(array $jsonLd, string $defaultSource): string
    {
        $brand = $jsonLd['brand'] ?? null;

        if (is_array($brand)) {
            return $this->normalizeText((string) ($brand['name'] ?? $defaultSource));
        }

        if (is_string($brand) && trim($brand) !== '') {
            return $this->normalizeText($brand);
        }

        return $defaultSource;
    }

    private function normalizeImage(mixed $image, \DOMXPath $xpath, string $baseUrl, string $defaultImage): string
    {
        if (is_array($image)) {
            $image = $image[0] ?? null;
        }

        if (is_string($image) && trim($image) !== '') {
            return $this->absoluteUrl($image, $baseUrl) ?? $defaultImage;
        }

        $metaImage = $this->metaContent($xpath, 'og:image');

        if ($metaImage !== '') {
            return $this->absoluteUrl($metaImage, $baseUrl) ?? $defaultImage;
        }

        return $defaultImage;
    }

    private function metaContent(\DOMXPath $xpath, string $name): string
    {
        $query = sprintf('//meta[@property="%1$s" or @name="%1$s"]/@content', $name);
        $node = $xpath->query($query)->item(0);

        return $node ? $this->normalizeText($node->nodeValue ?? '') : '';
    }

    private function firstText(\DOMXPath $xpath, string $query): string
    {
        $node = $xpath->query($query)->item(0);

        return $node ? $this->normalizeText($node->textContent) : '';
    }

    private function createDocument(string $html): \DOMDocument
    {
        $document = new \DOMDocument('1.0', 'UTF-8');
        $previous = libxml_use_internal_errors(true);
        $document->loadHTML('<?xml encoding="UTF-8">' . $html, LIBXML_NOWARNING | LIBXML_NOERROR);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        return $document;
    }

    private function absoluteUrl(string $href, string $baseUrl): ?string
    {
        $href = trim($href);

        if ($href === '' || str_starts_with($href, '#') || str_starts_with($href, 'javascript:') || str_starts_with($href, 'mailto:')) {
            return null;
        }

        if (str_starts_with($href, '//')) {
            return (string) parse_url($baseUrl, PHP_URL_SCHEME) . ':' . $href;
        }

        if (parse_url($href, PHP_URL_SCHEME)) {
            return $href;
        }

        $scheme = (string) parse_url($baseUrl, PHP_URL_SCHEME);
        $host = (string) parse_url($baseUrl, PHP_URL_HOST);

        if (str_starts_with($href, '/')) {
            return sprintf('%s://%s%s', $scheme, $host, $href);
        }

        $path = (string) parse_url($baseUrl, PHP_URL_PATH);
        $directory = rtrim(str_replace('\\', '/', dirname($path)), '/');

        return sprintf('%s://%s%s/%s', $scheme, $host, $directory === '' ? '' : '/' . $directory, $href);
    }

    private function cleanUrl(string $url): string
    {
        return preg_replace('~#.*$~', '', trim($url)) ?? trim($url);
    }

    private function normalizeText(string $text): string
    {
        return trim((string) preg_replace('~\s+~u', ' ', html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8')));
    }

    private function limit(string $value, int $length): string
    {
        return mb_substr($value, 0, $length);
    }

    private function isQratorChallenge(string $html): bool
    {
        return str_contains($html, '/__qrator/qauth.js') || str_contains($html, 'qauth.js');
    }
}
