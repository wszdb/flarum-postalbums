<?php

namespace Wszdb\PostAlbums\Api\Controller;

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Wszdb\PostAlbums\Model\Album;

class DeleteAlbumController extends AbstractDeleteController
{
    protected function delete(ServerRequestInterface $request)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        $id = Arr::get($request->getQueryParams(), 'id');
        $album = Album::findOrFail($id);

        // 权限检查
        if ($actor->id !== $album->user_id && !$actor->isAdmin()) {
            throw new \Flarum\Foundation\ValidationException([
                'message' => '您没有权限删除此专辑'
            ]);
        }

        // 删除专辑（级联删除收藏项和关注记录）
        $album->delete();
    }
}