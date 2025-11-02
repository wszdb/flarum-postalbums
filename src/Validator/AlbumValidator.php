<?php

namespace Wszdb\PostAlbums\Validator;

use Flarum\Foundation\AbstractValidator;

class AlbumValidator extends AbstractValidator
{
    protected function getRules()
    {
        // 使用 app() 辅助函数获取 settings，而不是 $this->settings
        $settings = app('flarum.settings');
        
        $titleMaxLength = $settings->get('postalbums.album_title_length', 100);
        $descMaxLength = $settings->get('postalbums.album_description_length', 500);

        return [
            'title' => ['required', 'string', "max:$titleMaxLength"],
            'description' => ['nullable', 'string', "max:$descMaxLength"],
        ];
    }

    protected function getMessages()
    {
        return [
            'title.required' => '专辑标题不能为空',
            'title.max' => '专辑标题长度超出限制',
            'description.max' => '专辑简介长度超出限制',
        ];
    }
}