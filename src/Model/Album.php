<?php

namespace Wszdb\PostAlbums\Model;

use Flarum\Database\AbstractModel;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Album extends AbstractModel
{
    protected $table = 'albums';

    protected $fillable = ['title', 'description', 'user_id'];

    protected $casts = [
        'followers_count' => 'integer',
        'items_count' => 'integer',
    ];

    protected $dates = ['created_at', 'updated_at', 'last_item_at'];

    /**
     * 专辑创建者
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 专辑中的收藏项
     */
    public function items(): HasMany
    {
        return $this->hasMany(AlbumItem::class)->orderBy('created_at', 'desc');
    }

    /**
     * 专辑的关注者
     */
    public function follows(): HasMany
    {
        return $this->hasMany(AlbumFollow::class);
    }

    /**
     * 检查用户是否关注了该专辑
     */
    public function isFollowedBy(User $user): bool
    {
        return $this->follows()->where('user_id', $user->id)->exists();
    }

    /**
     * 增加关注数
     */
    public function incrementFollowersCount(): void
    {
        $this->increment('followers_count');
    }

    /**
     * 减少关注数
     */
    public function decrementFollowersCount(): void
    {
        $this->decrement('followers_count');
    }

    /**
     * 增加收藏项数
     */
    public function incrementItemsCount(): void
    {
        $this->increment('items_count');
    }

    /**
     * 减少收藏项数
     */
    public function decrementItemsCount(): void
    {
        $this->decrement('items_count');
    }

    /**
     * 更新最后收藏时间
     */
    public function updateLastItemAt(): void
    {
        $this->last_item_at = now();
        $this->save();
    }
}