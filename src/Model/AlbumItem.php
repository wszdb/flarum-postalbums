<?php

namespace Wszdb\PostAlbums\Model;

use Flarum\Database\AbstractModel;
use Flarum\Post\Post;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlbumItem extends AbstractModel
{
    protected $table = 'album_items';

    // 启用自动时间戳
    public $timestamps = true;

    protected $fillable = ['album_id', 'post_id', 'custom_title', 'post_type', 'user_id'];

    // 指定日期字段
    protected $dates = ['created_at', 'updated_at'];

    /**
     * 所属专辑
     */
    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class);
    }

    /**
     * 关联的帖子
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * 添加该收藏项的用户
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 获取显示标题
     */
    public function getDisplayTitle(): string
    {
        if ($this->custom_title) {
            return $this->custom_title;
        }

        $post = $this->post;
        if (!$post) {
            return '[已删除]';
        }

        // 如果是主题帖，返回主题标题
        if ($this->post_type === 'discussion' || $post->number == 1) {
            return $post->discussion->title ?? '[无标题]';
        }

        // 如果是回复，返回内容前N个字符
        $maxLength = app('flarum.settings')->get('postalbums.item_title_length', 50);
        $content = strip_tags($post->content);
        
        if (mb_strlen($content) > $maxLength) {
            return mb_substr($content, 0, $maxLength) . '...';
        }
        
        return $content ?: '[空内容]';
    }
}