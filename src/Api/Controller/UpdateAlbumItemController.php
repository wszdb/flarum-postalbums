<?php

namespace Wszdb\PostAlbums\Api\Controller;

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Wszdb\PostAlbums\Api\Serializer\AlbumItemSerializer;
use Wszdb\PostAlbums\Model\Album;
use Wszdb\PostAlbums\Model\AlbumItem;

class UpdateAlbumItemController extends AbstractShowController
{
    public $serializer = AlbumItemSerializer::class;

    public $include = ['post', 'post.discussion'];

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        $albumId = Arr::get($request->getQueryParams(), 'albumId');
        $itemId = Arr::get($request->getQueryParams(), 'id');

        $album = Album::findOrFail($albumId);
        $item = AlbumItem::where('album_id', $albumId)
            ->where('id', $itemId)
            ->firstOrFail();

        // 权限检查
        if ($actor->id !== $album->user_id && !$actor->isAdmin()) {
            throw new \Flarum\Foundation\ValidationException([
                'message' => '您没有权限编辑此收藏项'
            ]);
        }

        $data = Arr::get($request->getParsedBody(), 'data.attributes', []);

        if (isset($data['custom_title'])) {
            $item->custom_title = $data['custom_title'];
            $item->save();
        }

        return $item;
    }
}