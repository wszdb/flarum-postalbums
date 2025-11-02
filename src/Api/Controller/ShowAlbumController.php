<?php

namespace Wszdb\PostAlbums\Api\Controller;

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Flarum\Http\UrlGenerator;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Wszdb\PostAlbums\Api\Serializer\AlbumSerializer;
use Wszdb\PostAlbums\Model\Album;
use Wszdb\PostAlbums\Helper\SettingsHelper;

class ShowAlbumController extends AbstractShowController
{
    public $serializer = AlbumSerializer::class;

    public $include = [
        'user'
    ];

    public $optionalInclude = [
        'items',
        'items.post',
        'items.post.discussion'
    ];

    /**
     * @var UrlGenerator
     */
    protected $url;

    public function __construct(UrlGenerator $url)
    {
        $this->url = $url;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $params = $request->getQueryParams();

        $albumId = Arr::get($params, 'id');
        
        // 检查访问权限
        $guestAccess = SettingsHelper::getBool('postalbums.guest_access', false);
        if ($actor->isGuest() && !$guestAccess) {
            throw new \Flarum\Foundation\ValidationException([
                'message' => '需要登录才能访问专辑'
            ]);
        }

        // 加载专辑基本信息
        $album = Album::with(['user'])->findOrFail($albumId);

        // 处理收藏项的分页
        $include = Arr::get($params, 'include', '');
        if (strpos($include, 'items') !== false) {
            $limit = $this->extractLimit($request);
            $offset = $this->extractOffset($request);

            // 获取收藏项总数，按创建时间倒序排序（最新加入的在前）
            $itemsQuery = $album->items()
                ->with(['post.discussion'])
                ->orderBy('created_at', 'desc');
            
            $total = $itemsQuery->count();

            // 分页加载收藏项
            $items = $itemsQuery->skip($offset)->take($limit)->get();
            
            // 手动设置关系
            $album->setRelation('items', $items);

            // 添加分页链接
            $document->addPaginationLinks(
                $this->url->to('api')->route('albums.show', ['id' => $albumId]),
                $params,
                $offset,
                $limit,
                $total
            );
        }

        return $album;
    }

    protected function extractLimit(ServerRequestInterface $request)
    {
        $params = $request->getQueryParams();
        $limit = Arr::get($params, 'page.limit', 10);
        $maxLimit = SettingsHelper::getInt('postalbums.items_per_page', 10);
        
        return min((int) $limit, $maxLimit);
    }

    protected function extractOffset(ServerRequestInterface $request)
    {
        $params = $request->getQueryParams();
        $offset = Arr::get($params, 'page.offset', 0);
        
        return max(0, (int) $offset);
    }
}