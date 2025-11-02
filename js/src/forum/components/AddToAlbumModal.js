import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Link from 'flarum/common/components/Link';

export default class AddToAlbumModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.post = this.attrs.post;
    this.loading = true;
    this.albums = [];
    this.selectedAlbumId = null;

    this.loadUserAlbums();
  }

  className() {
    return 'AddToAlbumModal Modal--small';
  }

  title() {
    return '加入专辑';
  }

  content() {
    if (this.loading) {
      return (
        <div className="Modal-body">
          <LoadingIndicator />
        </div>
      );
    }

    if (this.albums.length === 0) {
      return (
        <div className="Modal-body">
          <p>您还没有创建专辑。</p>
          <p>
            <Link href={app.route('albums', { tab: 'mine' })}>
              去创建专辑
            </Link>
          </p>
        </div>
      );
    }

    return (
      <div className="Modal-body">
        <div className="Form">
          <div className="Form-group">
            <label>选择专辑：</label>
            <select
              className="FormControl"
              value={this.selectedAlbumId || ''}
              onchange={(e) => {
                this.selectedAlbumId = e.target.value;
              }}
            >
              <option value="">请选择...</option>
              {this.albums.map((album) => (
                <option value={album.id} key={album.id}>
                  {album.attributes?.title || '未命名专辑'} 
                  ({album.attributes?.itemsCount || 0} 个收藏)
                </option>
              ))}
            </select>
          </div>

          <div className="Form-group">
            <Button
              className="Button Button--primary"
              type="submit"
              loading={this.loading}
              disabled={!this.selectedAlbumId}
            >
              确定
            </Button>
            <Button
              className="Button"
              onclick={() => app.modal.close()}
            >
              取消
            </Button>
          </div>
        </div>
      </div>
    );
  }

  onsubmit(e) {
    e.preventDefault();

    if (!this.selectedAlbumId) {
      alert('请选择一个专辑');
      return;
    }

    this.loading = true;

    const postId = this.post.id();
    const postNumber = this.post.number();
    const postType = postNumber === 1 ? 'discussion' : 'post';

    app.request({
      method: 'POST',
      url: `${app.forum.attribute('apiUrl')}/albums/${this.selectedAlbumId}/items`,
      body: {
        data: {
          type: 'album-items',
          attributes: {
            post_id: postId,
            post_type: postType
          }
        }
      }
    }).then(() => {
      app.modal.close();
      
      // 显示成功提示，3秒后自动消失
      const alert = app.alerts.show({ type: 'success' }, '已成功加入专辑');
      setTimeout(() => {
        app.alerts.dismiss(alert);
      }, 3000);
    }).catch((error) => {
      this.loading = false;
      
      // 处理错误
      let message = '加入失败，请稍后重试';
      if (error.response && error.response.errors) {
        const errors = error.response.errors;
        if (errors[0] && errors[0].detail) {
          message = errors[0].detail;
        } else if (errors[0] && errors[0].message) {
          message = errors[0].message;
        }
      }
      
      // 显示错误提示，5秒后自动消失
      const alert = app.alerts.show({ type: 'error' }, message);
      setTimeout(() => {
        app.alerts.dismiss(alert);
      }, 5000);
      
      m.redraw();
    });
  }

  loadUserAlbums() {
    this.loading = true;

    app.request({
      method: 'GET',
      url: `${app.forum.attribute('apiUrl')}/albums`,
      params: {
        filter: { mine: true },
        'page[limit]': 100 // 加载所有用户的专辑
      }
    }).then((response) => {
      this.albums = response.data || [];
      this.loading = false;
      m.redraw();
    }).catch(() => {
      this.albums = [];
      this.loading = false;
      m.redraw();
    });
  }
}