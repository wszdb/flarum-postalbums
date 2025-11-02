import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import SelectAlbumModal from './SelectAlbumModal';
import CreateAlbumModal from './CreateAlbumModal';

export default class AddToAlbumButton extends Component {
  view() {
    return (
      <Button
        className="Button Button--link"
        icon="fas fa-bookmark"
        onclick={() => this.addToAlbum()}
      >
        加入专辑
      </Button>
    );
  }

  addToAlbum() {
    const post = this.attrs.post;
    
    if (!post) {
      app.alerts.show({ type: 'error' }, '无法获取帖子信息');
      return;
    }

    // 检查用户是否有专辑
    app.request({
      method: 'GET',
      url: app.forum.attribute('apiUrl') + '/albums',
      params: {
        filter: { user: app.session.user.id() },
        page: { limit: 1 }
      }
    }).then((response) => {
      const albums = response.data || [];
      
      if (albums.length === 0) {
        // 没有专辑，提示创建
        if (confirm('您还没有创建专辑，是否现在创建？')) {
          app.modal.show(CreateAlbumModal, {
            onsubmit: () => {
              // 创建成功后再次尝试添加
              this.showSelectModal(post);
            }
          });
        }
      } else {
        // 有专辑，显示选择框
        this.showSelectModal(post);
      }
    });
  }

  showSelectModal(post) {
    app.modal.show(SelectAlbumModal, {
      post: post
    });
  }
}