import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import LinkButton from 'flarum/common/components/LinkButton';
import Button from 'flarum/common/components/Button';
import CommentPost from 'flarum/forum/components/CommentPost';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';
import PostStream from 'flarum/forum/components/PostStream';
import AlbumsPage from './components/AlbumsPage';
import AlbumDetailPage from './components/AlbumDetailPage';
import AddToAlbumModal from './components/AddToAlbumModal';
import RecommendedAlbums from './components/RecommendedAlbums';


app.initializers.add('wszdb/flarum-postalbums', () => {
  // 注册路由
  app.routes.albums = {
    path: '/albums',
    component: AlbumsPage
  };

  app.routes['albums.show'] = {
    path: '/albums/:id',
    component: AlbumDetailPage
  };

  // 在侧边栏添加链接
  extend(IndexPage.prototype, 'navItems', function (items) {
    const displayName = app.forum.attribute('postalbums.display_name') || '帖子专辑';
    
    items.add(
      'albums',
      <LinkButton href={app.route('albums')} icon="fas fa-book">
        {displayName}
      </LinkButton>,
      85
    );
  });

  // 在帖子控制栏添加"+专辑"按钮
  extend(CommentPost.prototype, 'actionItems', function (items) {
    const post = this.attrs.post;

    // 只有登录用户才能看到
    if (!app.session.user) {
      return;
    }

    items.add(
      'addToAlbum',
      <Button
        className="Button Button--link"
        onclick={() => {
          app.modal.show(AddToAlbumModal, {
            post: post
          });
        }}
      >
        {app.forum.attribute('postalbums.add_to_album_text') || '+专辑'}
      </Button>,
      -10
    );
  });

  // 在帖子流中添加推荐专辑（第一个帖子后或最后一个帖子后）
  extend(PostStream.prototype, 'view', function (element) {
    // 检查是否启用推荐功能
    if (!app.forum.attribute('postalbums.show_recommendations')) {
      return;
    }

    const position = app.forum.attribute('postalbums.recommendations_position');
    const key = 'postalbums-recommendations';

    if (position === 'first_post') {
      // 在第一个帖子后插入 - 不使用 container
      element.children?.splice(
        1,
        0,
        <RecommendedAlbums key={key} />
      );
    }

    if (position === 'last_post') {
      // 在最后一个帖子后插入 - 不使用 container
      element.children?.splice(
        element.children.length - 1,
        0,
        <RecommendedAlbums key={key} />
      );
    }
  });

  // 在回复框位置添加推荐专辑
  extend(DiscussionPage.prototype, 'mainContent', function (items) {
    // 检查是否启用推荐功能
    if (!app.forum.attribute('postalbums.show_recommendations')) {
      return;
    }

    const position = app.forum.attribute('postalbums.recommendations_position');

    if (position === 'reply_block') {
      items.add(
        'postalbums-recommendations',
        <RecommendedAlbums />
      );
    }
  });
});