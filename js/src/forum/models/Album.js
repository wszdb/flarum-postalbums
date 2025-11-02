import Model from 'flarum/common/Model';

export default class Album extends Model {
  title = Model.attribute('title');
  description = Model.attribute('description');
  followersCount = Model.attribute('followersCount');
  itemsCount = Model.attribute('itemsCount');
  createdAt = Model.attribute('createdAt', Model.transformDate);
  updatedAt = Model.attribute('updatedAt', Model.transformDate);
  canEdit = Model.attribute('canEdit');
  canDelete = Model.attribute('canDelete');
  isFollowed = Model.attribute('isFollowed');

  user = Model.hasOne('user');
  items = Model.hasMany('items');
}