import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';

export default class CreateAlbumModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.albumTitle = '';
    this.description = '';
    this.loading = false;
  }

  className() {
    return 'CreateAlbumModal Modal--small';
  }

  title() {
    return '创建专辑';
  }

  content() {
    const titleMaxLength = app.forum.attribute('postalbums.album_title_length') || 100;
    const descMaxLength = app.forum.attribute('postalbums.album_description_length') || 500;

    return (
      <div className="Modal-body">
        <div className="Form">
          <div className="Form-group">
            <label>专辑标题 *</label>
            <input
              className="FormControl"
              type="text"
              placeholder="输入专辑标题"
              value={this.albumTitle}
              oninput={(e) => (this.albumTitle = e.target.value)}
              maxlength={titleMaxLength}
            />
            <div className="helpText">
              {this.albumTitle.length}/{titleMaxLength}
            </div>
          </div>

          <div className="Form-group">
            <label>专辑简介</label>
            <textarea
              className="FormControl"
              placeholder="输入专辑简介（可选）"
              rows="3"
              value={this.description}
              oninput={(e) => (this.description = e.target.value)}
              maxlength={descMaxLength}
            />
            <div className="helpText">
              {this.description.length}/{descMaxLength}
            </div>
          </div>

          <div className="Form-group">
            <Button
              className="Button Button--primary"
              type="submit"
              loading={this.loading}
              disabled={!this.albumTitle.trim()}
            >
              创建
            </Button>
          </div>
        </div>
      </div>
    );
  }

  onsubmit(e) {
    e.preventDefault();

    if (!this.albumTitle.trim()) {
      app.alerts.show({ type: 'error' }, '请输入专辑标题');
      return;
    }

    this.loading = true;

    app.request({
      method: 'POST',
      url: app.forum.attribute('apiUrl') + '/albums',
      body: {
        data: {
          attributes: {
            title: this.albumTitle.trim(),
            description: this.description.trim()
          }
        }
      }
    }).then(() => {
      this.hide();
      app.alerts.show({ type: 'success' }, '专辑创建成功');
      
      // 跳转到"我的专辑"
      m.route.set(app.route('albums', { tab: 'mine' }));
      
      if (this.attrs.onsubmit) {
        this.attrs.onsubmit();
      }
    }).catch(() => {
      this.loading = false;
      m.redraw();
    });
  }
}