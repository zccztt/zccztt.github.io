// 性能优化脚本 - 确保炫酷效果流畅运行

// 性能监控
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.isMonitoring = false;
    }

    start() {
        this.isMonitoring = true;
        this.monitor();
    }

    stop() {
        this.isMonitoring = false;
    }

    monitor() {
        if (!this.isMonitoring) return;

        this.frameCount++;
        const currentTime = performance.now();

        if (currentTime - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;

            // 如果FPS过低，降低动画复杂度
            if (this.fps < 30) {
                this.reduceAnimations();
            } else if (this.fps > 50) {
                this.restoreAnimations();
            }
        }

        requestAnimationFrame(() => this.monitor());
    }

    reduceAnimations() {
        // 减少粒子数量
        const particles = document.querySelectorAll('.particle');
        if (particles.length > 5) {
            for (let i = 5; i < particles.length; i++) {
                particles[i].style.display = 'none';
            }
        }

        // 简化3D效果
        document.body.classList.add('reduced-animations');
    }

    restoreAnimations() {
        // 恢复粒子显示
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.display = 'block';
        });

        // 恢复3D效果
        document.body.classList.remove('reduced-animations');
    }
}

// 初始化性能监控
const performanceMonitor = new PerformanceMonitor();

// 页面加载完成后启动监控
document.addEventListener('DOMContentLoaded', function() {
    // 延迟启动监控，避免影响初始加载
    setTimeout(() => {
        performanceMonitor.start();
    }, 3000);

    // 添加性能优化CSS
    const performanceCSS = `
        .reduced-animations .post-preview {
            transform: none !important;
            transition: none !important;
        }
        
        .reduced-animations .particle {
            animation: none !important;
        }
        
        .reduced-animations .welcome-title {
            animation: none !important;
        }
        
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;

    const style = document.createElement('style');
    style.textContent = performanceCSS;
    document.head.appendChild(style);

    // 检测设备性能
    const isLowEndDevice = () => {
        const memory = navigator.deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;
        const connection = navigator.connection;
        
        return memory < 4 || cores < 4 || 
               (connection && connection.effectiveType === 'slow-2g');
    };

    // 如果是低端设备，自动降低动画复杂度
    if (isLowEndDevice()) {
        performanceMonitor.reduceAnimations();
        console.log('检测到低端设备，已自动优化动画效果');
    }

    // 监听网络状态变化
    if (navigator.connection) {
        navigator.connection.addEventListener('change', function() {
            if (this.effectiveType === 'slow-2g' || this.effectiveType === '2g') {
                performanceMonitor.reduceAnimations();
            } else {
                performanceMonitor.restoreAnimations();
            }
        });
    }

    // 监听用户偏好设置
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleMotionPreference(e) {
        if (e.matches) {
            performanceMonitor.reduceAnimations();
            console.log('用户偏好减少动画，已优化');
        } else {
            performanceMonitor.restoreAnimations();
        }
    }

    prefersReducedMotion.addListener(handleMotionPreference);
    handleMotionPreference(prefersReducedMotion);

    // 优化滚动性能
    let ticking = false;
    
    function updateOnScroll() {
        // 滚动相关的更新逻辑
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });

    // 优化鼠标移动事件
    let mouseTicking = false;
    
    function updateOnMouseMove() {
        // 鼠标移动相关的更新逻辑
        mouseTicking = false;
    }
    
    function requestMouseTick() {
        if (!mouseTicking) {
            requestAnimationFrame(updateOnMouseMove);
            mouseTicking = true;
        }
    }
    
    document.addEventListener('mousemove', requestMouseTick, { passive: true });

    // 图片懒加载优化
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // 预加载关键资源
    const preloadLinks = [
        '/css/custom-beauty.css',
        '/js/custom-effects.js'
    ];

    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = href.endsWith('.css') ? 'style' : 'script';
        document.head.appendChild(link);
    });

    // 内存管理
    let animationFrames = [];
    
    function cleanupAnimations() {
        animationFrames.forEach(frame => {
            if (frame) cancelAnimationFrame(frame);
        });
        animationFrames = [];
    }
    
    // 页面卸载时清理资源
    window.addEventListener('beforeunload', cleanupAnimations);
    
    // 定期清理
    setInterval(cleanupAnimations, 30000); // 每30秒清理一次

    // 错误处理
    window.addEventListener('error', function(e) {
        console.warn('检测到错误，正在优化性能:', e.error);
        performanceMonitor.reduceAnimations();
    });

    // 性能指标监控
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                if (loadTime > 3000) {
                    console.warn('页面加载时间较长，正在优化动画效果');
                    performanceMonitor.reduceAnimations();
                }
            }, 1000);
        });
    }

    console.log('🚀 性能优化已启动');
});

// 导出性能监控器供其他脚本使用
window.PerformanceMonitor = PerformanceMonitor;
