import Model from 'flarum/common/Model';

export default class AlbumItem extends Model {
  albumId = Model.attribute('albumId');
  postId = Model.attribute('postId');
  customTitle = Model.attribute('customTitle');
  displayTitle = Model.attribute('displayTitle');
  postType = Model.attribute('postType');
  createdAt = Model.attribute('createdAt', Model.transformDate);
  canEdit = Model.attribute('canEdit');
  canDelete = Model.attribute('canDelete');

  post = Model.hasOne('post');
  user = Model.hasOne('user');
}