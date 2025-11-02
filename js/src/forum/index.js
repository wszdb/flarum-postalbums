import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import LinkButton from 'flarum/common/components/LinkButton';
import Button from 'flarum/common/components/Button';
import CommentPost from 'flarum/forum/components/CommentPost';
import AlbumsPage from './components/AlbumsPage';
import AlbumDetailPage from './components/AlbumDetailPage';
import AddToAlbumModal from './components/AddToAlbumModal';

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
        icon="fas fa-bookmark"
        onclick={() => {
          app.modal.show(AddToAlbumModal, {
            post: post
          });
        }}
      >
        +专辑
      </Button>,
      -10
    );
  });
});