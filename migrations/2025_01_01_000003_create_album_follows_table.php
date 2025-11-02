<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->create('album_follows', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('album_id');
            $table->unsignedInteger('user_id');
            $table->timestamp('created_at')->nullable();
            
            // 索引优化
            $table->index('album_id');
            $table->index('user_id');
            
            // 唯一约束：同一用户不能重复关注同一专辑
            $table->unique(['album_id', 'user_id']);
            
            // 外键约束
            $table->foreign('album_id')
                  ->references('id')
                  ->on('albums')
                  ->onDelete('cascade');
                  
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    },
    
    'down' => function (Builder $schema) {
        $schema->dropIfExists('album_follows');
    }
];