<?php

namespace App\Command;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:seed-catalog',
    description: 'Seeds catalog categories.'
)]
class SeedCatalogCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly CategoryRepository $categoryRepository,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $createdCategories = 0;

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
        }

        $this->entityManager->flush();

        $io->success(sprintf(
            'Catalog seed completed. Created categories: %d.',
            $createdCategories
        ));

        return Command::SUCCESS;
    }

    /**
     * @return array<int, array{name: string, description: string, image: string}>
     */
    private function getCategories(): array
    {
        return [
            [
                'name' => 'Цемент и сухие смеси',
                'description' => 'Цемент, штукатурка, шпаклевка, клеевые смеси, наливные полы и другие материалы для строительных и отделочных работ.',
                'image' => '/categories/cement.png',
            ],
            [
                'name' => 'Кирпич и блоки',
                'description' => 'Керамический кирпич, газобетонные блоки, пеноблоки, шлакоблоки и материалы для возведения стен.',
                'image' => '/categories/kirpichi.png',
            ],
            ['name' => 'Плитка и керамогранит', 'description' => 'Напольная и настенная плитка, керамогранит, декоративные покрытия для внутренних и наружных работ.', 'image' => '/categories/plitca.png'],
            ['name' => 'Пиломатериалы', 'description' => 'Доски, брус, фанера, OSB-плиты и древесные материалы для строительства и ремонта.', 'image' => '/categories/derevo.png'],
            ['name' => 'Металлопрокат', 'description' => 'Арматура, профили, трубы, листовой металл и комплектующие для строительных конструкций.', 'image' => '/categories/metal.png'],
            ['name' => 'Кровельные материалы', 'description' => 'Металлочерепица, профнастил, мягкая кровля, утеплители и комплектующие для крыши.', 'image' => '/categories/crovlia.png'],
            ['name' => 'Отделочные материалы', 'description' => 'Краски, обои, декоративные панели, ламинат и решения для финальной отделки.', 'image' => '/categories/otdelka.png'],
            ['name' => 'Изоляционные материалы', 'description' => 'Теплоизоляция, гидроизоляция, шумоизоляция и материалы для защиты конструкций.', 'image' => '/categories/izolica.png'],
            ['name' => 'Сантехника и инженерия', 'description' => 'Трубы, фитинги, сантехнические комплектующие и материалы для инженерных систем.', 'image' => '/categories/santehnica.png'],
            ['name' => 'Крепеж и расходники', 'description' => 'Саморезы, анкеры, гвозди, крепежные элементы и сопутствующие строительные товары.', 'image' => '/categories/bolti.png'],
        ];
    }
}
