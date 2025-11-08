import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Link from 'flarum/common/components/Link';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';

export default class RecommendedAlbums extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.loading = true;
    this.albums = [];
    this.includedUsers = {};
    this.loadAlbums();
  }

  view() {
    // 检查是否启用推荐功能
    if (!app.forum.attribute('postalbums.show_recommendations')) {
      return null;
    }

    return (
      <div className="RecommendedAlbums">
        <div className="RecommendedAlbums-header">
          <h3 className="RecommendedAlbums-title">推荐专辑</h3>
          <Link href={app.route('albums')} className="Button Button--link">
            进入广场
          </Link>
        </div>

        {this.loading ? (
          <LoadingIndicator />
        ) : (
          <div className="RecommendedAlbums-list">
            {this.albums.length > 0 ? (
              this.albums.map((album) => this.renderAlbumCard(album))
            ) : null}
            {this.renderPlaceholders()}
          </div>
        )}
      </div>
    );
  }

  renderAlbumCard(album) {
    // 从 includedUsers 中获取用户信息
    const userId = album.relationships?.user?.data?.id;
    const user = userId ? this.includedUsers[userId] : null;
    const userName = user?.attributes?.displayName || user?.attributes?.username || '未知用户';

    const albumId = album.id;
    const title = album.attributes?.title || '未命名专辑';
    const description = album.attributes?.description;
    const itemsCount = album.attributes?.itemsCount || 0;
    const followersCount = album.attributes?.followersCount || 0;

    return (
      <div className="RecommendedAlbums-item" key={albumId}>
        <Link href={app.route('albums.show', { id: albumId })} className="RecommendedAlbums-link">
          <div className="RecommendedAlbums-content">
            <h4 className="RecommendedAlbums-albumTitle">{title}</h4>
            
            {description && (
              <div className="RecommendedAlbums-description">
                {this.truncateText(description, 25)}
              </div>
            )}

            <div className="RecommendedAlbums-meta">
              <span className="RecommendedAlbums-author">
                <i className="fas fa-user"></i> {userName}
              </span>
              <span className="RecommendedAlbums-stats">
                <i className="fas fa-bookmark"></i> {itemsCount}
                <i className="fas fa-heart"></i> {followersCount}
              </span>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  renderPlaceholders() {
    // 获取设置的推荐数量
    const recommendCount = parseInt(app.forum.attribute('postalbums.recommendations_count')) || 2;
    const placeholderCount = Math.max(0, recommendCount - this.albums.length);
    
    const placeholders = [];

    for (let i = 0; i < placeholderCount; i++) {
      placeholders.push(
        <div className="RecommendedAlbums-item RecommendedAlbums-placeholder" key={`placeholder-${i}`}>
          <div className="RecommendedAlbums-placeholderContent">
            <Link href={app.route('albums')} className="Button">
              <i className="fas fa-plus"></i> 创建专辑
            </Link>
            <p className="RecommendedAlbums-hint">创建你的社区专辑，分享你喜欢的论坛内容！</p>
          </div>
        </div>
      );
    }

    return placeholders;
  }

  loadAlbums() {
    // 获取设置的推荐数量
    const recommendCount = parseInt(app.forum.attribute('postalbums.recommendations_count')) || 2;
    
    // 使用和 AlbumsPage 相同的方式获取专辑
    app.request({
      method: 'GET',
      url: `${app.forum.attribute('apiUrl')}/albums`,
      params: {
        'page[limit]': 50,
        include: 'user'
      }
    }).then((response) => {
      const albums = response.data || [];
      
      // 处理 included 用户数据
      this.includedUsers = {};
      if (response.included) {
        response.included.forEach(item => {
          if (item.type === 'users') {
            this.includedUsers[item.id] = item;
          }
        });
      }
      
      // 过滤：只要收藏数 > 0 的专辑
      const validAlbums = albums.filter(album => {
        const itemsCount = album.attributes?.itemsCount || 0;
        return itemsCount > 0;
      });
      
      // 随机选择指定数量
      this.albums = this.shuffleArray(validAlbums).slice(0, recommendCount);
      this.loading = false;
      
      m.redraw();
    }).catch((error) => {
      console.error('加载推荐专辑失败:', error);
      this.loading = false;
      this.albums = [];
      m.redraw();
    });
  }

  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  truncateText(text, maxLength) {
    if (!text) return '';
    
    // 如果文本长度小于等于最大长度，直接返回
    if (text.length <= maxLength) {
      return text;
    }
    
    // 截取指定长度并添加省略号
    return text.substring(0, maxLength) + '...';
  }
}