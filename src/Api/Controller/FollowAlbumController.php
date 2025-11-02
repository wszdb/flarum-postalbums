<?php

namespace Wszdb\PostAlbums\Api\Controller;

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Wszdb\PostAlbums\Api\Serializer\AlbumSerializer;
use Wszdb\PostAlbums\Model\Album;
use Wszdb\PostAlbums\Model\AlbumFollow;

class FollowAlbumController extends AbstractShowController
{
    public $serializer = AlbumSerializer::class;

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        $albumId = Arr::get($request->getQueryParams(), 'id');
        $album = Album::findOrFail($albumId);

        // 检查专辑是否有收藏项
        if ($album->items_count == 0) {
            throw new \Flarum\Foundation\ValidationException([
                'message' => '空专辑不能被关注，请等待专辑有收藏内容后再关注'
            ]);
        }

        // 检查是否已经关注
        $existingFollow = AlbumFollow::where('album_id', $album->id)
            ->where('user_id', $actor->id)
            ->first();

        if ($existingFollow) {
            throw new \Flarum\Foundation\ValidationException([
                'message' => '您已经关注了这个专辑'
            ]);
        }

        // 创建关注记录
        $follow = new AlbumFollow();
        $follow->album_id = $album->id;
        $follow->user_id = $actor->id;
        $follow->created_at = now();
        $follow->save();

        // 增加专辑关注数
        $album->incrementFollowersCount();

        return $album;
    }
}