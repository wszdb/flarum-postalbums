<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->create('album_items', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('album_id');
            $table->unsignedInteger('post_id');
            $table->string('custom_title', 500)->nullable();
            $table->enum('post_type', ['discussion', 'post'])->default('post');
            $table->unsignedInteger('user_id'); // 添加该收藏项的用户
            $table->timestamps();
            
            // 索引优化
            $table->index('album_id');
            $table->index('post_id');
            $table->index(['album_id', 'created_at']); // 复合索引用于排序
            
            // 唯一约束：同一专辑不能重复收藏同一帖子
            $table->unique(['album_id', 'post_id']);
            
            // 外键约束
            $table->foreign('album_id')
                  ->references('id')
                  ->on('albums')
                  ->onDelete('cascade');
                  
            $table->foreign('post_id')
                  ->references('id')
                  ->on('posts')
                  ->onDelete('cascade');
                  
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    },
    
    'down' => function (Builder $schema) {
        $schema->dropIfExists('album_items');
    }
];