<?php

namespace App\Command;

use App\Entity\Category;
use App\Entity\Product;
use App\Entity\ProductCharacteristic;
use App\Repository\CategoryRepository;
use App\Repository\ProductRepository;
use App\Service\Parser\ParsedProduct;
use App\Service\Parser\ParserException;
use App\Service\Parser\ThermalInsulationParser;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:parser:thermal-insulation',
    description: 'Parses LemanaPro thermal insulation products into the catalog.'
)]
final class ThermalInsulationParserCommand extends Command
{
    public function __construct(
        private readonly ThermalInsulationParser $parser,
        private readonly CategoryRepository $categoryRepository,
        private readonly ProductRepository $productRepository,
        private readonly EntityManagerInterface $entityManager,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('url', InputArgument::OPTIONAL, 'Catalog URL to start parsing from.', ThermalInsulationParser::DEFAULT_URL)
            ->addArgument('category', InputArgument::OPTIONAL, 'Category id or exact category name.', ThermalInsulationParser::CATEGORY_NAME)
            ->addOption('limit', null, InputOption::VALUE_REQUIRED, 'Maximum products to import.', 20)
            ->addOption('max-sections', null, InputOption::VALUE_REQUIRED, 'Maximum second-level catalog sections to scan.', 30)
            ->addOption('max-pages', null, InputOption::VALUE_REQUIRED, 'Maximum pages per second-level catalog section.', 3)
            ->addOption('cookie', null, InputOption::VALUE_REQUIRED, 'Browser cookie string for protected sites.')
            ->addOption('source', null, InputOption::VALUE_REQUIRED, 'Fallback supplier/source name.', 'ЛеманаПро')
            ->addOption('site', null, InputOption::VALUE_REQUIRED, 'Site name saved in products.', 'ЛеманаПро')
            ->addOption('default-image', null, InputOption::VALUE_REQUIRED, 'Image path used when the product image cannot be parsed.', '/tipoProduct.svg')
            ->addOption('dry-run', null, InputOption::VALUE_NONE, 'Parse and print products without writing to the database.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $url = (string) $input->getArgument('url');
        $categoryValue = trim((string) $input->getArgument('category'));
        $limit = max(1, (int) $input->getOption('limit'));
        $maxSections = max(1, (int) $input->getOption('max-sections'));
        $maxPages = max(1, (int) $input->getOption('max-pages'));
        $cookie = $input->getOption('cookie') ? (string) $input->getOption('cookie') : null;
        $isDryRun = (bool) $input->getOption('dry-run');

        try {
            $products = $this->parser->parse(
                url: $url,
                cookie: $cookie,
                maxSections: $maxSections,
                maxPages: $maxPages,
                limit: $limit,
                defaultSource: (string) $input->getOption('source'),
                site: (string) $input->getOption('site'),
                defaultImage: (string) $input->getOption('default-image'),
                logger: $output->isVerbose() ? static fn (string $message) => $io->writeln($message) : null,
            );
        } catch (ParserException $exception) {
            $io->error($exception->getMessage());

            return Command::FAILURE;
        }

        if ($isDryRun) {
            $this->printProducts($io, $products);
            $io->success(sprintf('Dry run completed. Parsed products: %d.', count($products)));

            return Command::SUCCESS;
        }

        $category = $this->findCategory($categoryValue);

        if (!$category) {
            $io->error(sprintf('Category "%s" was not found.', $categoryValue));

            return Command::FAILURE;
        }

        [$created, $updated] = $this->saveProducts($category, $products);

        $this->entityManager->flush();
        $io->success(sprintf(
            'Thermal insulation parser completed. Category: %s. Created: %d. Updated: %d.',
            $category->getName(),
            $created,
            $updated
        ));

        return Command::SUCCESS;
    }

    private function findCategory(string $category): ?Category
    {
        if (ctype_digit($category)) {
            return $this->categoryRepository->find((int) $category);
        }

        return $this->categoryRepository->findOneBy(['name' => $category]);
    }

    /**
     * @param ParsedProduct[] $products
     * @return array{0: int, 1: int}
     */
    private function saveProducts(Category $category, array $products): array
    {
        $created = 0;
        $updated = 0;

        foreach ($products as $parsedProduct) {
            $product = $this->productRepository->findOneBy(['link' => $parsedProduct->link]);

            if (!$product) {
                $product = new Product();
                $this->entityManager->persist($product);
                $created++;
            } else {
                $updated++;
            }

            $this->fillProduct($product, $category, $parsedProduct);
        }

        return [$created, $updated];
    }

    private function fillProduct(Product $product, Category $category, ParsedProduct $parsedProduct): void
    {
        $product
            ->setCategory($category)
            ->setName($parsedProduct->name)
            ->setSource($parsedProduct->source)
            ->setSite($parsedProduct->site)
            ->setPrice($parsedProduct->price)
            ->setLink($parsedProduct->link)
            ->setImage($parsedProduct->image)
            ->setDescription($parsedProduct->description);

        foreach ($product->getCharacteristics()->toArray() as $characteristic) {
            $product->removeCharacteristic($characteristic);
            $this->entityManager->remove($characteristic);
        }

        foreach ($parsedProduct->characteristics as $name => $value) {
            $product->addCharacteristic(
                (new ProductCharacteristic())
                    ->setName((string) $name)
                    ->setValue($value)
            );
        }
    }

    /**
     * @param ParsedProduct[] $products
     */
    private function printProducts(SymfonyStyle $io, array $products): void
    {
        $rows = array_map(
            static fn (ParsedProduct $product): array => [
                $product->name,
                $product->price,
                $product->source,
                $product->link,
            ],
            $products
        );

        $io->table(['Name', 'Price', 'Source', 'Link'], $rows);
    }
}
