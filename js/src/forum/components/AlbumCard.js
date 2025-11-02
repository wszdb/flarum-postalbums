import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Link from 'flarum/common/components/Link';
import Button from 'flarum/common/components/Button';
import humanTime from 'flarum/common/helpers/humanTime';

export default class AlbumCard extends Component {
  view() {
    const { album } = this.attrs;
    const user = album.relationships?.user?.data;
    const userName = user ? (user.attributes?.username || user.attributes?.displayName || '未知用户') : '未知用户';

    return (
      <div className="AlbumCard">
        <div className="AlbumCard-header">
          <Link href={app.route('album', { id: album.id })}>
            <h3>{album.attributes?.title || '未命名专辑'}</h3>
          </Link>
          {this.followButton(album)}
        </div>

        {album.attributes?.description && (
          <div className="AlbumCard-description">{album.attributes.description}</div>
        )}

        <div className="AlbumCard-meta">
          <div className="AlbumCard-author">
            <span>{userName}</span>
          </div>

          <div className="AlbumCard-stats">
            <span>
              <i className="fas fa-bookmark"></i> {album.attributes?.itemsCount || 0} 个收藏
            </span>
            <span>
              <i className="fas fa-heart"></i> {album.attributes?.followersCount || 0} 人关注
            </span>
            <span>
              <i className="fas fa-clock"></i> {album.attributes?.createdAt ? humanTime(new Date(album.attributes.createdAt)) : ''}
            </span>
          </div>
        </div>
      </div>
    );
  }

  followButton(album) {
    if (!app.session.user) return null;

    const isFollowed = album.attributes?.isFollowed || false;

    return (
      <Button
        className={`Button Button--sm ${isFollowed ? 'Button--primary' : ''}`}
        icon={isFollowed ? 'fas fa-heart' : 'far fa-heart'}
        onclick={(e) => {
          e.preventDefault();
          this.toggleFollow(album);
        }}
      >
        {isFollowed ? '已关注' : '关注'}
      </Button>
    );
  }

  toggleFollow(album) {
    const isFollowed = album.attributes?.isFollowed || false;
    const method = isFollowed ? 'DELETE' : 'POST';

    app.request({
      method,
      url: `${app.forum.attribute('apiUrl')}/albums/${album.id}/follow`
    }).then(() => {
      album.attributes.isFollowed = !isFollowed;
      album.attributes.followersCount = (album.attributes.followersCount || 0) + (isFollowed ? -1 : 1);
      m.redraw();
    });
  }
}