// 炫酷效果增强脚本

document.addEventListener('DOMContentLoaded', function() {
    
    // 鼠标跟随效果
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: linear-gradient(45deg, #ff00ff, #00ffff);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
        box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
    `;
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // 鼠标悬停时放大光标
    document.addEventListener('mouseenter', function() {
        cursor.style.transform = 'scale(1.5)';
    });

    document.addEventListener('mouseleave', function() {
        cursor.style.transform = 'scale(1)';
    });

    // 点击波纹效果
    document.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: fixed;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 0, 255, 0.6) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9998;
            animation: rippleExpand 0.6s ease-out;
        `;
        
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            document.body.removeChild(ripple);
        }, 600);
    });

    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleExpand {
            0% {
                width: 0;
                height: 0;
                opacity: 1;
            }
            100% {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
            50% { transform: translateY(-100px) rotate(180deg); opacity: 1; }
        }
        
        .particle {
            animation: float 6s ease-in-out infinite;
        }
        
        .particle:nth-child(1) { animation-delay: 0s; }
        .particle:nth-child(2) { animation-delay: 1s; }
        .particle:nth-child(3) { animation-delay: 2s; }
        .particle:nth-child(4) { animation-delay: 3s; }
        .particle:nth-child(5) { animation-delay: 4s; }
        .particle:nth-child(6) { animation-delay: 5s; }
        .particle:nth-child(7) { animation-delay: 1.5s; }
        .particle:nth-child(8) { animation-delay: 2.5s; }
        .particle:nth-child(9) { animation-delay: 3.5s; }
        .particle:nth-child(10) { animation-delay: 4.5s; }
    `;
    document.head.appendChild(style);

    // 滚动视差效果
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.welcome-section');
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });

    // 文章卡片悬停音效（可选）
    const postCards = document.querySelectorAll('.post-preview');
    postCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // 添加悬停时的额外效果
            this.style.transform = 'translateY(-15px) rotateX(10deg) rotateY(10deg) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // 导航栏滚动效果增强
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar-default');
        const currentScrollTop = window.pageYOffset;
        
        if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
            // 向下滚动
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = currentScrollTop;
    });

    // 添加键盘快捷键
    document.addEventListener('keydown', function(e) {
        // Ctrl + K 打开搜索（如果有搜索功能）
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            // 这里可以添加搜索功能
            console.log('搜索快捷键被触发');
        }
        
        // 空格键暂停/恢复粒子动画
        if (e.code === 'Space') {
            e.preventDefault();
            const particles = document.querySelectorAll('.particle');
            particles.forEach(particle => {
                if (particle.style.animationPlayState === 'paused') {
                    particle.style.animationPlayState = 'running';
                } else {
                    particle.style.animationPlayState = 'paused';
                }
            });
        }
    });

    // 添加页面加载动画
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 1s ease-in-out';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // 添加随机颜色变化效果
    function randomColor() {
        const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0080', '#8000ff', '#00ff80'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // 每5秒随机改变一些元素的颜色
    setInterval(() => {
        const elements = document.querySelectorAll('.stat-item, .post-preview');
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        if (randomElement) {
            randomElement.style.borderColor = randomColor();
            setTimeout(() => {
                randomElement.style.borderColor = '';
            }, 2000);
        }
    }, 5000);

    // 添加打字机效果到标题
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // 为欢迎标题添加打字机效果（可选）
    const welcomeTitle = document.querySelector('.welcome-title');
    if (welcomeTitle && !welcomeTitle.dataset.typed) {
        const originalText = welcomeTitle.textContent;
        welcomeTitle.dataset.typed = 'true';
        
        // 延迟2秒后开始打字效果
        setTimeout(() => {
            typeWriter(welcomeTitle, originalText, 150);
        }, 2000);
    }

    // 添加3D倾斜效果
    document.addEventListener('mousemove', function(e) {
        const cards = document.querySelectorAll('.post-preview');
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        
        cards.forEach(card => {
            card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
    });

    // 重置3D效果
    document.addEventListener('mouseleave', function() {
        const cards = document.querySelectorAll('.post-preview');
        cards.forEach(card => {
            card.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
    });

    console.log('�� 炫酷效果已加载完成！');
});
