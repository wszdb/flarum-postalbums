import app from 'flarum/forum/app';
import Page from 'flarum/common/components/Page';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Placeholder from 'flarum/common/components/Placeholder';
import Link from 'flarum/common/components/Link';
import username from 'flarum/common/helpers/username';
import humanTime from 'flarum/common/helpers/humanTime';
import EditAlbumModal from './EditAlbumModal';
import EditItemTitleModal from './EditItemTitleModal';

export default class AlbumDetailPage extends Page {
  oninit(vnode) {
    super.oninit(vnode);

    this.loading = true;
    this.album = null;
    this.items = [];
    this.user = null;
    this.currentPage = parseInt(m.route.param('page')) || 1;
    this.totalPages = 1;
    this.limit = parseInt(app.forum.attribute('postalbums.items_per_page')) || 10;
    this.total = 0;

    this.loadAlbum();
  }

  view() {
    if (this.loading) {
      return (
        <div className="AlbumDetailPage">
          <div className="container">
            <LoadingIndicator />
          </div>
        </div>
      );
    }

    if (!this.album) {
      return (
        <div className="AlbumDetailPage">
          <div className="container">
            <Placeholder text="专辑不存在" />
          </div>
        </div>
      );
    }

    return (
      <div className="AlbumDetailPage">
        <div className="AlbumDetailPage-header">
          <div className="container">
            <Link href={app.route('albums')} className="Button Button--link">
              <i className="fas fa-arrow-left"></i> 返回
            </Link>

            <div className="AlbumDetailPage-info">
              <h1>{this.album.attributes?.title || '未命名专辑'}</h1>
              {this.album.attributes?.description && (
                <p className="AlbumDetailPage-description">
                  {this.album.attributes.description}
                </p>
              )}

              <div className="AlbumDetailPage-meta">
                <div className="AlbumDetailPage-author">
                  <span>
                    创建者：
                    {this.user ? (
                      <Link 
                        href={app.route('user', { username: this.user.attributes?.username })}
                        className="AlbumDetailPage-authorLink"
                      >
                        {this.user.attributes?.displayName || this.user.attributes?.username || '未知用户'}
                      </Link>
                    ) : (
                      <span>未知用户</span>
                    )}
                    {this.album.attributes?.createdAt && (
                      <span className="AlbumDetailPage-time">
                        {' · '}
                        {humanTime(this.album.attributes.createdAt)}
                      </span>
                    )}
                  </span>
                </div>

                <div className="AlbumDetailPage-stats">
                  <span>
                    <i className="fas fa-bookmark"></i> {this.total} 个收藏
                  </span>
                  <span>
                    <i className="fas fa-heart"></i> {this.album.attributes?.followersCount || 0} 人关注
                  </span>
                </div>
              </div>

              <div className="AlbumDetailPage-actions">
                {this.followButton()}
                {this.album.attributes?.canEdit && this.editButton()}
                {this.album.attributes?.canDelete && this.deleteButton()}
              </div>
            </div>
          </div>
        </div>

        <div className="AlbumDetailPage-content">
          <div className="container">
            <h3>收藏的帖子</h3>
            {this.renderItems()}
            {this.renderPagination()}
          </div>
        </div>
      </div>
    );
  }

  renderItems() {
    if (this.items.length === 0) {
      return <Placeholder text="暂无收藏" />;
    }

    return (
      <div className="AlbumItemsList">
        {this.items.map((item) => this.renderItem(item))}
      </div>
    );
  }

  renderItem(item) {
    const itemAttrs = item.attributes || {};
    const discussionId = itemAttrs.discussionId;
    const postNumber = itemAttrs.postNumber;
    const displayTitle = itemAttrs.displayTitle || '未命名';
    const createdAt = itemAttrs.createdAt;

    let postUrl = '#';
    if (discussionId) {
      if (postNumber === 1) {
        postUrl = app.route('discussion', { id: discussionId });
      } else {
        postUrl = app.route('discussion.near', { 
          id: discussionId, 
          near: postNumber 
        });
      }
    }

    const itemData = {
      id: item.id,
      albumId: this.album.id,
      attributes: itemAttrs
    };

    return (
      <div className="AlbumItem" key={item.id}>
        <div className="AlbumItem-main">
          <a 
            href={postUrl} 
            className="AlbumItem-title"
            target="_blank"
            rel="noopener noreferrer"
          >
            {displayTitle}
          </a>
          <div className="AlbumItem-meta">
            {postNumber > 1 && <span>第{postNumber}楼</span>}
            {postNumber > 1 && createdAt && <span> · </span>}
            {createdAt && (
              <span>
                加入于 {humanTime(createdAt)}
              </span>
            )}
          </div>
        </div>

        {this.album.attributes?.canEdit && (
          <div className="AlbumItem-actions">
            <Button
              className="Button Button--link"
              icon="fas fa-edit"
              onclick={(e) => {
                e.preventDefault();
                this.editItemTitle(itemData);
              }}
            >
              编辑
            </Button>
            <Button
              className="Button Button--link"
              icon="fas fa-trash"
              onclick={(e) => {
                e.preventDefault();
                this.removeItem(itemData);
              }}
            >
              移除
            </Button>
          </div>
        )}
      </div>
    );
  }

