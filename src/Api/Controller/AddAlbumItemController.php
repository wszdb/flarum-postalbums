<?php

namespace Wszdb\PostAlbums\Api\Controller;

use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Wszdb\PostAlbums\Api\Serializer\AlbumItemSerializer;
use Wszdb\PostAlbums\Model\Album;
use Wszdb\PostAlbums\Model\AlbumItem;
use Wszdb\PostAlbums\Validator\AlbumItemValidator;

class AddAlbumItemController extends AbstractCreateController
{
    public $serializer = AlbumItemSerializer::class;

    public $include = ['post', 'post.discussion'];

    protected $validator;

    public function __construct(AlbumItemValidator $validator)
    {
        $this->validator = $validator;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        $albumId = Arr::get($request->getQueryParams(), 'id');
        $album = Album::findOrFail($albumId);

        // 检查权限
        if ($album->user_id !== $actor->id && !$actor->isAdmin()) {
            throw new \Flarum\Foundation\ValidationException([
                'message' => '无权向此专辑添加收藏项'
            ]);
        }

        $data = Arr::get($request->getParsedBody(), 'data.attributes', []);
        $this->validator->assertValid($data);

        $postId = Arr::get($data, 'post_id');
        $postType = Arr::get($data, 'post_type', 'post');
        $customTitle = Arr::get($data, 'custom_title');

        // 检查是否已存在
        $exists = AlbumItem::where('album_id', $albumId)
            ->where('post_id', $postId)
            ->exists();

        if ($exists) {
            throw new \Flarum\Foundation\ValidationException([
                'message' => '此帖子已在专辑中'
            ]);
        }

        $item = AlbumItem::create([
            'album_id' => $albumId,
            'post_id' => $postId,
            'post_type' => $postType,
            'custom_title' => $customTitle,
            'user_id' => $actor->id,
        ]);

        // 更新专辑统计和最后收藏时间
        $album->incrementItemsCount();
        $album->updateLastItemAt();

        return $item;
    }
}