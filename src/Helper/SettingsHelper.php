<?php

namespace Wszdb\PostAlbums\Helper;

class SettingsHelper
{
    /**
     * 安全地获取整数设置值
     */
    public static function getInt(string $key, int $default): int
    {
        $value = app('flarum.settings')->get($key);
        
        if ($value === null || $value === '') {
            return $default;
        }
        
        return (int) $value;
    }

    /**
     * 安全地获取布尔设置值
     */
    public static function getBool(string $key, bool $default): bool
    {
        $value = app('flarum.settings')->get($key);
        
        if ($value === null || $value === '') {
            return $default;
        }
        
        return (bool) $value;
    }

    /**
     * 安全地获取字符串设置值
     */
    public static function getString(string $key, string $default): string
    {
        $value = app('flarum.settings')->get($key);
        
        if ($value === null || $value === '') {
            return $default;
        }
        
        return (string) $value;
    }
}