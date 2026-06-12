<?php

namespace App\Controller\Api;

use App\Entity\Category;
use App\Entity\Product;
use App\Repository\CategoryRepository;
use App\Repository\ProductRepository;
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

    #[Route('/products/{id}', name: 'api_products_show', requirements: ['id' => '\\d+'], methods: ['GET'])]
    public function product(int $id, ProductRepository $productRepository): JsonResponse
    {
        $product = $productRepository->find($id);

        if (!$product) {
            return $this->json(['message' => 'Product not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        return $this->json($this->serializeProduct($product));
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

    private function serializeCategory(Category $category): array
    {
        return [
            'id' => $category->getId(),
            'name' => $category->getName(),
            'description' => $category->getDescription(),
            'image' => $category->getImage(),
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
}