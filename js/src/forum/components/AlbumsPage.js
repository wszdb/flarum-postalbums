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

            {/* 公告/帮助信息 */}
            {this.renderNotice()}

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

  renderNotice() {
    const noticeText = app.forum.attribute('postalbums.notice_text');
    
    if (!noticeText) {
      return null;
    }

    return (
      <div className="AlbumsPage-notice">
        <div className="AlbumsPage-noticeContent">
          {m.trust(this.sanitizeNotice(noticeText))}
        </div>
      </div>
    );
  }

  sanitizeNotice(text) {
    // 只允许超链接和换行
    // 将 \n 转换为 <br>
    let html = text.replace(/\n/g, '<br>');
    
    // 只保留 <a> 和 <br> 标签，移除其他 HTML
    // 这是一个简单的实现，生产环境建议使用专业的 sanitize 库
    html = html.replace(/<(?!\/?(a|br)\b)[^>]+>/gi, '');
    
    return html;
  }

  renderAlbums() {
    return (
      <div className="AlbumsList">
        {this.albums.map((album) => {
          const userId = album.relationships?.user?.data?.id;
          const user = userId ? this.includedUsers[userId] : null;
          const userName = user?.attributes?.displayName || user?.attributes?.username || '未知用户';

          return (
            <div className="AlbumCard" key={album.id}>
              <div className="AlbumCard-header">
                <Link href={app.route('albums.show', { id: album.id })}>
                  <h3>{album.attributes?.title || '未命名专辑'}</h3>
                </Link>
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
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  renderPagination() {
    if (this.totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(
        <Button
          key={i}
          className={`Button ${i === this.currentPage ? 'Button--primary' : ''}`}
          onclick={() => this.goToPage(i)}
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="AlbumsPage-pagination">
        <Button
          className="Button"
          disabled={this.currentPage === 1}
          onclick={() => this.goToPage(this.currentPage - 1)}
        >
          上一页
        </Button>
        {pages}
        <Button
          className="Button"
          disabled={this.currentPage === this.totalPages}
          onclick={() => this.goToPage(this.currentPage + 1)}
        >
          下一页
        </Button>
      </div>
    );
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

  switchTab(tab) {
    this.currentTab = tab;
    this.currentPage = 1;
    m.route.set(app.route('albums'), { tab });
    this.loadAlbums();
  }

  goToPage(page) {
    this.currentPage = page;
    m.route.set(app.route('albums'), { tab: this.currentTab, page });
    this.loadAlbums();
  }

  search() {
    this.currentPage = 1;
    this.loadAlbums();
  }

  createAlbum() {
    app.modal.show(CreateAlbumModal, {
      onsubmit: () => {
        this.loadAlbums();
      }
    });
  }
}