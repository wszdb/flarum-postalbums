import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';

export default class AlbumSettingsPage extends ExtensionPage {
  oninit(vnode) {
    super.oninit(vnode);
  }

  content() {
    return (
      <div className="AlbumSettingsPage">
        <div className="container">
          <h2>帖子专辑设置</h2>
          <div className="Form">
            <div className="Form-group">
              <label>默认排序方式</label>
              <select
                className="FormControl"
                value={this.setting('postalbums.default_sort')()}
                onchange={(e) => this.setting('postalbums.default_sort')(e.target.value)}
              >
                <option value="-created_at">最新创建</option>
                <option value="-followers">关注最多</option>
                <option value="random">随机排序</option>
              </select>
              <p className="helpText">
                专辑广场的默认排序方式
                <br />
                随机排序：有收藏的专辑在前且随机，无收藏的专辑在后且随机
              </p>
            </div>

            <div className="Form-group">
              {this.submitButton()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}