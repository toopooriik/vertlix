<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260613090000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add product and category view counters for popular sliders.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE categories ADD view_count INT DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE products ADD view_count INT DEFAULT 0 NOT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE categories DROP view_count');
        $this->addSql('ALTER TABLE products DROP view_count');
    }
}
