<?php

namespace Wszdb\PostAlbums\Validator;

use Flarum\Foundation\AbstractValidator;

class AlbumItemValidator extends AbstractValidator
{
    protected function getRules()
    {
        // 使用 app() 辅助函数获取 settings
        $settings = app('flarum.settings');
        
        $titleMaxLength = $settings->get('postalbums.item_title_length', 200);

        return [
            'post_id' => ['required', 'integer', 'exists:posts,id'],
            'custom_title' => ['nullable', 'string', "max:$titleMaxLength"],
        ];
    }

    protected function getMessages()
    {
        return [
            'post_id.required' => '帖子ID不能为空',
            'post_id.exists' => '帖子不存在',
            'custom_title.max' => '自定义标题长度超出限制',
        ];
    }
}