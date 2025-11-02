<?php

namespace Wszdb\PostAlbums\Api\Controller;

use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Wszdb\PostAlbums\Api\Serializer\AlbumSerializer;
use Wszdb\PostAlbums\Model\Album;
use Wszdb\PostAlbums\Validator\AlbumValidator;
use Wszdb\PostAlbums\Helper\SettingsHelper;

class CreateAlbumController extends AbstractCreateController
{
    public $serializer = AlbumSerializer::class;

    public $include = ['user'];

    protected $validator;
    protected $settings;

    public function __construct(AlbumValidator $validator, SettingsRepositoryInterface $settings)
    {
        $this->validator = $validator;
        $this->settings = $settings;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        // 检查用户主题数要求
        $minDiscussions = (int) $this->settings->get('postalbums.min_discussions_to_create', 0);
        if ($minDiscussions > 0) {
            $userDiscussionCount = $actor->discussion_count ?? 0;
            
            if ($userDiscussionCount < $minDiscussions) {
                throw new \Flarum\Foundation\ValidationException([
                    'message' => "您需要发布至少 {$minDiscussions} 个主题帖才能创建专辑。当前已发布 {$userDiscussionCount} 个主题帖。"
                ]);
            }
        }

        // 检查用户专辑数量限制
        $maxAlbums = SettingsHelper::getInt('postalbums.max_albums_per_user', 10);
        $userAlbumCount = Album::where('user_id', $actor->id)->count();
        
        if ($userAlbumCount >= $maxAlbums) {
            throw new \Flarum\Foundation\ValidationException([
                'message' => "您已达到专辑数量上限（{$maxAlbums}个）"
            ]);
        }

        $data = Arr::get($request->getParsedBody(), 'data', []);
        $attributes = Arr::get($data, 'attributes', []);

        $this->validator->assertValid($attributes);

        $album = new Album();
        $album->title = Arr::get($attributes, 'title');
        $album->description = Arr::get($attributes, 'description');
        $album->user_id = $actor->id;
        $album->save();

        return $album;
    }
}