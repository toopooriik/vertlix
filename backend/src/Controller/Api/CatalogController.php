<?php

namespace App\Controller\Api;

use App\Entity\Category;
use App\Entity\Product;
use App\Repository\CategoryRepository;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class CatalogController extends AbstractController
{
    #[Route('/categories', name: 'api_categories_index', methods: ['GET'])]
    public function categories(CategoryRepository $categoryRepository): JsonResponse
    {
        $categories = $categoryRepository->findBy([], ['id' => 'ASC']);

        return $this->json(array_map(
            fn (Category $category): array => $this->serializeCategory($category),
            $categories
        ));
    }

    #[Route('/categories/popular', name: 'api_categories_popular', methods: ['GET'])]
    public function popularCategories(Request $request, CategoryRepository $categoryRepository): JsonResponse
    {
        $limit = $this->getLimit($request, 5, 20);

        return $this->json(array_map(
            fn (Category $category): array => $this->serializeCategory($category),
            $categoryRepository->findPopular($limit)
        ));
    }

    #[Route('/categories/{id}/products', name: 'api_category_products', requirements: ['id' => '\\d+'], methods: ['GET'])]
    public function categoryProducts(int $id, CategoryRepository $categoryRepository): JsonResponse
    {
        $category = $categoryRepository->find($id);

        if (!$category) {
            return $this->json(['message' => 'Category not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        return $this->json([
            'category' => $this->serializeCategory($category),
            'products' => array_map(
                fn (Product $product): array => $this->serializeProduct($product),
                $category->getProducts()->toArray()
            ),
        ]);
    }

    #[Route('/categories/{id}/view', name: 'api_categories_track_view', requirements: ['id' => '\\d+'], methods: ['POST'])]
    public function trackCategoryView(
        int $id,
        CategoryRepository $categoryRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $category = $categoryRepository->find($id);

        if (!$category) {
            return $this->json(['message' => 'Category not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $category->incrementViewCount();
        $entityManager->flush();

        return $this->json([
            'status' => 'ok',
            'categoryId' => $category->getId(),
            'viewCount' => $category->getViewCount(),
        ]);
    }

    #[Route('/products/{id}', name: 'api_products_show', requirements: ['id' => '\\d+'], methods: ['GET'])]
    public function product(int $id, ProductRepository $productRepository): JsonResponse
    {
        $product = $productRepository->find($id);

        if (!$product) {
            return $this->json(['message' => 'Product not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        return $this->json($this->serializeProduct($product));
    }

    #[Route('/products/popular', name: 'api_products_popular', methods: ['GET'])]
    public function popularProducts(Request $request, ProductRepository $productRepository): JsonResponse
    {
        $limit = $this->getLimit($request, 15, 50);

        return $this->json(array_map(
            fn (Product $product): array => $this->serializeProduct($product),
            $productRepository->findPopular($limit)
        ));
    }

    #[Route('/products/{id}/view', name: 'api_products_track_view', requirements: ['id' => '\\d+'], methods: ['POST'])]
    public function trackProductView(
        int $id,
        ProductRepository $productRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $product = $productRepository->find($id);

        if (!$product) {
            return $this->json(['message' => 'Product not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $product->incrementViewCount();
        $product->getCategory()?->incrementViewCount();
        $entityManager->flush();

        return $this->json([
            'status' => 'ok',
            'productId' => $product->getId(),
            'productViewCount' => $product->getViewCount(),
            'categoryId' => $product->getCategory()?->getId(),
            'categoryViewCount' => $product->getCategory()?->getViewCount(),
        ]);
    }

    #[Route('/products/search', name: 'api_products_search', methods: ['GET'])]
    public function search(Request $request, ProductRepository $productRepository): JsonResponse
    {
        $query = trim((string) $request->query->get('q', ''));

        if ($query === '') {
            return $this->json([]);
        }

        return $this->json(array_map(
            fn (Product $product): array => $this->serializeProduct($product),
            $productRepository->search($query)
        ));
    }

    #[Route('/products/filter-options', name: 'api_products_filter_options', methods: ['GET'])]
    public function filterOptions(Request $request, ProductRepository $productRepository): JsonResponse
    {
        $categoryIdValue = (string) $request->query->get('categoryId', '');
        $categoryId = ctype_digit($categoryIdValue) ? (int) $categoryIdValue : null;
        $site = trim((string) $request->query->get('site', '')) ?: null;

        return $this->json([
            'sites' => $productRepository->findDistinctSites($categoryId),
            'sources' => $productRepository->findDistinctSources($categoryId, $site),
        ]);
    }

    private function serializeCategory(Category $category): array
    {
        return [
            'id' => $category->getId(),
            'name' => $category->getName(),
            'description' => $category->getDescription(),
            'image' => $category->getImage(),
            'viewCount' => $category->getViewCount(),
            'createdAt' => $category->getCreatedAt()->format(DATE_ATOM),
            'updatedAt' => $category->getUpdatedAt()->format(DATE_ATOM),
        ];
    }

    private function serializeProduct(Product $product): array
    {
        $category = $product->getCategory();

        return [
            'id' => $product->getId(),
            'categoryId' => $category?->getId(),
            'category' => $category?->getName(),
            'name' => $product->getName(),
            'source' => $product->getSource(),
            'site' => $product->getSite(),
            'price' => $product->getPrice(),
            'link' => $product->getLink(),
            'image' => $product->getImage(),
            'description' => $product->getDescription(),
            'characteristics' => $this->serializeCharacteristics($product),
            'viewCount' => $product->getViewCount(),
            'createdAt' => $product->getCreatedAt()->format(DATE_ATOM),
            'updatedAt' => $product->getUpdatedAt()->format(DATE_ATOM),
        ];
    }

    private function serializeCharacteristics(Product $product): array
    {
        $characteristics = [];

        foreach ($product->getCharacteristics() as $characteristic) {
            $characteristics[$characteristic->getName()] = $characteristic->getValue();
        }

        return $characteristics;
    }

    private function getLimit(Request $request, int $default, int $max): int
    {
        $limit = (int) $request->query->get('limit', $default);

        if ($limit < 1) {
            return $default;
        }

        return min($limit, $max);
    }
}
