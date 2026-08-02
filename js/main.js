(function () {
  'use strict';

  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var prefersReducedMotion = reduceMotionQuery.matches;

  // ---- 顶层初始化 ----
  // 延迟执行，确保 DOM 解析完成（脚本以 defer 加载，DOMContentLoaded 前已可访问 DOM）
  function init() {
    // 标记 JS 已启用: CSS 的 html:not(.js) 无 JS 兜底因此不再命中, [data-reveal] 入场动画生效
    document.documentElement.classList.add('js');

    syncReducedMotionClass();

    initReducedMotionWatcher();
    initNavToggle();
    initAnchorScroll();
    initScrollReveal();
    initTypeTitle();
    initCountUp();
    initParallax();
    initHeaderState();
    initFooterYear();
  }

  // ---- reduced-motion 降级 ----
  // 匹配 prefers-reduced-motion 时给 body 加 reduced-motion 类，CSS 据此禁用动画
  function syncReducedMotionClass() {
    document.body.classList.toggle('reduced-motion', prefersReducedMotion);
  }

  // 监听系统偏好变化，动态加/删 reduced-motion 类
  function initReducedMotionWatcher() {
    if (typeof reduceMotionQuery.addEventListener === 'function') {
      reduceMotionQuery.addEventListener('change', function (event) {
        prefersReducedMotion = event.matches;
        syncReducedMotionClass();
      });
    } else if (typeof reduceMotionQuery.addListener === 'function') {
      reduceMotionQuery.addListener(function (event) {
        prefersReducedMotion = event.matches;
        syncReducedMotionClass();
      });
    }
  }

  // ---- 汉堡菜单（移动端导航） ----
  function initNavToggle() {
    var toggle = document.getElementById('nav-toggle');
    if (!toggle) {
      return;
    }

    var setOpen = function (open) {
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
      // 关闭后把焦点还给汉堡按钮，方便键盘用户继续操作
      if (!open) {
        toggle.focus();
      }
    };

    toggle.addEventListener('click', function () {
      setOpen(!document.body.classList.contains('nav-open'));
    });

    // 点击菜单内任意导航链接后关闭菜单
    document.querySelectorAll('.nav-menu a.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });

    // Esc 键关闭菜单
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
        setOpen(false);
      }
    });

    // 菜单打开时循环 Tab 焦点（焦点陷阱），避免焦点逃出菜单
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Tab' || !document.body.classList.contains('nav-open')) {
        return;
      }
      var focusables = Array.prototype.slice
        .call(document.querySelectorAll('.nav-menu a, .nav-toggle'))
        .filter(function (el) {
          return el.offsetParent !== null;
        });
      if (!focusables.length) {
        return;
      }
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  // ---- 平滑锚点滚动 ----
  function initAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      var hash = link.getAttribute('href');
      if (!hash || hash === '#') {
        return;
      }

      link.addEventListener('click', function (event) {
        var target = document.querySelector(hash);
        if (!target) {
          return;
        }
        event.preventDefault();
        // 平滑/即时由 CSS `html { scroll-behavior }` 统一控制（含 reduced-motion 降级）
        target.scrollIntoView({ block: 'start' });
      });
    });
  }

  // ---- 滚动入场揭示 [data-reveal] ----
  function initScrollReveal() {
    var revealElements = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

    // reduced-motion 下跳过观察，直接显示全部
    if (prefersReducedMotion) {
      revealElements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    // 兜底：若 CSS 未实现 data-delay 的 transition-delay，则用 inline 样式补齐
    revealElements.forEach(function (el) {
      var delay = el.getAttribute('data-delay');
      if (delay) {
        var delayMs = parseInt(delay, 10);
        if (!isNaN(delayMs)) {
          el.style.transitionDelay = delayMs + 'ms';
        }
      }
    });

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // ---- Hero 标题终端打字效果 ----
  // 载入时以"终端命令行输入"形式逐字敲出主标题，"_" 光标随之闪烁
  function initTypeTitle() {
    var typeElements = Array.prototype.slice.call(document.querySelectorAll('[data-type-title]'));
    if (!typeElements.length) {
      return;
    }

    var charDuration = 120; // 每字间隔 ms
    var startDelay = 400;   // 页面载入后的开始延迟 ms

    typeElements.forEach(function (el) {
      var full = el.getAttribute('data-type-title') || '';
      if (!full) {
        return;
      }

      // reduced-motion: 直接呈现完整文案，光标保持静止（CSS 侧已禁用闪烁）
      if (prefersReducedMotion) {
        el.textContent = full;
        return;
      }

      var chars = full.split('');
      var index = 0;
      el.textContent = '';

      function typeNext() {
        if (index < chars.length) {
          el.textContent += chars[index];
          index += 1;
          window.setTimeout(typeNext, charDuration);
        }
      }

      window.setTimeout(typeNext, startDelay);
    });
  }

  // ---- 数值滚动 [data-count] ----
  function initCountUp() {
    var countElements = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));

    // reduced-motion 下直接显示最终值
    if (prefersReducedMotion) {
      countElements.forEach(function (el) {
        setCountValue(el, getCountTarget(el));
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      countElements.forEach(function (el) {
        setCountValue(el, getCountTarget(el));
      });
      return;
    }

    var countObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    countElements.forEach(function (el) {
      countObserver.observe(el);
    });
  }

  // 读取 data-count 目标值；含非数字（如占位文案）则返回 null 表示跳过
  function getCountTarget(el) {
    var raw = el.getAttribute('data-count');
    if (raw === null) {
      return null;
    }
    var value = parseFloat(raw);
    return isNaN(value) ? null : value;
  }

  // 直接把元素设为目标值（含 prefix / suffix / 千分位）
  function setCountValue(el, target) {
    if (target === null) {
      return;
    }
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    el.textContent = prefix + formatCountValue(target) + suffix;
  }

  function formatCountValue(value) {
    var isFloat = value % 1 !== 0;
    if (isFloat) {
      var decimals = (String(value).split('.')[1] || '').length;
      return value.toFixed(decimals);
    }
    // 大整数千分位分隔
    return Math.round(value).toLocaleString('en-US');
  }

  function animateCount(el) {
    var target = getCountTarget(el);
    if (target === null) {
      return;
    }

    var startTime = null;
    var duration = 1200;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function frame(timestamp) {
      if (startTime === null) {
        startTime = timestamp;
      }
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = easeOutCubic(progress);
      var current = target * eased;

      if (progress < 1) {
        el.textContent = prefix + formatCountValue(current) + suffix;
        window.requestAnimationFrame(frame);
      } else {
        el.textContent = prefix + formatCountValue(target) + suffix;
      }
    }

    window.requestAnimationFrame(frame);
  }

  // ---- 视差 [data-parallax] ----
  function initParallax() {
    var parallaxElements = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    if (!parallaxElements.length) {
      return;
    }

    // reduced-motion 或移动端（<=768px）禁用视差避免卡顿
    if (prefersReducedMotion || window.innerWidth <= 768) {
      return;
    }

    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    // 解析速率，默认 0.2，方向为背景层反向缓移
    var rates = parallaxElements.map(function (el) {
      var rate = parseFloat(el.getAttribute('data-parallax'));
      return isNaN(rate) ? 0.2 : rate;
    });

    var lastY = window.scrollY;
    var ticking = false;

    function update() {
      var scrollY = window.scrollY;

      parallaxElements.forEach(function (el, index) {
        // 元素已完全离开视口时跳过更新，减少滚动开销
        var rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          return;
        }
        var rate = rates[index];
        var translate = -scrollY * rate;
        el.style.transform = 'translateY(' + translate.toFixed(1) + 'px)';
      });

      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    function onScroll() {
      // 用 requestAnimationFrame 节流：仅滚动量变化时才更新
      if (window.scrollY !== lastY) {
        lastY = window.scrollY;
        requestTick();
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // 初始应用一次，避免元素样式缺失
    update();
  }

  // ---- 顶部导航滚动状态 ----
  function initHeaderState() {
    var header = document.querySelector('header.site-header');
    if (!header) {
      return;
    }

    var threshold = 10;

    var updateHeader = function () {
      header.classList.toggle('scrolled', window.scrollY > threshold);
    };

    // 滚动时节流更新（视觉状态，reduced-motion 下同样需要）
    var ticking = false;
    var onScroll = function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(function () {
          updateHeader();
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateHeader();
  }

  // ---- 页脚年份 ----
  function initFooterYear() {
    var yearElements = document.querySelectorAll('[data-year]');
    var currentYear = String(new Date().getFullYear());
    yearElements.forEach(function (el) {
      el.textContent = currentYear;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
