// Service Worker for caching and offline support

const CACHE_NAME = 'ztt-blog-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// 需要缓存的静态资源
const STATIC_ASSETS = [
    '/',
    '/css/bootstrap.min.css',
    '/css/hux-blog.min.css',
    '/css/custom-beauty.css',
    '/css/accessibility.css',
    '/css/syntax.css',
    '/js/bootstrap.min.js',
    '/js/hux-blog.min.js',
    '/js/custom-effects.js',
    '/js/performance-optimization.js',
    '/img/favicon.ico',
    '/img/apple-touch-icon.png'
];

// 需要缓存的动态资源
const DYNAMIC_ASSETS = [
    '/about.html',
    '/tags.html',
    '/404.html'
];

// 安装事件
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Error caching static assets:', error);
            })
    );
});

// 激活事件
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// 获取事件
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // 跳过非GET请求
    if (request.method !== 'GET') {
        return;
    }
    
    // 跳过第三方资源
    if (url.origin !== self.location.origin) {
        return;
    }
    
    // 跳过API请求
    if (url.pathname.startsWith('/api/')) {
        return;
    }
    
    event.respondWith(
        caches.match(request)
            .then(response => {
                // 如果缓存中有响应，返回缓存的响应
                if (response) {
                    return response;
                }
                
                // 否则从网络获取
                return fetch(request)
                    .then(networkResponse => {
                        // 检查响应是否有效
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        
                        // 克隆响应
                        const responseToCache = networkResponse.clone();
                        
                        // 根据资源类型选择缓存策略
                        if (isStaticAsset(request.url)) {
                            // 静态资源：缓存到静态缓存
                            caches.open(STATIC_CACHE)
                                .then(cache => {
                                    cache.put(request, responseToCache);
                                });
                        } else if (isDynamicAsset(request.url)) {
                            // 动态资源：缓存到动态缓存
                            caches.open(DYNAMIC_CACHE)
                                .then(cache => {
                                    cache.put(request, responseToCache);
                                });
                        }
                        
                        return networkResponse;
                    })
                    .catch(error => {
                        console.error('Fetch failed:', error);
                        
                        // 如果是HTML页面，返回离线页面
                        if (request.headers.get('accept').includes('text/html')) {
                            return caches.match('/offline.html');
                        }
                        
                        // 如果是图片，返回默认图片
                        if (request.headers.get('accept').includes('image/')) {
                            return caches.match('/img/404-bg.jpg');
                        }
                        
                        throw error;
                    });
            })
    );
});

// 判断是否为静态资源
function isStaticAsset(url) {
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
    return staticExtensions.some(ext => url.includes(ext));
}

// 判断是否为动态资源
function isDynamicAsset(url) {
    return url.includes('.html') || url.includes('/posts/');
}

// 后台同步
self.addEventListener('sync', event => {
    console.log('Background sync:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// 后台同步任务
function doBackgroundSync() {
    // 这里可以添加后台同步逻辑
    console.log('Performing background sync...');
    return Promise.resolve();
}

// 推送通知
self.addEventListener('push', event => {
    console.log('Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New content available!',
        icon: '/img/apple-touch-icon.png',
        badge: '/img/apple-touch-icon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View',
                icon: '/img/apple-touch-icon.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/img/apple-touch-icon.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('ZTT\'s Blog', options)
    );
});

// 通知点击事件
self.addEventListener('notificationclick', event => {
    console.log('Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// 消息事件
self.addEventListener('message', event => {
    console.log('Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// 错误处理
self.addEventListener('error', event => {
    console.error('Service Worker error:', event.error);
});

// 未处理的Promise拒绝
self.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
});
