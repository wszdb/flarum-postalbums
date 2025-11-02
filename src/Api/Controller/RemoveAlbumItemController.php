<?php

namespace Wszdb\PostAlbums\Api\Controller;

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Wszdb\PostAlbums\Model\Album;
use Wszdb\PostAlbums\Model\AlbumItem;

class RemoveAlbumItemController extends AbstractDeleteController
{
    protected function delete(ServerRequestInterface $request)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        $albumId = Arr::get($request->getQueryParams(), 'id');
        $itemId = Arr::get($request->getQueryParams(), 'itemId');

        $album = Album::findOrFail($albumId);
        $item = AlbumItem::where('album_id', $albumId)
            ->where('id', $itemId)
            ->firstOrFail();

        // 权限检查
        if ($actor->id !== $album->user_id && !$actor->isAdmin()) {
            throw new \Flarum\Foundation\ValidationException([
                'message' => '您没有权限删除此收藏项'
            ]);
        }

        $item->delete();

        // 更新专辑收藏项计数
        $album->decrementItemsCount();
    }
}