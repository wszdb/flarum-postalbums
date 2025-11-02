<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        // 检查 updated_at 列是否已存在
        if (!$schema->hasColumn('albums', 'updated_at')) {
            $schema->table('albums', function (Blueprint $table) {
                $table->timestamp('updated_at')->nullable()->after('created_at');
            });
        }
    },
    
    'down' => function (Builder $schema) {
        if ($schema->hasColumn('albums', 'updated_at')) {
            $schema->table('albums', function (Blueprint $table) {
                $table->dropColumn('updated_at');
            });
        }
    }
];