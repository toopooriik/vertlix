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
     * @return string[]
     */
    public function findDistinctSites(): array
    {
        return array_map(
            static fn (array $row): string => (string) $row['value'],
            $this->createQueryBuilder('product')
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
    public function findDistinctSources(): array
    {
        return array_map(
            static fn (array $row): string => (string) $row['value'],
            $this->createQueryBuilder('product')
                ->select('DISTINCT product.source AS value')
                ->andWhere('product.source != :empty')
                ->setParameter('empty', '')
                ->orderBy('product.source', 'ASC')
                ->getQuery()
                ->getScalarResult()
        );
    }
}
