<?php

namespace Wszdb\PostAlbums\Api\Controller;

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Wszdb\PostAlbums\Model\Album;
use Wszdb\PostAlbums\Model\AlbumFollow;

class UnfollowAlbumController extends AbstractDeleteController
{
    protected function delete(ServerRequestInterface $request)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        $albumId = Arr::get($request->getQueryParams(), 'id');
        $album = Album::findOrFail($albumId);

        $follow = AlbumFollow::where('album_id', $albumId)
            ->where('user_id', $actor->id)
            ->first();

        if (!$follow) {
            throw new \Flarum\Foundation\ValidationException([
                'message' => '您未关注此专辑'
            ]);
        }

        $follow->delete();

        // 更新专辑关注数
        $album->decrementFollowersCount();
    }
}