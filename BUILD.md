# 构建说明

## 环境要求

- Node.js 14.x 或更高版本
- npm 或 yarn
- PHP 7.3 或更高版本
- Composer

## 安装依赖

### 1. 安装 PHP 依赖

```bash
composer install
```

### 2. 安装 Node.js 依赖

```bash
npm install
# 或者使用 yarn
yarn install
```

## 编译前端资源

### 开发模式（带监听）

```bash
npm run dev
# 或
yarn dev
```

这会启动 webpack 监听模式，当你修改源文件时会自动重新编译。

### 生产模式构建

```bash
npm run build
# 或
yarn build
```

这会生成优化后的生产环境代码。

## 代码格式化

### 格式化代码

```bash
npm run format
# 或
yarn format
```

### 检查代码格式

```bash
npm run format:check
# 或
yarn format:check
```

## 清理构建文件

```bash
npm run clean
# 或
yarn clean
```

## 在 Flarum 中测试

1. 将整个 `flarum-postalbums` 目录复制到 Flarum 的 `extensions` 目录
2. 或者通过 composer 本地路径安装：

```bash
# 在 Flarum 根目录执行
composer config repositories.postalbums path /path/to/flarum-postalbums
composer require wszdb/flarum-postalbums:*
```

3. 运行迁移：

```bash
php flarum migrate
```

4. 清除缓存：

```bash
php flarum cache:clear
```

5. 在管理后台启用扩展

## 开发工作流

1. 修改源代码（`js/src/` 或 `src/`）
2. 运行 `npm run dev` 进行实时编译
3. 刷新浏览器查看效果
4. 提交前运行 `npm run format` 格式化代码
5. 运行 `npm run build` 生成生产版本

## 目录结构

```
flarum-postalbums/
├── js/
│   ├── src/          # 前端源代码
│   └── dist/         # 编译后的文件（自动生成）
├── src/              # PHP 后端代码
├── migrations/       # 数据库迁移文件
├── locale/           # 语言文件
└── resources/        # 静态资源
```

## 常见问题

### 编译错误

如果遇到编译错误，尝试：

1. 删除 `node_modules` 和 `js/dist`
2. 重新安装依赖：`npm install`
3. 重新编译：`npm run build`

### 权限问题

确保有写入 `js/dist` 目录的权限：

```bash
chmod -R 755 js/dist
```