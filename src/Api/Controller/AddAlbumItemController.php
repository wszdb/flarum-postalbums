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

        // 检查权限：只有专辑所有者或管理员可以添加
        if ($album->user_id !== $actor->id && !$actor->isAdmin()) {
            throw new \Flarum\Foundation\ValidationException([
                'message' => '您没有权限向此专辑添加内容'
            ]);
        }

        $data = Arr::get($request->getParsedBody(), 'data.attributes', []);
        
        // 验证数据
        $this->validator->assertValid($data);

        $postId = Arr::get($data, 'post_id');
        $customTitle = Arr::get($data, 'custom_title');

        // 检查是否已经存在
        $existing = AlbumItem::where('album_id', $album->id)
            ->where('post_id', $postId)
            ->first();

        if ($existing) {
            throw new \Flarum\Foundation\ValidationException([
                'message' => '该帖子已经在此专辑中'
            ]);
        }

        // 创建收藏项
        $item = AlbumItem::create([
            'album_id' => $album->id,
            'post_id' => $postId,
            'custom_title' => $customTitle,
            'user_id' => $actor->id,
        ]);

        // 更新专辑统计（incrementItemsCount 方法内部已经更新了 last_item_at）
        $album->incrementItemsCount();

        return $item;
    }
}