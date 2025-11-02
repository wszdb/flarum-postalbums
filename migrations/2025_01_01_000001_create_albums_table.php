<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->create('albums', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->unsignedInteger('followers_count')->default(0);
            $table->unsignedInteger('items_count')->default(0);
            $table->timestamps();
            
            // 索引优化
            $table->index('user_id');
            $table->index('created_at');
            $table->index('followers_count');
            
            // 外键约束
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    },
    
    'down' => function (Builder $schema) {
        $schema->dropIfExists('albums');
    }
];