import app from 'flarum/admin/app';

app.initializers.add('wszdb/flarum-postalbums', () => {
  app.extensionData
    .for('wszdb-postalbums')
    .registerSetting({
      setting: 'postalbums.display_name',
      type: 'text',
      label: '前台显示名称',
      help: '专辑功能在前台显示的名称，默认为"帖子专辑"',
      placeholder: '帖子专辑'
    })
    .registerSetting({
      setting: 'postalbums.add_to_album_text',
      type: 'text',
      label: '加入专辑按钮文字',
      help: '帖子下方"加入专辑"按钮显示的文字，默认为"+专辑"',
      placeholder: '+专辑'
    })
    .registerSetting({
      setting: 'postalbums.notice_text',
      type: 'textarea',
      label: '专辑列表页公告/帮助信息',
      help: '显示在专辑列表页标题下方，支持超链接和换行。最多200字。',
      placeholder: '欢迎使用帖子专辑功能！您可以创建专辑收藏喜欢的帖子。\n\n使用帮助：<a href="/help">查看详细教程</a>'
    })
    .registerSetting({
      setting: 'postalbums.guest_access',
      type: 'boolean',
      label: '允许游客访问',
      help: '是否允许未登录用户查看专辑'
    })
    .registerSetting({
      setting: 'postalbums.show_recommendations',
      type: 'boolean',
      label: '显示推荐专辑',
      help: '在帖子页面显示推荐专辑'
    })
    .registerSetting({
      setting: 'postalbums.recommendations_position',
      type: 'select',
      label: '推荐专辑显示位置',
      help: '选择推荐专辑在帖子页面的显示位置',
      options: {
        first_post: '第一个帖子后',
        last_post: '最后一个帖子后',
        reply_block: '回复框位置'
      },
      default: 'last_post'
    })
    .registerSetting({
      setting: 'postalbums.recommendations_count',
      type: 'number',
      label: '推荐专辑数量',
      help: '在前台显示的推荐专辑数量',
      placeholder: '2',
      min: 1,
      max: 10,
      default: 2
    })
    .registerSetting({
      setting: 'postalbums.min_discussions_to_create',
      type: 'number',
      label: '创建专辑所需主题数',
      help: '用户需要发布多少个主题帖后才能创建专辑（0表示无限制）',
      placeholder: '0',
      min: 0,
      max: 1000
    })
    .registerSetting({
      setting: 'postalbums.album_title_length',
      type: 'number',
      label: '专辑标题最大长度',
      help: '用户创建专辑时标题的最大字符数',
      placeholder: '100',
      min: 10,
      max: 500
    })
    .registerSetting({
      setting: 'postalbums.album_description_length',
      type: 'number',
      label: '专辑简介最大长度',
      help: '用户创建专辑时简介的最大字符数',
      placeholder: '500',
      min: 30,
      max: 2000
    })
    .registerSetting({
      setting: 'postalbums.item_title_length',
      type: 'number',
      label: '回复帖默认截取长度',
      help: '回复帖未设置自定义标题时，默认截取的字符数',
      placeholder: '50',
      min: 10,
      max: 200
    })
    .registerSetting({
      setting: 'postalbums.max_albums_per_user',
      type: 'number',
      label: '每个用户最多创建专辑数',
      help: '限制每个用户可以创建的专辑数量',
      placeholder: '10',
      min: 1,
      max: 100
    })
    .registerSetting({
      setting: 'postalbums.max_items_per_album',
      type: 'number',
      label: '每个专辑最多收藏数',
      help: '限制每个专辑可以包含的帖子数量',
      placeholder: '1000',
      min: 10,
      max: 10000
    })
    .registerSetting({
      setting: 'postalbums.albums_per_page',
      type: 'number',
      label: '专辑列表每页显示数',
      help: '专辑广场每页显示的专辑数量',
      placeholder: '20',
      min: 5,
      max: 100
    })
    .registerSetting({
      setting: 'postalbums.items_per_page',
      type: 'number',
      label: '专辑详情每页显示数',
      help: '专辑详情页每页显示的帖子数量',
      placeholder: '10',
      min: 5,
      max: 200
    })
    .registerSetting({
      setting: 'postalbums.default_sort',
      type: 'select',
      label: '专辑默认排序方式',
      help: '专辑广场的默认排序方式（随机排序：有收藏的专辑在前且随机，无收藏的专辑在后且随机）',
      options: {
        '-created_at': '最新创建',
        '-followers': '最多关注',
        'random': '随机排序'
      },
      default: '-created_at'
    });
});
