# Flarum PostAlbums Extension

A powerful Flarum extension that allows users to create albums to collect and organize posts in the forum.

> 💡 **This extension was fully developed automatically by [AiPy](https://www.aipyaipy.com/), Invitation Code: XOFS**

## ✨ Main Features

### 📚 Album Management
- **Create Albums**: Users can create their own albums with titles and descriptions
- **Collect Posts**: Add favorite posts to albums
- **Follow Albums**: Follow other users' albums
- **Album Square**: Browse all public albums

### 🎯 Recommended Albums (New)
- **Smart Recommendations**: Automatically recommend related albums on post pages
- **Three Positions**: Choose to display after first post, last post, or at reply box
- **Random Display**: Randomly select from albums with collections
- **Guide Creation**: Guide users to create new albums when recommendations are insufficient
- **Beautiful Cards**: Modern card design with responsive layout

### 📢 Announcement Feature (New)
- **Custom Announcements**: Display admin-set announcements or help information on album list page
- **Support Hyperlinks**: Can add links to tutorials, rules, etc.
- **Support Line Breaks**: Multi-paragraph content display
- **Security Filtering**: Automatically filter unsafe HTML content

### ⚙️ Flexible Configuration
- **Custom Button Text**: Customize the text of "Add to Album" button
- **Access Control**: Set whether to allow guest access
- **Quantity Limits**: Limit the number of albums per user and collections per album
- **Sorting Methods**: Support multiple sorting methods (Latest, Most Followed, Random)

## 📸 Screenshots

### Recommended Albums Display
```
┌─────────────────────────────────────────────────────────────┐
│ Recommended Albums                      Enter Square →      │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│ │Album     │  │Album     │  │+ Create  │                   │
│ │Title     │  │Title     │  │  Album   │                   │
│ │👤 Author │  │👤 Author │  │          │                   │
│ │📖 5 ❤️ 3│  │📖 3 ❤️ 2│  │Create    │                   │
│ └──────────┘  └──────────┘  │your album│                   │
│                              └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### Album List Page Announcement
```
┌─────────────────────────────────────────────────────────────┐
│ Post Albums                            [Create Album]       │
├─────────────────────────────────────────────────────────────┤
│ 📢 Welcome to Post Albums!                                  │
│                                                             │
│    Help: View Tutorial                                     │
├─────────────────────────────────────────────────────────────┤
│ [Square] [My Albums] [Following]                            │
│ ...                                                         │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Installation

### Install via Composer

```bash
composer require wszdb/flarum-postalbums
```

### Manual Installation

1. Download the extension files
2. Extract to `packages/flarum-postalbums` directory
3. Run the following commands:

```bash
cd packages/flarum-postalbums
composer install
npm install
npm run build
```

4. Enable the extension in Flarum admin panel

## ⚙️ Configuration

Go to Flarum Admin → Extensions → PostAlbums to configure:

### Basic Settings
| Setting | Description | Default |
|---------|-------------|---------|
| Display Name | Name displayed in frontend | Post Albums |
| Add to Album Button Text | Text of the button under posts | +Album |
| Allow Guest Access | Whether to allow unauthenticated users to view albums | No |

### Recommended Albums Settings
| Setting | Description | Default |
|---------|-------------|---------|
| Show Recommended Albums | Whether to show recommended albums on post pages | No |
| Recommendation Position | Choose where to display recommendations | After Last Post |
| Recommendation Count | Number of albums to recommend (1-10) | 2 |

**Position Options:**
- **After First Post**: Suitable for active communities, higher exposure
- **After Last Post**: Suitable for reading-focused, less intrusive (Recommended)
- **At Reply Box**: Suitable for interaction-oriented, guide participation

### Announcement Settings
| Setting | Description | Limit |
|---------|-------------|-------|
| Album List Announcement | Announcement displayed below the title on album list page | Max 200 chars |

**Supported Formats:**
- ✅ Hyperlinks: `<a href="URL">text</a>`
- ✅ Line breaks: Press Enter or use `
`
- ❌ Other HTML tags will be filtered

**Announcement Example:**
```
Welcome to Post Albums!

Help: <a href="/d/123">View Tutorial</a>
Feedback: <a href="/d/456">Click Here</a>
```

### Limit Settings
| Setting | Description | Default |
|---------|-------------|---------|
| Required Discussions to Create | Number of discussions user needs to create albums | 0 (Unlimited) |
| Album Title Max Length | Maximum characters for album title | 100 |
| Album Description Max Length | Maximum characters for album description | 500 |
| Max Albums Per User | Limit albums a single user can create | 10 |
| Max Items Per Album | Limit posts a single album can contain | 1000 |

### Display Settings
| Setting | Description | Default |
|---------|-------------|---------|
| Albums Per Page | Number of albums per page in album square | 20 |
| Items Per Page | Number of posts per page in album detail | 10 |
| Default Sort | Default sorting method for album square | Latest |

**Sorting Options:**
- **Latest**: Sort by creation time descending
- **Most Followed**: Sort by follower count descending
- **Random**: Albums with collections first (random), empty albums last (random)

## 💡 Use Cases

### 1. Knowledge Organization
Users can create albums like "Frontend Development Tutorials", "Backend Tips" to collect quality posts.

### 2. Resource Collection
Create albums like "Useful Tools", "Great Extensions" to organize helpful resources.

### 3. Topic Tracking
Create albums like "Project Discussion", "Issue Summary" to track specific topic discussions.

### 4. Personal Collection
Create "My Favorites" album to save interesting content.

### 5. Community Recommendations
Discover more quality content and albums through the recommendation feature.

## 🎨 Style Customization

The extension provides complete LESS style files for customizing appearance:

```less
// Recommended Albums Style
.RecommendedAlbums {
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

// Announcement Style
.AlbumsPage-notice {
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  padding: 15px 20px;
}
```

## 🔧 Development

### Compile Frontend Resources

```bash
npm install
npm run build
```

### Development Mode

```bash
npm run dev
```

## 📝 Changelog

### Version 1.2.0 (2025-11-08)

#### New Features
- ✨ **Recommended Albums Feature**
  - Smart album recommendations on post pages
  - Three position options
  - Custom recommendation count (1-10)
  - Responsive card layout
  - Guide users to create albums

- 📢 **Announcement Feature**
  - Display admin announcements on album list page
  - Support hyperlinks and line breaks
  - Max 200 characters limit
  - Automatic security filtering

- ⚙️ **Custom Button Text**
  - Customize "Add to Album" button text
  - Admin settings, effective immediately

#### Improvements
- 🎨 Removed "Add to Album" button icon
- 🎨 Optimized recommended album card style
- 🎨 Auto-truncate description over 25 characters
- 🐛 Fixed HTML rendering issue in Mithril framework

### Version 1.0.0 (2025-01-01)

- 🎉 Initial release
- ✨ Basic album management
- ✨ Album following feature
- ✨ Album square
- ✨ Search and sorting

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

MIT License

## 👨‍💻 Author

wszdb

## 🔗 Links

- [Flarum Official](https://flarum.org/)
- [Flarum Chinese Community](https://discuss.flarum.org.cn/)
- [AiPy - AI Development Platform](https://www.aipyaipy.com/)

## 💬 Support

If you encounter any issues:

1. Check [Documentation](./FINAL_DEPLOYMENT_GUIDE.md)
2. Submit an [Issue](https://github.com/wszdb/flarum-postalbums/issues)
3. Join discussion group

## ⭐ Star History

If this extension helps you, please give us a Star!

---

**Developed by [AiPy](https://www.aipyaipy.com/)** (｡･ω･｡)ﾉ♡  
Local data processing, no information uploaded.  
Invitation Code: **XOFS**
