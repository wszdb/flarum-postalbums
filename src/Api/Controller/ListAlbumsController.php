<?php

namespace Wszdb\PostAlbums\Api\Controller;

use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use Flarum\Http\UrlGenerator;
use Flarum\Query\QueryCriteria;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Wszdb\PostAlbums\Api\Serializer\AlbumSerializer;
use Wszdb\PostAlbums\Model\Album;
use Illuminate\Database\Eloquent\Builder;

class ListAlbumsController extends AbstractListController
{
    public $serializer = AlbumSerializer::class;

    public $include = ['user'];

    public $optionalInclude = ['items'];

    public $limit = 20;

    public $maxLimit = 100;

    protected $url;

    public function __construct(UrlGenerator $url)
    {
        $this->url = $url;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $params = $request->getQueryParams();

        // 获取分页参数
        $limit = $this->extractLimit($request);
        $offset = $this->extractOffset($request);

        // 构建查询
        $query = Album::query();

        // 筛选条件
        $filter = Arr::get($params, 'filter', []);

        // 我的专辑
        if (Arr::get($filter, 'mine')) {
            $actor->assertRegistered();
            $query->where('user_id', $actor->id);
        }

        // 我关注的专辑
        if (Arr::get($filter, 'following')) {
            $actor->assertRegistered();
            $query->whereHas('follows', function ($q) use ($actor) {
                $q->where('user_id', $actor->id);
            });
        }

        // 搜索
        if ($q = Arr::get($filter, 'q')) {
            $query->where(function ($query) use ($q) {
                $query->where('title', 'like', "%{$q}%")
                      ->orWhere('description', 'like', "%{$q}%");
            });
        }

        // 排序
        $sort = Arr::get($params, 'sort');
        
        // 如果没有指定排序，使用后台设置的默认排序
        if (!$sort) {
            $sort = app('flarum.settings')->get('postalbums.default_sort', '-created_at');
        }

        if ($sort === '-created_at') {
            $query->orderBy('created_at', 'desc');
        } elseif ($sort === '-followers') {
            $query->orderBy('followers_count', 'desc')
                  ->orderBy('created_at', 'desc');
        } elseif ($sort === 'random') {
            // 伪随机排序：使用日期 + 专辑ID 生成确定性随机顺序
            // 优点：
            // 1. 性能好，不需要 RAND()
            // 2. 同一天内顺序稳定
            // 3. 每天自动变化
            // 4. 有收藏的专辑优先
            
            $today = date('Y-m-d');
            $seed = crc32($today); // 使用日期生成种子
            
            $query->orderByRaw('CASE WHEN items_count > 0 THEN 0 ELSE 1 END')
                  ->orderByRaw("((id * {$seed}) % 999983)"); // 使用大质数取模实现伪随机
        } else {
            // 默认按创建时间倒序
            $query->orderBy('created_at', 'desc');
        }

        // 预加载用户关系
        $query->with('user');

        // 获取总数
        $total = $query->count();

        // 分页
        $results = $query->skip($offset)->take($limit)->get();

        // 设置分页元数据
        $document->addPaginationLinks(
            $this->url->to('api')->route('albums.index'),
            $params,
            $offset,
            $limit,
            $total
        );

        $document->setMeta([
            'total' => $total,
            'perPage' => $limit,
        ]);

        return $results;
    }
}