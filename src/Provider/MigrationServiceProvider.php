<?php

namespace Wszdb\PostAlbums\Provider;

use Flarum\Foundation\AbstractServiceProvider;
use Illuminate\Database\ConnectionInterface;

class MigrationServiceProvider extends AbstractServiceProvider
{
    public function boot(ConnectionInterface $db)
    {
        // 注册迁移文件
        $this->loadMigrationsFrom(__DIR__ . '/../../migrations');
    }
}