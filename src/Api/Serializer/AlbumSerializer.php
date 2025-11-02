<?php

namespace Wszdb\PostAlbums\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Api\Serializer\BasicUserSerializer;
use Wszdb\PostAlbums\Model\Album;

class AlbumSerializer extends AbstractSerializer
{
    protected $type = 'albums';

    protected function getDefaultAttributes($album)
    {
        if (!($album instanceof Album)) {
            throw new \InvalidArgumentException('Album serializer expects Album model');
        }

        return [
            'id' => (int) $album->id,
            'title' => $album->title,
            'description' => $album->description,
            'followersCount' => (int) $album->followers_count,
            'itemsCount' => (int) $album->items_count,
            'createdAt' => $this->formatDate($album->created_at),
            'updatedAt' => $this->formatDate($album->updated_at),
            'canEdit' => $this->canEdit($album),
            'canDelete' => $this->canDelete($album),
            'isFollowed' => $this->isFollowed($album),
        ];
    }

    protected function user($album)
    {
        return $this->hasOne($album, BasicUserSerializer::class);
    }

    protected function items($album)
    {
        return $this->hasMany($album, AlbumItemSerializer::class);
    }

    protected function canEdit($album): bool
    {
        $actor = $this->getActor();
        
        return $actor->id === $album->user_id || $actor->isAdmin();
    }

    protected function canDelete($album): bool
    {
        $actor = $this->getActor();
        
        return $actor->id === $album->user_id || $actor->isAdmin();
    }

    protected function isFollowed($album): bool
    {
        $actor = $this->getActor();
        
        if ($actor->isGuest()) {
            return false;
        }

        return $album->isFollowedBy($actor);
    }
}