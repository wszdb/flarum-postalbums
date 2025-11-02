import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';

export default class SelectAlbumModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.loading = true;
    this.albums = [];
    this.selectedAlbumId = null;
    this.submitting = false;

    this.loadAlbums();
  }

  className() {
    return 'SelectAlbumModal Modal--medium';
  }

  title() {
    return '选择专辑';
  }

  content() {
    if (this.loading) {
      return (
        <div className="Modal-body">
          <LoadingIndicator />
        </div>
      );
    }

    const { post } = this.attrs;
    const discussion = post.discussion();
    const isFirstPost = post.number() === 1;
    const postTitle = isFirstPost 
      ? (discussion ? discussion.title() : '主题帖')
      : `回复 #${post.number()}`;

    return (
      <div className="Modal-body">
        <div className="Form">
          <div className="Form-group">
            <p>将 <strong>{postTitle}</strong> 添加到：</p>
          </div>

          <div className="Form-group">
            <div className="AlbumsList">
              {this.albums.map((album) => (
                <div
                  className={`AlbumOption ${this.selectedAlbumId === album.id ? 'selected' : ''}`}
                  onclick={() => (this.selectedAlbumId = album.id)}
                  key={album.id}
                >
                  <div className="AlbumOption-info">
                    <div className="AlbumOption-title">{album.attributes?.title || '未命名'}</div>
                    <div className="AlbumOption-meta">
                      {album.attributes?.itemsCount || 0} 个收藏
                    </div>
                  </div>
                  {this.selectedAlbumId === album.id && (
                    <i className="fas fa-check"></i>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="Form-group">
            <Button
              className="Button Button--primary"
              type="submit"
              loading={this.submitting}
              disabled={!this.selectedAlbumId}
            >
              添加
            </Button>
            <Button
              className="Button"
              onclick={() => this.hide()}
            >
              取消
            </Button>
          </div>
        </div>
      </div>
    );
  }

  loadAlbums() {
    app.request({
      method: 'GET',
      url: app.forum.attribute('apiUrl') + '/albums',
      params: {
        filter: { user: app.session.user.id() },
        page: { limit: 100 }
      }
    }).then((response) => {
      this.albums = response.data || [];
      this.loading = false;
      m.redraw();
    });
  }

  onsubmit(e) {
    e.preventDefault();

    if (!this.selectedAlbumId) {
      return;
    }

    this.submitting = true;

    const { post } = this.attrs;

    app.request({
      method: 'POST',
      url: `${app.forum.attribute('apiUrl')}/albums/${this.selectedAlbumId}/items`,
      body: {
        data: {
          attributes: {
            post_id: post.id()
          }
        }
      }
    })
      .then(() => {
        this.hide();
        app.alerts.show({ type: 'success' }, '已添加到专辑');
      })
      .catch((error) => {
        this.submitting = false;
        
        // 处理错误信息
        if (error.response && error.response.errors) {
          const message = error.response.errors[0].detail || '添加失败';
          app.alerts.show({ type: 'error' }, message);
        }
        
        m.redraw();
      });
  }
}