import app from 'flarum/forum/app';
import Page from 'flarum/common/components/Page';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Placeholder from 'flarum/common/components/Placeholder';
import Link from 'flarum/common/components/Link';
import CreateAlbumModal from './CreateAlbumModal';

export default class AlbumsPage extends Page {
  oninit(vnode) {
    super.oninit(vnode);

    this.loading = true;
    this.albums = [];
    this.includedUsers = {}; // 存储用户数据
    this.currentTab = m.route.param('tab') || 'all';
    this.currentPage = parseInt(m.route.param('page')) || 1;
    this.totalPages = 1;
    this.limit = parseInt(app.forum.attribute('postalbums.albums_per_page')) || 20;
    this.total = 0;
    this.searchQuery = '';

    this.loadAlbums();
  }

  view() {
    const displayName = app.forum.attribute('postalbums.display_name') || '帖子专辑';

    return (
      <div className="AlbumsPage">
        <div className="AlbumsPage-header">
          <div className="container">
            <div className="AlbumsPage-toolbar">
              <h2>
                {displayName}
                {!this.loading && (
                  <span className="AlbumsPage-count">（共计 {this.total} 个）</span>
                )}
              </h2>
              {app.session.user && (
                <Button
                  className="Button Button--primary"
                  icon="fas fa-plus"
                  onclick={() => this.createAlbum()}
                >
                  创建专辑
                </Button>
              )}
            </div>

            <div className="AlbumsPage-controls">
              <ul className="AlbumsPage-nav">
                <li>
                  <Button
                    className={this.currentTab === 'all' ? 'active' : ''}
                    onclick={() => this.switchTab('all')}
                  >
                    专辑广场
                  </Button>
                </li>
                {app.session.user && (
                  <>
                    <li>
                      <Button
                        className={this.currentTab === 'mine' ? 'active' : ''}
                        onclick={() => this.switchTab('mine')}
                      >
                        我的专辑
                      </Button>
                    </li>
                    <li>
                      <Button
                        className={this.currentTab === 'following' ? 'active' : ''}
                        onclick={() => this.switchTab('following')}
                      >
                        我的关注
                      </Button>
                    </li>
                  </>
                )}
              </ul>

              <div className="AlbumsPage-search">
                <input
                  type="text"
                  className="FormControl"
                  placeholder="搜索专辑..."
                  value={this.searchQuery}
                  oninput={(e) => {
                    this.searchQuery = e.target.value;
                  }}
                  onkeypress={(e) => {
                    if (e.key === 'Enter') {
                      this.search();
                    }
                  }}
                />
                <Button
                  className="Button Button--primary"
                  icon="fas fa-search"
                  onclick={() => this.search()}
                >
                  搜索
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="AlbumsPage-content">
          <div className="container">
            {this.loading ? (
              <LoadingIndicator />
            ) : this.albums.length > 0 ? (
              <>
                {this.renderAlbums()}
                {this.renderPagination()}
              </>
            ) : (
              <Placeholder text="暂无专辑" />
            )}
          </div>
        </div>
      </div>
    );
  }

  renderAlbums() {
    return (
      <div className="AlbumsList">
        {this.albums.map((album) => this.renderAlbumCard(album))}
      </div>
    );
  }

  renderAlbumCard(album) {
    const albumAttrs = album.attributes || {};
    
    // 从 included 数据中获取用户信息
    const userRef = album.relationships?.user?.data;
    let userName = '未知用户';
    
    if (userRef && userRef.id) {
      const user = this.includedUsers[userRef.id];
      if (user && user.attributes) {
        userName = user.attributes.displayName || user.attributes.username || '未知用户';
      }
    }

    return (
      <div className="AlbumCard" key={album.id}>
        <Link href={app.route('albums.show', { id: album.id })} className="AlbumCard-content">
          <h3 className="AlbumCard-title">{albumAttrs.title || '未命名专辑'}</h3>
          {albumAttrs.description && (
            <p className="AlbumCard-description">{albumAttrs.description}</p>
          )}
          <div className="AlbumCard-meta">
            <div className="AlbumCard-author">
              <i className="fas fa-user"></i>
              {userName}
            </div>
            <div className="AlbumCard-time">
              {albumAttrs.createdAt}
            </div>
          </div>
          <div className="AlbumCard-stats">
            <span>
              <i className="fas fa-bookmark"></i>
              {albumAttrs.itemsCount || 0} 个收藏
            </span>
            <span>
              <i className="fas fa-heart"></i>
              {albumAttrs.followersCount || 0} 人关注
            </span>
          </div>
        </Link>
      </div>
    );
  }

  renderPagination() {
    if (this.totalPages <= 1) {
      return null;
    }

    const pages = [];

    if (this.currentPage > 1) {
      pages.push(
        <Link
          href={app.route('albums', { tab: this.currentTab, page: this.currentPage - 1 })}
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
            href={app.route('albums', { tab: this.currentTab, page: i })}
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
          href={app.route('albums', { tab: this.currentTab, page: this.currentPage + 1 })}
          className="Button"
        >
          下一页
        </Link>
      );
    }

    return (
      <div className="AlbumsPage-pagination">
        <div className="Pagination">
          {pages}
        </div>
      </div>
    );
  }

  switchTab(tab) {
    this.currentTab = tab;
    this.currentPage = 1;
    m.route.set(app.route('albums', { tab }));
    this.loadAlbums();
  }

  search() {
    this.currentPage = 1;
    this.loadAlbums();
  }

  loadAlbums() {
    this.loading = true;

    const params = {
      'page[offset]': (this.currentPage - 1) * this.limit,
      'page[limit]': this.limit,
      include: 'user'
    };

    // 筛选条件
    if (this.currentTab === 'mine') {
      params['filter[mine]'] = true;
    } else if (this.currentTab === 'following') {
      params['filter[following]'] = true;
    }

    // 搜索
    if (this.searchQuery) {
      params['filter[q]'] = this.searchQuery;
    }

    app.request({
      method: 'GET',
      url: `${app.forum.attribute('apiUrl')}/albums`,
      params
    }).then((response) => {
      this.albums = response.data || [];
      
      // 处理 included 用户数据
      this.includedUsers = {};
      if (response.included) {
        response.included.forEach(item => {
          if (item.type === 'users') {
            this.includedUsers[item.id] = item;
          }
        });
      }
      
      this.total = response.meta?.total || 0;
      this.totalPages = Math.ceil(this.total / this.limit);
      this.loading = false;
      m.redraw();
    }).catch(() => {
      this.albums = [];
      this.includedUsers = {};
      this.loading = false;
      m.redraw();
    });
  }

  createAlbum() {
    app.modal.show(CreateAlbumModal, {
      onsubmit: () => {
        this.loading = true;
        this.loadAlbums();
      }
    });
  }
}