<?php

/*
 * This file is part of wszdb/flarum-postalbums.
 *
 * Copyright (c) 2025 wszdb.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Wszdb\PostAlbums;

use Flarum\Extend;
use Wszdb\PostAlbums\Provider\MigrationServiceProvider;

return [
    // 注册服务提供者（用于加载迁移文件）
    (new Extend\ServiceProvider())
        ->register(MigrationServiceProvider::class),

    // 注册前端资源
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less')
        ->route('/albums', 'albums.index')
        ->route('/albums/{id}', 'albums.show'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/resources/less/admin.less'),

    // 注册本地化文件
    new Extend\Locales(__DIR__.'/locale'),

    // 注册API路由
    (new Extend\Routes('api'))
        // 专辑路由
        ->get('/albums', 'albums.index', Api\Controller\ListAlbumsController::class)
        ->post('/albums', 'albums.create', Api\Controller\CreateAlbumController::class)
        ->get('/albums/{id}', 'albums.show', Api\Controller\ShowAlbumController::class)
        ->patch('/albums/{id}', 'albums.update', Api\Controller\UpdateAlbumController::class)
        ->delete('/albums/{id}', 'albums.delete', Api\Controller\DeleteAlbumController::class)
        
        // 专辑收藏项路由
        ->post('/albums/{id}/items', 'albums.items.create', Api\Controller\AddAlbumItemController::class)
        ->patch('/albums/{albumId}/items/{id}', 'albums.items.update', Api\Controller\UpdateAlbumItemController::class)
        ->delete('/albums/{id}/items/{itemId}', 'albums.items.delete', Api\Controller\RemoveAlbumItemController::class)
        
        // 专辑关注路由
        ->post('/albums/{id}/follow', 'albums.follow', Api\Controller\FollowAlbumController::class)
        ->delete('/albums/{id}/follow', 'albums.unfollow', Api\Controller\UnfollowAlbumController::class),

    // 注册设置
    (new Extend\Settings())
        ->default('postalbums.recommendations_position', 'last_post')
        ->default('postalbums.recommendations_count', 2)
        ->serializeToForum('postalbums.display_name', 'postalbums.display_name', function ($value) {
            return $value ?: '帖子专辑';
        })
        ->serializeToForum('postalbums.album_title_length', 'postalbums.album_title_length', 'intval')
        ->serializeToForum('postalbums.album_description_length', 'postalbums.album_description_length', 'intval')
        ->serializeToForum('postalbums.item_title_length', 'postalbums.item_title_length', 'intval')
        ->serializeToForum('postalbums.albums_per_page', 'postalbums.albums_per_page', 'intval')
        ->serializeToForum('postalbums.items_per_page', 'postalbums.items_per_page', 'intval')
        ->serializeToForum('postalbums.min_discussions_to_create', 'postalbums.min_discussions_to_create', 'intval')
        ->serializeToForum('postalbums.max_items_per_album', 'postalbums.max_items_per_album', 'intval')
        ->serializeToForum('postalbums.max_albums_per_user', 'postalbums.max_albums_per_user', 'intval')
        ->serializeToForum('postalbums.guest_access', 'postalbums.guest_access', 'boolval')
        ->serializeToForum('postalbums.default_sort', 'postalbums.default_sort')
        ->serializeToForum('postalbums.add_to_album_text', 'postalbums.add_to_album_text', function ($value) {
            return $value ?: '+专辑';
        })
        ->serializeToForum('postalbums.show_recommendations', 'postalbums.show_recommendations', 'boolval')
        ->serializeToForum('postalbums.recommendations_position', 'postalbums.recommendations_position')
        ->serializeToForum('postalbums.recommendations_count', 'postalbums.recommendations_count', 'intval')
        ->serializeToForum('postalbums.notice_text', 'postalbums.notice_text', function ($value) {
            // 限制最大200字
            if ($value && mb_strlen($value) > 200) {
                return mb_substr($value, 0, 200);
            }
            return $value ?: '';
        }),
];
