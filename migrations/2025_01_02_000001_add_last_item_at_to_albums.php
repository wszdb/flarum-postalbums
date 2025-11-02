<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('albums', function (Blueprint $table) {
            $table->timestamp('last_item_at')->nullable()->after('items_count');
            $table->index('last_item_at');
        });
        
        // 初始化现有数据的 last_item_at
        $connection = $schema->getConnection();
        $connection->statement('
            UPDATE albums 
            SET last_item_at = (
                SELECT MAX(created_at) 
                FROM album_items 
                WHERE album_items.album_id = albums.id
            )
        ');
    },
    
    'down' => function (Builder $schema) {
        $schema->table('albums', function (Blueprint $table) {
            $table->dropColumn('last_item_at');
        });
    }
];