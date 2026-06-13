<?php

namespace App\Repository;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    /**
     * @return Product[]
     */
    public function search(string $query): array
    {
        return $this->createQueryBuilder('product')
            ->leftJoin('product.category', 'category')
            ->addSelect('category')
            ->andWhere('LOWER(product.name) LIKE LOWER(:query)')
            ->orWhere('LOWER(product.source) LIKE LOWER(:query)')
            ->orWhere('LOWER(product.site) LIKE LOWER(:query)')
            ->orWhere('LOWER(category.name) LIKE LOWER(:query)')
            ->setParameter('query', '%' . $query . '%')
            ->orderBy('product.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @return Product[]
     */
    public function findPopular(int $limit = 15): array
    {
        return $this->createQueryBuilder('product')
            ->leftJoin('product.category', 'category')
            ->addSelect('category')
            ->orderBy('product.viewCount', 'DESC')
            ->addOrderBy('product.updatedAt', 'DESC')
            ->addOrderBy('product.id', 'ASC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * @return string[]
     */
    public function findDistinctSites(?int $categoryId = null): array
    {
        $queryBuilder = $this->createFilterOptionsQueryBuilder($categoryId);

        return array_map(
            static fn (array $row): string => (string) $row['value'],
            $queryBuilder
                ->select('DISTINCT product.site AS value')
                ->andWhere('product.site != :empty')
                ->setParameter('empty', '')
                ->orderBy('product.site', 'ASC')
                ->getQuery()
                ->getScalarResult()
        );
    }

    /**
     * @return string[]
     */
    public function findDistinctSources(?int $categoryId = null, ?string $site = null): array
    {
        $queryBuilder = $this->createFilterOptionsQueryBuilder($categoryId, $site);

        return array_map(
            static fn (array $row): string => (string) $row['value'],
            $queryBuilder
                ->select('DISTINCT product.source AS value')
                ->andWhere('product.source != :empty')
                ->setParameter('empty', '')
                ->orderBy('product.source', 'ASC')
                ->getQuery()
                ->getScalarResult()
        );
    }

    private function createFilterOptionsQueryBuilder(?int $categoryId = null, ?string $site = null): \Doctrine\ORM\QueryBuilder
    {
        $queryBuilder = $this->createQueryBuilder('product');

        if ($categoryId !== null) {
            $queryBuilder
                ->innerJoin('product.category', 'category')
                ->andWhere('category.id = :categoryId')
                ->setParameter('categoryId', $categoryId);
        }

        if ($site !== null && trim($site) !== '') {
            $queryBuilder
                ->andWhere('product.site = :site')
                ->setParameter('site', trim($site));
        }

        return $queryBuilder;
    }
}
