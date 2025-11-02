import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';

export default class PostAlbumsSettingsPage extends ExtensionPage {
  oninit(vnode) {
    super.oninit(vnode);
  }

  content() {
    return (
      <div className="PostAlbumsSettingsPage">
        <div className="container">
          <div className="PostAlbumsSettingsPage-content">
            <h2>帖子专辑设置</h2>

            <div className="Form">
              <div className="Form-group">
                <label>功能显示名称</label>
                <input
                  className="FormControl"
                  type="text"
                  placeholder="默认：帖子专辑"
                  value={this.setting('postalbums.display_name')()}
                  oninput={(e) => this.setting('postalbums.display_name')(e.target.value)}
                />
                <p className="helpText">在前台显示的功能名称</p>
              </div>

              <div className="Form-group">
                <label>专辑标题最大长度</label>
                <input
                  className="FormControl"
                  type="number"
                  min="10"
                  max="500"
                  placeholder="100"
                  value={this.setting('postalbums.album_title_length')()}
                  oninput={(e) => this.setting('postalbums.album_title_length')(e.target.value)}
                />
                <p className="helpText">专辑标题允许的最大字符数（默认：100）</p>
              </div>

              <div className="Form-group">
                <label>专辑简介最大长度</label>
                <input
                  className="FormControl"
                  type="number"
                  min="50"
                  max="2000"
                  placeholder="500"
                  value={this.setting('postalbums.album_description_length')()}
                  oninput={(e) => this.setting('postalbums.album_description_length')(e.target.value)}
                />
                <p className="helpText">专辑简介允许的最大字符数（默认：500）</p>
              </div>

              <div className="Form-group">
                <label>收藏项标题最大长度</label>
                <input
                  className="FormControl"
                  type="number"
                  min="20"
                  max="1000"
                  placeholder="200"
                  value={this.setting('postalbums.item_title_length')()}
                  oninput={(e) => this.setting('postalbums.item_title_length')(e.target.value)}
                />
                <p className="helpText">专辑中收藏项自定义标题的最大长度（默认：200）</p>
              </div>

              <div className="Form-group">
                <label>每页显示专辑数</label>
                <input
                  className="FormControl"
                  type="number"
                  min="5"
                  max="100"
                  placeholder="20"
                  value={this.setting('postalbums.albums_per_page')()}
                  oninput={(e) => this.setting('postalbums.albums_per_page')(e.target.value)}
                />
                <p className="helpText">专辑列表每页显示的专辑数量（默认：20）</p>
              </div>

              <div className="Form-group">
                <label>每页显示收藏项数</label>
                <input
                  className="FormControl"
                  type="number"
                  min="5"
                  max="100"
                  placeholder="10"
                  value={this.setting('postalbums.items_per_page')()}
                  oninput={(e) => this.setting('postalbums.items_per_page')(e.target.value)}
                />
                <p className="helpText">专辑详情页每页显示的收藏项数量（默认：10）</p>
              </div>

              <div className="Form-group">
                <label>每个用户最多创建专辑数</label>
                <input
                  className="FormControl"
                  type="number"
                  min="1"
                  max="1000"
                  placeholder="50"
                  value={this.setting('postalbums.max_albums_per_user')()}
                  oninput={(e) => this.setting('postalbums.max_albums_per_user')(e.target.value)}
                />
                <p className="helpText">限制每个用户最多可以创建的专辑数量（默认：50，0表示不限制）</p>
              </div>

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
                <p className="helpText">专辑广场的默认排序方式（随机排序：有收藏的在前且随机，无收藏的在后且随机）</p>
              </div>

              <div className="Form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={this.setting('postalbums.guest_access')()}
                    onchange={(e) => this.setting('postalbums.guest_access')(e.target.checked)}
                  />
                  {' '}允许游客访问专辑
                </label>
                <p className="helpText">勾选后，未登录用户也可以查看专辑列表和详情</p>
              </div>

              <div className="Form-group">
                {this.submitButton()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}