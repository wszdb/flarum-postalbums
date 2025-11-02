import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';

export default class EditItemTitleModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    const { item } = this.attrs;
    this.customTitle = item.attributes?.customTitle || '';
    this.albumId = item.albumId;  // 从传入的 item 对象获取
    this.itemId = item.id;
    this.loading = false;
  }

  className() {
    return 'EditItemTitleModal Modal--small';
  }

  title() {
    return '编辑收藏项标题';
  }

  content() {
    const maxLength = app.forum.attribute('postalbums.item_title_length') || 200;

    return (
      <div className="Modal-body">
        <div className="Form">
          <div className="Form-group">
            <label>自定义标题</label>
            <input
              className="FormControl"
              type="text"
              placeholder="留空则使用默认标题"
              value={this.customTitle}
              oninput={(e) => (this.customTitle = e.target.value)}
              maxlength={maxLength}
            />
            <div className="helpText">
              {this.customTitle.length}/{maxLength}
            </div>
          </div>

          <div className="Form-group">
            <Button
              className="Button Button--primary"
              type="submit"
              loading={this.loading}
            >
              保存
            </Button>
          </div>
        </div>
      </div>
    );
  }

  onsubmit(e) {
    e.preventDefault();

    this.loading = true;

    app.request({
      method: 'PATCH',
      url: `${app.forum.attribute('apiUrl')}/albums/${this.albumId}/items/${this.itemId}`,
      body: {
        data: {
          attributes: {
            custom_title: this.customTitle.trim()
          }
        }
      }
    }).then(() => {
      this.hide();
      app.alerts.show({ type: 'success' }, '标题更新成功');
      if (this.attrs.onsubmit) {
        this.attrs.onsubmit();
      }
    }).catch(() => {
      this.loading = false;
      m.redraw();
    });
  }
}