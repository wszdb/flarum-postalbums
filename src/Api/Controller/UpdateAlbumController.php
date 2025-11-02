<?php

namespace Wszdb\PostAlbums\Api\Controller;

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Wszdb\PostAlbums\Api\Serializer\AlbumSerializer;
use Wszdb\PostAlbums\Model\Album;
use Wszdb\PostAlbums\Validator\AlbumValidator;

class UpdateAlbumController extends AbstractShowController
{
    public $serializer = AlbumSerializer::class;

    public $include = ['user'];

    protected $validator;

    public function __construct(AlbumValidator $validator)
    {
        $this->validator = $validator;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        $id = Arr::get($request->getQueryParams(), 'id');
        $album = Album::findOrFail($id);

        // 权限检查
        if ($actor->id !== $album->user_id && !$actor->isAdmin()) {
            throw new \Flarum\Foundation\ValidationException([
                'message' => '您没有权限编辑此专辑'
            ]);
        }

        $data = Arr::get($request->getParsedBody(), 'data.attributes', []);
        $this->validator->assertValid($data);

        if (isset($data['title'])) {
            $album->title = $data['title'];
        }

        if (isset($data['description'])) {
            $album->description = $data['description'];
        }

        $album->save();

        return $album;
    }
}