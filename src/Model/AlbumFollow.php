<?php

namespace Wszdb\PostAlbums\Model;

use Flarum\Database\AbstractModel;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlbumFollow extends AbstractModel
{
    protected $table = 'album_follows';

    public $timestamps = false;

    protected $fillable = ['album_id', 'user_id'];

    protected $dates = ['created_at'];

    /**
     * 关注的专辑
     */
    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class);
    }

    /**
     * 关注者
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}