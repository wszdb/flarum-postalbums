# Flarum Post Albums Extension

English | [简体中文](README.md)

A powerful Flarum extension that allows users to create albums to collect and organize posts from the forum.

## ✨ Features

### 📚 Album Management
- **Create Albums**: Users can create their own albums with custom titles and descriptions
- **Collect Posts**: Support for collecting both discussion posts and replies
- **Custom Titles**: Set custom titles for collected reply posts
- **Edit Albums**: Edit album information and manage collected content anytime

### 🎯 Album Plaza
- **Browse Albums**: View all public albums created by users
- **Multiple Sorting**: Support for latest created, most followed, and random sorting
- **Search Function**: Quickly search for albums of interest
- **Follow Albums**: Follow favorite albums for easy access later

### 👤 Personal Center
- **My Albums**: Manage all albums you created
- **My Following**: View list of albums you're following
- **Quick Collection**: One-click add posts to albums from post pages

### ⚙️ Admin Panel
- **Flexible Configuration**: Rich backend settings options
- **Permission Control**: Control guest access permissions
- **Length Limits**: Customize title and description length limits
- **Quantity Control**: Limit number of albums per user and items per album
- **Pagination Settings**: Customize items per page

## 📋 Requirements

- Flarum 1.0 or higher
- PHP 7.3 or higher
- MySQL 5.7+ or MariaDB 10.2+

## 🚀 Installation

Install via Composer:

```bash
composer require wszdb/flarum-postalbums
```

After installation, enable the extension in the Flarum admin panel.

## 🔧 Configuration

After enabling, go to Admin Panel → Extensions → Post Albums to configure:

### Basic Settings
- **Frontend Display Name**: Customize the feature name displayed on frontend
- **Allow Guest Access**: Control whether unauthenticated users can view albums

### Length Limits
- **Album Title Max Length**: Default 100 characters
- **Album Description Max Length**: Default 500 characters
- **Reply Post Default Excerpt Length**: Default 50 characters

### Quantity Limits
- **Max Albums Per User**: Default 10
- **Max Items Per Album**: Default 1000

### Display Settings
- **Albums Per Page**: Default 20
- **Items Per Page in Album Details**: Default 10
- **Default Sort Method**: Latest Created/Most Followed/Random

## 📖 Usage

### Creating an Album
1. Click "Post Albums" in the forum's left navigation
2. Click the "Create Album" button
3. Fill in album title and description
4. After submission, automatically redirects to "My Albums"

### Collecting Posts
1. On any post page, click the "Add to Album" button
2. Select the album to add to
3. Confirm to complete the collection

### Managing Albums
1. Go to "My Albums" tab
2. Click on an album to enter details page
3. Edit album info, remove items, or modify custom titles

### Following Albums
1. In Album Plaza or album details page
2. Click the "Follow" button
3. View followed albums in "My Following"

## 🎨 Special Features

### Smart Titles
- Discussion posts: Automatically use discussion title
- Reply posts: Default to first N characters (configurable)
- Support for user custom title modification

### Random Sorting
- Albums with content prioritized
- Random order within same group
- Order changes with each refresh

### Empty Album Protection
- Albums without content cannot be followed
- Prevents invalid albums from occupying resources

## 🔒 Security Features

- Complete permission verification
- SQL injection protection
- XSS attack protection
- CSRF token validation
- Data validation and sanitization

## 🤝 Contributing

Issues and pull requests are welcome!

## 📄 License

MIT License

## 👨‍💻 Author

- **wszdb**
- Email: zzdogtxt@gmail.com
- GitHub: [wszdb/flarum-postalbums](https://github.com/wszdb/flarum-postalbums)

## 🙏 Acknowledgments

Thanks to the Flarum community for their support and help!

---

If this extension helps you, please ⭐ Star to support!