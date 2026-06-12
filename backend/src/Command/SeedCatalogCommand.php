<?php

namespace App\Command;

use App\Entity\Category;
use App\Entity\Product;
use App\Entity\ProductCharacteristic;
use App\Repository\CategoryRepository;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:seed-catalog',
    description: 'Seeds catalog categories and starter products.'
)]
class SeedCatalogCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly CategoryRepository $categoryRepository,
        private readonly ProductRepository $productRepository,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $createdCategories = 0;
        $createdProducts = 0;

        foreach ($this->getCategories() as $categoryData) {
            $category = $this->categoryRepository->findOneBy(['name' => $categoryData['name']]);

            if (!$category) {
                $category = (new Category())
                    ->setName($categoryData['name'])
                    ->setDescription($categoryData['description'])
                    ->setImage($categoryData['image']);

                $this->entityManager->persist($category);
                $createdCategories++;
            }

            foreach ($categoryData['products'] as $productData) {
                $existingProduct = $this->productRepository->findOneBy([
                    'name' => $productData['name'],
                    'category' => $category,
                ]);

                if ($existingProduct) {
                    continue;
                }

                $product = (new Product())
                    ->setCategory($category)
                    ->setName($productData['name'])
                    ->setSource($productData['source'])
                    ->setSite($productData['site'])
                    ->setPrice($productData['price'])
                    ->setLink($productData['link'])
                    ->setImage($productData['image'])
                    ->setDescription($productData['description']);

                foreach ($productData['characteristics'] as $name => $value) {
                    $product->addCharacteristic(
                        (new ProductCharacteristic())
                            ->setName($name)
                            ->setValue($value)
                    );
                }

                $this->entityManager->persist($product);
                $createdProducts++;
            }
        }

        $this->entityManager->flush();

        $io->success(sprintf(
            'Catalog seed completed. Created categories: %d. Created products: %d.',
            $createdCategories,
            $createdProducts
        ));

        return Command::SUCCESS;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getCategories(): array
    {
        return [
            [
                'name' => 'Цемент и сухие смеси',
                'description' => 'Цемент, штукатурка, шпаклевка, клеевые смеси, наливные полы и другие материалы для строительных и отделочных работ.',
                'image' => '/categories/cement.png',
                'products' => [
                    [
                        'name' => 'Цемент М500',
                        'source' => 'ЦементТорг',
                        'site' => 'ЛеманаПро',
                        'price' => 540,
                        'link' => 'https://habarovsk.lemanapro.ru/',
                        'image' => '/tipoProduct.svg',
                        'description' => 'Прочный цемент для бетона, кладочных растворов и общестроительных работ.',
                        'characteristics' => [
                            'марка' => 'М500',
                            'вес' => '50 кг',
                            'тип' => 'портландцемент',
                            'применение' => 'бетон, кладка, стяжка',
                        ],
                    ],
                    [
                        'name' => 'Штукатурка гипсовая',
                        'source' => 'MasterMix',
                        'site' => 'Территория ремонта Уровень',
                        'price' => 430,
                        'link' => 'https://khabarovsk.uroven.pro/',
                        'image' => '/tipoProduct.svg',
                        'description' => 'Сухая смесь для выравнивания стен и потолков внутри помещений.',
                        'characteristics' => [
                            'основа' => 'гипс',
                            'вес' => '30 кг',
                            'слой' => '5-50 мм',
                            'применение' => 'внутренние работы',
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Кирпич и блоки',
                'description' => 'Керамический кирпич, газобетонные блоки, пеноблоки, шлакоблоки и материалы для возведения стен.',
                'image' => '/categories/kirpichi.png',
                'products' => [
                    [
                        'name' => 'Кирпич облицовочный',
                        'source' => 'СтройМаркет',
                        'site' => 'ЛеманаПро',
                        'price' => 1250,
                        'link' => 'https://habarovsk.lemanapro.ru/',
                        'image' => '/tipoProduct.svg',
                        'description' => 'Облицовочный кирпич для фасадов, декоративных стен и архитектурных элементов.',
                        'characteristics' => [
                            'тип' => 'облицовочный',
                            'размер' => '250x120x65 мм',
                            'цвет' => 'красный',
                            'применение' => 'фасад, отделка',
                        ],
                    ],
                    [
                        'name' => 'Газобетонный блок D500',
                        'source' => 'BuildHouse',
                        'site' => 'Столичный двор',
                        'price' => 890,
                        'link' => 'https://st-dr.ru/',
                        'image' => '/tipoProduct.svg',
                        'description' => 'Легкий блок для возведения наружных и внутренних стен.',
                        'characteristics' => [
                            'плотность' => 'D500',
                            'размер' => '600x300x200 мм',
                            'теплопроводность' => 'низкая',
                            'применение' => 'стены',
                        ],
                    ],
                ],
            ],
            ['name' => 'Плитка и керамогранит', 'description' => 'Напольная и настенная плитка, керамогранит, декоративные покрытия для внутренних и наружных работ.', 'image' => '/categories/plitca.png', 'products' => []],
            ['name' => 'Пиломатериалы', 'description' => 'Доски, брус, фанера, OSB-плиты и древесные материалы для строительства и ремонта.', 'image' => '/categories/derevo.png', 'products' => []],
            ['name' => 'Металлопрокат', 'description' => 'Арматура, профили, трубы, листовой металл и комплектующие для строительных конструкций.', 'image' => '/categories/metal.png', 'products' => []],
            ['name' => 'Кровельные материалы', 'description' => 'Металлочерепица, профнастил, мягкая кровля, утеплители и комплектующие для крыши.', 'image' => '/categories/crovlia.png', 'products' => []],
            ['name' => 'Отделочные материалы', 'description' => 'Краски, обои, декоративные панели, ламинат и решения для финальной отделки.', 'image' => '/categories/otdelka.png', 'products' => []],
            ['name' => 'Изоляционные материалы', 'description' => 'Теплоизоляция, гидроизоляция, шумоизоляция и материалы для защиты конструкций.', 'image' => '/categories/izolica.png', 'products' => []],
            ['name' => 'Сантехника и инженерия', 'description' => 'Трубы, фитинги, сантехнические комплектующие и материалы для инженерных систем.', 'image' => '/categories/santehnica.png', 'products' => []],
            ['name' => 'Крепеж и расходники', 'description' => 'Саморезы, анкеры, гвозди, крепежные элементы и сопутствующие строительные товары.', 'image' => '/categories/bolti.png', 'products' => []],
        ];
    }
}