  renderPagination() {
    if (this.totalPages <= 1) {
      return null;
    }

    const pages = [];
    const albumId = this.album.id;

    if (this.currentPage > 1) {
      pages.push(
        <Link
          href={app.route('albums.show', { id: albumId, page: this.currentPage - 1 })}
          className="Button"
        >
          上一页
        </Link>
      );
    }

    for (let i = 1; i <= this.totalPages; i++) {
      if (
        i === 1 || 
        i === this.totalPages || 
        (i >= this.currentPage - 2 && i <= this.currentPage + 2)
      ) {
        pages.push(
          <Link
            href={app.route('albums.show', { id: albumId, page: i })}
            className={`Button ${i === this.currentPage ? 'active' : ''}`}
          >
            {i}
          </Link>
        );
      } else if (
        i === this.currentPage - 3 || 
        i === this.currentPage + 3
      ) {
        pages.push(<span className="Pagination-ellipsis">...</span>);
      }
    }

    if (this.currentPage < this.totalPages) {
      pages.push(
        <Link
          href={app.route('albums.show', { id: albumId, page: this.currentPage + 1 })}
          className="Button"
        >
          下一页
        </Link>
      );
    }

    return (
      <div className="AlbumDetailPage-pagination">
        <div className="Pagination">
          {pages}
        </div>
        <div className="Pagination-info">
          第 {this.currentPage} / {this.totalPages} 页，共 {this.total} 个收藏（每页 {this.limit} 个）
        </div>
      </div>
    );
  }

  followButton() {
    if (!app.session.user) return null;

    const isFollowed = this.album.attributes?.isFollowed || false;

    return (
      <Button
        className={`Button ${isFollowed ? 'Button--primary' : ''}`}
        icon={isFollowed ? 'fas fa-heart' : 'far fa-heart'}
        onclick={(e) => {
          e.preventDefault();
          this.toggleFollow();
        }}
      >
        {isFollowed ? '已关注' : '关注'}
      </Button>
    );
  }

  editButton() {
    return (
      <Button
        className="Button"
        icon="fas fa-edit"
        onclick={(e) => {
          e.preventDefault();
          app.modal.show(EditAlbumModal, {
            album: this.album,
            onsubmit: () => {
              this.loading = true;
              this.loadAlbum();
            }
          });
        }}
      >
        编辑
      </Button>
    );
  }

  deleteButton() {
    return (
      <Button
        className="Button Button--danger"
        icon="fas fa-trash"
        onclick={(e) => {
          e.preventDefault();
          this.deleteAlbum();
        }}
      >
        删除
      </Button>
    );
  }

  loadAlbum() {
    this.loading = true;

    const id = m.route.param('id');
    const offset = (this.currentPage - 1) * this.limit;

    app.request({
      method: 'GET',
      url: `${app.forum.attribute('apiUrl')}/albums/${id}`,
      params: {
        include: 'user,items,items.post,items.post.discussion',
        'page[offset]': offset,
        'page[limit]': this.limit
      }
    }).then((response) => {
      this.album = response.data;
      
      const included = response.included || [];
      
      const userRef = this.album.relationships?.user?.data;
      if (userRef) {
        this.user = included.find(item => 
          item.type === 'users' && item.id === userRef.id
        );
      }
      
      const itemRefs = this.album.relationships?.items?.data || [];
      this.items = itemRefs.map(ref => {
        return included.find(item => 
          item.type === 'album-items' && item.id === ref.id
        );
      }).filter(item => item !== undefined);

      this.total = this.album.attributes?.itemsCount || 0;
      this.totalPages = Math.ceil(this.total / this.limit);
      
      this.loading = false;
      m.redraw();
    }).catch(() => {
      this.album = null;
      this.loading = false;
      m.redraw();
    });
  }

  toggleFollow() {
    const isFollowed = this.album.attributes?.isFollowed || false;
    const method = isFollowed ? 'DELETE' : 'POST';

    app.request({
      method,
      url: `${app.forum.attribute('apiUrl')}/albums/${this.album.id}/follow`
    }).then(() => {
      this.album.attributes.isFollowed = !isFollowed;
      this.album.attributes.followersCount = (this.album.attributes.followersCount || 0) + (isFollowed ? -1 : 1);
      m.redraw();
    });
  }

  editItemTitle(item) {
    app.modal.show(EditItemTitleModal, {
      item,
      onsubmit: () => {
        this.loading = true;
        this.loadAlbum();
      }
    });
  }

  removeItem(item) {
    if (!confirm('确定要移除此收藏项吗？')) return;

    app.request({
      method: 'DELETE',
      url: `${app.forum.attribute('apiUrl')}/albums/${item.albumId}/items/${item.id}`
    }).then(() => {
      this.loading = true;
      this.loadAlbum();
    });
  }

  deleteAlbum() {
    if (!confirm('确定要删除此专辑吗？删除后无法恢复。')) return;

    app.request({
      method: 'DELETE',
      url: `${app.forum.attribute('apiUrl')}/albums/${this.album.id}`
    }).then(() => {
      m.route.set(app.route('albums'));
    });
  }
}