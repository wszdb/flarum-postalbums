<?php

namespace Wszdb\PostAlbums\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Api\Serializer\BasicPostSerializer;
use Flarum\Api\Serializer\BasicDiscussionSerializer;
use Wszdb\PostAlbums\Model\AlbumItem;

class AlbumItemSerializer extends AbstractSerializer
{
    protected $type = 'album-items';

    protected function getDefaultAttributes($item)
    {
        if (!($item instanceof AlbumItem)) {
            throw new \InvalidArgumentException('AlbumItem serializer expects AlbumItem model');
        }

        $post = $item->post;
        $discussion = $post ? $post->discussion : null;

        return [
            'id' => (int) $item->id,
            'albumId' => (int) $item->album_id,
            'postId' => (int) $item->post_id,
            'postType' => $item->post_type,
            'customTitle' => $item->custom_title,
            'displayTitle' => $item->getDisplayTitle(),
            'discussionId' => $discussion ? (int) $discussion->id : null,
            'postNumber' => $post ? (int) $post->number : null,
            'createdAt' => $this->formatDate($item->created_at),
            'updatedAt' => $this->formatDate($item->updated_at),
        ];
    }

    protected function post($item)
    {
        return $this->hasOne($item, BasicPostSerializer::class);
    }
}