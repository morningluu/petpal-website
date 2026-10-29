/**
 * 宠伴 - 全局脚本
 * 仅此一个JS文件，全站共用
 */
(function(){
  'use strict';

  /* ========== DOM加载完成后执行 ========== */
  document.addEventListener('DOMContentLoaded',function(){

    /* --- 移动端菜单切换（滑入式） --- */
    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');
    if(navToggle && navLinks){
      /* 创建遮罩层 */
      var overlay = document.createElement('div');
      overlay.className = 'nav-overlay';
      document.body.appendChild(overlay);

      function openMenu(){
        navLinks.classList.add('open');
        navToggle.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
      function closeMenu(){
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }

      navToggle.addEventListener('click',function(){
        if(navLinks.classList.contains('open')){
          closeMenu();
        }else{
          openMenu();
        }
      });

      overlay.addEventListener('click', closeMenu);

      navLinks.querySelectorAll('a').forEach(function(link){
        link.addEventListener('click', closeMenu);
      });
    }

    /* --- 导航栏滚动阴影 --- */
    var navbar = document.querySelector('.navbar');
    window.addEventListener('scroll',function(){
      if(window.scrollY > 10){
        navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,.1)';
      }else{
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,.06)';
      }
    });

    /* --- 设置当前页导航激活状态 --- */
    setActiveNav();

    /* --- Banner轮播（子页面使用） --- */
    initBannerSlider();

    /* --- 回到顶部按钮 --- */
    initBackToTop();

    /* --- 百科弹窗浮层（社区页） --- */
    initEncyclopediaOverlay();

    /* --- 商城分类筛选 --- */
    initShopFilter();

    /* --- 搜索功能 --- */
    initSearch();

    /* --- 首页百科轮播 --- */
    initEncyclopediaCarousel();

    /* --- 悬浮侧边栏交互 --- */
    initFloatingSidebar();

    /* --- 社区问答交互 --- */
    initQA();

    /* --- 滚动渐入动画 --- */
    initScrollReveal();

    /* --- 领养分类导航 --- */
    initCategoryTabs();

    /* --- 热门宠物轮播 --- */
    initHotPetsCarousel();

    /* --- 文章折叠面板 --- */
    initArticleToggle();

    /* --- 商城购物车 --- */
    initShopCart();

  });

  /* ========== 设置导航激活状态 ========== */
  function setActiveNav(){
    var path = window.location.pathname;
    var page = path.split('/').pop() || 'index.html';
    var navAll = document.querySelectorAll('.nav-links a');
    navAll.forEach(function(a){
      a.classList.remove('active');
      var href = a.getAttribute('href');
      if(href === page){
        a.classList.add('active');
      }
    });
  }

  /* ========== Banner轮播（子页面使用） ========== */
  function initBannerSlider(){
    var slides = document.querySelector('.banner-slides');
    var dots = document.querySelectorAll('.banner-dot');
    var prevBtn = document.getElementById('detailBannerPrev');
    var nextBtn = document.getElementById('detailBannerNext');
    if(!slides || dots.length===0) return;

    var current = 0;
    var total = dots.length;
    var timer = null;
    var DURATION = 4000;

    function goTo(index){
      current = index;
      slides.style.transform = 'translateX(-' + (current*100) + '%)';
      dots.forEach(function(d,i){
        d.classList.toggle('active', i===current);
      });
    }

    function next(){
      goTo((current+1) % total);
    }

    function prev(){
      goTo((current-1+total) % total);
    }

    dots.forEach(function(dot,i){
      dot.addEventListener('click',function(){
        goTo(i);
        resetTimer();
      });
    });

    if(prevBtn){
      prevBtn.addEventListener('click',function(){
        prev();
        resetTimer();
      });
    }
    if(nextBtn){
      nextBtn.addEventListener('click',function(){
        next();
        resetTimer();
      });
    }

    function startTimer(){
      timer = setInterval(next, DURATION);
    }

    function resetTimer(){
      clearInterval(timer);
      startTimer();
    }

    var touchStartX = 0;
    var touchEndX = 0;
    slides.addEventListener('touchstart',function(e){
      touchStartX = e.changedTouches[0].screenX;
    },{passive:true});
    slides.addEventListener('touchend',function(e){
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if(Math.abs(diff) > 60){
        if(diff > 0){
          goTo((current+1) % total);
        }else{
          goTo((current-1+total) % total);
        }
        resetTimer();
      }
    });

    slides.addEventListener('mouseenter',function(){clearInterval(timer);});
    slides.addEventListener('mouseleave',startTimer);

    startTimer();
  }

  /* ========== 回到顶部 ========== */
  function initBackToTop(){
    var btn = document.querySelector('.back-to-top');
    if(!btn) return;

    window.addEventListener('scroll',function(){
      if(window.scrollY > 400){
        btn.classList.add('visible');
      }else{
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click',function(){
      window.scrollTo({top:0,behavior:'smooth'});
    });
  }

  /* ========== 首页百科横向轮播 ========== */
  function initEncyclopediaCarousel(){
    var carousel = document.getElementById('encyclopediaCarousel');
    if(!carousel) return;

    var isDown = false;
    var startX = 0;
    var scrollLeft = 0;

    carousel.addEventListener('mousedown',function(e){
      isDown = true;
      carousel.style.cursor = 'grabbing';
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave',function(){
      isDown = false;
      carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mouseup',function(){
      isDown = false;
      carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mousemove',function(e){
      if(!isDown) return;
      e.preventDefault();
      var x = e.pageX - carousel.offsetLeft;
      var walk = (x - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk;
    });

    // 触摸滑动
    carousel.style.cursor = 'grab';

    // 自动居中滚动
    var scrollTimer;
    carousel.addEventListener('scroll',function(){
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function(){
        var cards = carousel.querySelectorAll('.encyclopedia-card-new');
        if(cards.length === 0) return;
        var cardWidth = cards[0].offsetWidth + 24; // 24 is gap
        var targetIndex = Math.round(carousel.scrollLeft / cardWidth);
        carousel.scrollTo({left: targetIndex * cardWidth, behavior: 'smooth'});
      }, 150);
    });
  }

  /* ========== 悬浮侧边栏交互 ========== */
  function initFloatingSidebar(){
    var pills = document.querySelectorAll('.floating-sidebar .sidebar-pill');
    if(pills.length === 0) return;

    pills.forEach(function(pill){
      pill.addEventListener('click',function(){
        var text = this.textContent.trim();
        // 滚动到对应板块
        var targetMap = {
          '萌宠社区': '.community-section',
          '宠物百科': '.encyclopedia-section',
          '掌上医生': '.doctor-section',
          '智能问答': '.qa-section-block'
        };
        var selector = targetMap[text];
        if(selector){
          var target = document.querySelector(selector);
          if(target){
            target.scrollIntoView({behavior:'smooth',block:'start'});
          }
        }
      });
    });
  }

  /* ========== 领养分类导航 ========== */
  function initCategoryTabs(){
    var tabs = document.querySelectorAll('.category-tab');
    if(tabs.length === 0) return;

    tabs.forEach(function(tab){
      tab.addEventListener('click',function(){
        tabs.forEach(function(t){t.classList.remove('active');});
        this.classList.add('active');
        var series = this.getAttribute('data-series');
        var target = document.getElementById('series-' + series);
        if(target){
          target.scrollIntoView({behavior:'smooth',block:'start'});
        }
      });
    });

    // 左右翻页箭头
    var prevArrow = document.getElementById('catNavPrev');
    var nextArrow = document.getElementById('catNavNext');
    if(prevArrow && nextArrow){
      prevArrow.addEventListener('click',function(){
        var activeTab = document.querySelector('.category-tab.active');
        if(activeTab){
          var prev = activeTab.previousElementSibling;
          if(prev && prev.classList.contains('category-tab')){
            prev.click();
          }
        }
      });
      nextArrow.addEventListener('click',function(){
        var activeTab = document.querySelector('.category-tab.active');
        if(activeTab){
          var next = activeTab.nextElementSibling;
          if(next && next.classList.contains('category-tab')){
            next.click();
          }
        }
      });
    }
  }

  /* ========== 百科弹窗浮层 ========== */
  function initEncyclopediaOverlay(){
    var cards = document.querySelectorAll('.encyclopedia-card');
    var overlay = document.querySelector('.encyclopedia-overlay');
    if(cards.length===0 || !overlay) return;

    var popupTitle = overlay.querySelector('.popup-title');
    var popupContent = overlay.querySelector('.popup-content');
    var closeBtn = overlay.querySelector('.encyclopedia-close');

    var data = {
      cat: {
        title:'猫咪百科',
        content:'猫咪是世界上最受欢迎的宠物之一。它们独立、优雅、爱干净。猫咪平均寿命12-16年，需要定期疫苗、驱虫和体检。常见品种有英短、美短、布偶、暹罗等。养猫前请准备好猫砂盆、猫抓板、猫粮和充足的活动空间。猫咪是肉食动物，需要高蛋白饮食。'
      },
      dog: {
        title:'狗狗百科',
        content:'狗狗是人类最忠诚的伙伴。它们热情、友善、需要主人的陪伴。狗狗平均寿命10-15年，需要每天遛弯、定期疫苗和洗澡。常见品种有金毛、拉布拉多、柯基、泰迪等。养狗前请确保有足够的时间陪伴和运动空间。'
      },
      bird: {
        title:'飞鸟百科',
        content:'鸟类宠物色彩斑斓、歌声悦耳。常见的宠物鸟有虎皮鹦鹉、玄凤鹦鹉、金丝雀等。鸟类需要宽敞的笼子、多样化的食物和定期的放飞时间。注意保持环境温暖，避免穿堂风。鸟类智商较高，可以训练简单的指令。'
      },
      hamster: {
        title:'仓鼠百科',
        content:'仓鼠是小型宠物中最受欢迎的选择之一。它们体型小巧、饲养简单、非常适合初次养宠的人群。仓鼠是夜行动物，白天大多在睡觉。需要准备跑轮、躲避屋、木屑垫材等用品。注意仓鼠是独居动物，不建议合笼。'
      }
    };

    cards.forEach(function(card){
      card.addEventListener('click',function(){
        var type = this.getAttribute('data-type');
        var info = data[type];
        if(info){
          popupTitle.textContent = info.title;
          popupContent.textContent = info.content;
          overlay.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    closeBtn.addEventListener('click',closeOverlay);
    overlay.addEventListener('click',function(e){
      if(e.target === overlay) closeOverlay();
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape' && overlay.classList.contains('active')){
        closeOverlay();
      }
    });

    function closeOverlay(){
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /* ========== 商城分类筛选 ========== */
  function initShopFilter(){
    var categories = document.querySelectorAll('.shop-category');
    var products = document.querySelectorAll('.product-card');
    if(categories.length===0 || products.length===0) return;

    categories.forEach(function(cat){
      cat.addEventListener('click',function(){
        categories.forEach(function(c){c.classList.remove('active');});
        this.classList.add('active');
        var filter = this.getAttribute('data-filter') || 'all';

        products.forEach(function(p){
          if(filter==='all' || p.getAttribute('data-category')===filter){
            p.style.display = '';
            p.style.animation = 'fadeInUp .4s ease forwards';
          }else{
            p.style.display = 'none';
          }
        });
      });
    });
  }

  /* ========== 搜索功能 ========== */
  function initSearch(){
    var searchInput = document.querySelector('.nav-search input');
    if(!searchInput) return;

    searchInput.addEventListener('keydown',function(e){
      if(e.key==='Enter'){
        var query = this.value.trim();
        if(query){
          alert('搜索：' + query + '\n（功能演示，后续对接真实搜索）');
        }
      }
    });
  }

  /* ========== 社区智能问答 ========== */
  function initQA(){
    var qaInput = document.querySelector('.qa-input-wrap input');
    var qaBtn = document.querySelector('.qa-input-wrap .btn');
    var suggestions = document.querySelectorAll('.qa-suggestion');

    if(!qaInput || !qaBtn) return;

    function ask(question){
      if(!question.trim()) return;
      alert('您的问题：' + question + '\n\n宠伴小助手正在努力回答中...');
      qaInput.value = '';
    }

    qaBtn.addEventListener('click',function(){
      ask(qaInput.value);
    });

    qaInput.addEventListener('keydown',function(e){
      if(e.key==='Enter') ask(qaInput.value);
    });

    suggestions.forEach(function(s){
      s.addEventListener('click',function(){
        qaInput.value = this.textContent;
        ask(this.textContent);
      });
    });
  }

  /* ========== 热门宠物轮播（三页分页） ========== */
  function initHotPetsCarousel(){
    var track = document.getElementById('hotPetsTrack');
    var prevBtn = document.getElementById('hotPetsPrev');
    var nextBtn = document.getElementById('hotPetsNext');
    var dots = document.querySelectorAll('#hotPetsDots .carousel-dot');
    if(!track || !prevBtn || !nextBtn || dots.length===0) return;

    var current = 0;
    var total = dots.length;
    var timer = null;
    var DURATION = 5000;

    function goTo(index){
      if(index < 0) index = total - 1;
      if(index >= total) index = 0;
      current = index;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function(d, i){
        d.classList.toggle('active', i === current);
      });
    }

    function next(){
      goTo(current + 1);
    }

    function prev(){
      goTo(current - 1);
    }

    prevBtn.addEventListener('click', function(){
      prev();
      resetTimer();
    });

    nextBtn.addEventListener('click', function(){
      next();
      resetTimer();
    });

    dots.forEach(function(dot, i){
      dot.addEventListener('click', function(){
        goTo(i);
        resetTimer();
      });
    });

    function startTimer(){
      timer = setInterval(next, DURATION);
    }

    function resetTimer(){
      clearInterval(timer);
      startTimer();
    }

    /* 触摸滑动支持 */
    var touchStartX = 0;
    var touchEndX = 0;
    track.addEventListener('touchstart', function(e){
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    track.addEventListener('touchend', function(e){
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if(Math.abs(diff) > 50){
        if(diff > 0){ next(); }
        else { prev(); }
        resetTimer();
      }
    });

    startTimer();
  }

  /* ========== 滚动渐入动画 ========== */
  function initScrollReveal(){
    var items = document.querySelectorAll('.fade-in-up');
    if(items.length===0) return;

    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('revealed');
        }
      });
    },{threshold:0.15});

    items.forEach(function(item){
      observer.observe(item);
    });
  }

  /* ========== 文章折叠面板 ========== */
  function initArticleToggle(){
    var btn = document.getElementById('articleToggle');
    var detail = document.getElementById('articleDetail');
    if(!btn || !detail) return;

    btn.addEventListener('click',function(){
      var isOpen = detail.classList.contains('open');
      if(isOpen){
        detail.classList.remove('open');
        btn.textContent = '查看详情';
      }else{
        detail.classList.add('open');
        btn.textContent = '收起详情';
      }
    });
  }

  /* ========== 购物车管理器 ========== */
  var CartManager = {
    STORAGE_KEY: 'petpal_cart',

    getCart: function() {
      try {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
      } catch (e) {
        return {};
      }
    },

    saveCart: function(cart) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    },

    addItem: function(id, name, price) {
      var cart = this.getCart();
      var key = String(id);
      if (cart[key]) {
        cart[key].quantity += 1;
      } else {
        cart[key] = {
          id: id,
          name: name,
          price: Number(price),
          quantity: 1
        };
      }
      this.saveCart(cart);
      return cart;
    },

    removeItem: function(id) {
      var cart = this.getCart();
      delete cart[String(id)];
      this.saveCart(cart);
      return cart;
    },

    updateQuantity: function(id, delta) {
      var cart = this.getCart();
      var key = String(id);
      if (!cart[key]) return cart;
      cart[key].quantity += delta;
      if (cart[key].quantity <= 0) {
        delete cart[key];
      }
      this.saveCart(cart);
      return cart;
    },

    clearCart: function() {
      localStorage.removeItem(this.STORAGE_KEY);
    },

    getTotal: function() {
      var cart = this.getCart();
      var total = 0;
      Object.keys(cart).forEach(function(key) {
        var item = cart[key];
        total += item.price * item.quantity;
      });
      return total;
    },

    getCount: function() {
      var cart = this.getCart();
      var count = 0;
      Object.keys(cart).forEach(function(key) {
        count += cart[key].quantity;
      });
      return count;
    }
  };

  /* ========== 商城购物车初始化 ========== */
  function initShopCart(){
    var cartPanel = document.getElementById('cartPanel');
    var cartFloatBtn = document.getElementById('cartFloatBtn');
    var cartClose = document.getElementById('cartClose');
    var cartClear = document.getElementById('cartClear');
    var cartOrder = document.getElementById('cartOrder');
    var productGrid = document.getElementById('shopProductGrid');

    /* 只在商城页执行 */
    if (!cartPanel || !productGrid) return;

    /* 渲染已有购物车 */
    renderCart();

    /* 商品grid点击（事件委托 - 加入购物车） */
    productGrid.addEventListener('click', function(e) {
      var btn = e.target.closest('.add-to-cart-btn');
      if (!btn) return;

      var card = btn.closest('.product-card');
      if (!card) return;

      var id = card.getAttribute('data-id');
      var name = card.getAttribute('data-name');
      var price = card.getAttribute('data-price');

      /* 加入购物车 */
      CartManager.addItem(id, name, price);

      /* 按钮反馈动画 */
      btn.classList.add('added');
      setTimeout(function() {
        btn.classList.remove('added');
      }, 600);

      /* 悬浮按钮弹跳 */
      if (cartFloatBtn) {
        cartFloatBtn.classList.add('cart-float-btn--bounce');
        setTimeout(function() {
          cartFloatBtn.classList.remove('cart-float-btn--bounce');
        }, 400);
      }

      /* 更新购物车UI */
      renderCart();
    });

    /* 打开购物车面板 */
    if (cartFloatBtn) {
      cartFloatBtn.addEventListener('click', function() {
        cartPanel.classList.add('cart-panel--open');
        document.body.style.overflow = 'hidden';
      });
    }

    /* 关闭购物车面板 */
    if (cartClose) {
      cartClose.addEventListener('click', closeCartPanel);
    }

    /* 点击遮罩关闭（点购物车面板外部区域） */
    document.addEventListener('click', function(e) {
      if (cartPanel.classList.contains('cart-panel--open') &&
          !cartPanel.contains(e.target) &&
          e.target !== cartFloatBtn &&
          !cartFloatBtn.contains(e.target)) {
        closeCartPanel();
      }
    });

    function closeCartPanel() {
      cartPanel.classList.remove('cart-panel--open');
      document.body.style.overflow = '';
    }

    /* 清空购物车 */
    if (cartClear) {
      cartClear.addEventListener('click', function() {
        if (CartManager.getCount() === 0) return;
        CartManager.clearCart();
        renderCart();
      });
    }

    /* 下单 */
    if (cartOrder) {
      cartOrder.addEventListener('click', function() {
        if (CartManager.getCount() === 0) return;
        alert('下单成功！\n订单金额：¥' + CartManager.getTotal() + '\n感谢您的购买，我们将尽快为您发货。');
        CartManager.clearCart();
        renderCart();
        closeCartPanel();
      });
    }

    /* 购物车列表事件委托（加减/删除） */
    var cartItemsEl = document.getElementById('cartItems');
    if (cartItemsEl) {
      cartItemsEl.addEventListener('click', function(e) {
        var qtyBtn = e.target.closest('[data-action]');
        if (!qtyBtn) return;

        e.stopPropagation();

        var id = qtyBtn.getAttribute('data-product-id');
        var action = qtyBtn.getAttribute('data-action');
        var cartItem = qtyBtn.closest('.cart-item');

        if (action === 'increase') {
          CartManager.updateQuantity(id, 1);
          /* 直接更新数量文字，不重建DOM —— 杜绝弹动 */
          var numEl = cartItem.querySelector('.cart-item__qty-num');
          if (numEl) {
            var cart = CartManager.getCart();
            numEl.textContent = cart[id] ? cart[id].quantity : '';
          }
          updateCartTotals();
        } else if (action === 'decrease') {
          var cart = CartManager.updateQuantity(id, -1);
          if (!cart[id]) {
            /* 数量归零，移除该项 */
            cartItem.style.transition = 'opacity .2s, transform .2s';
            cartItem.style.opacity = '0';
            cartItem.style.transform = 'translateX(30px)';
            setTimeout(function() {
              renderCart();
            }, 200);
          } else {
            /* 直接更新数量文字 */
            var numEl2 = cartItem.querySelector('.cart-item__qty-num');
            if (numEl2) numEl2.textContent = cart[id].quantity;
            updateCartTotals();
          }
        } else if (action === 'remove') {
          /* 删除动画后重建 */
          cartItem.style.transition = 'opacity .2s, transform .2s';
          cartItem.style.opacity = '0';
          cartItem.style.transform = 'translateX(30px)';
          CartManager.removeItem(id);
          setTimeout(function() {
            renderCart();
          }, 200);
        }
      });
    }

    /* 键盘ESC关闭 */
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && cartPanel.classList.contains('cart-panel--open')) {
        closeCartPanel();
      }
    });
  }

  /* ========== 渲染购物车（全量重建，用于增/删/清空/初始加载） ========== */
  function renderCart(){
    var cart = CartManager.getCart();
    var items = [];
    Object.keys(cart).forEach(function(key) {
      items.push(cart[key]);
    });

    var cartItemsEl = document.getElementById('cartItems');
    var cartTotalEl = document.getElementById('cartTotal');
    var cartFloatCount = document.getElementById('cartFloatCount');

    /* 悬浮按钮数量 */
    var count = CartManager.getCount();
    if (cartFloatCount) {
      cartFloatCount.textContent = count > 0 ? count : '';
    }

    /* 合计 */
    if (cartTotalEl) {
      cartTotalEl.textContent = '¥' + CartManager.getTotal();
    }

    /* 列表 */
    if (!cartItemsEl) return;

    if (items.length === 0) {
      cartItemsEl.innerHTML = '<div class="cart-panel__empty">购物车是空的<br>快去挑选心仪好物吧~</div>';
      return;
    }

    cartItemsEl.innerHTML = items.map(function(item, index) {
      /* 只有新增的项（最后一项）带滑入动画 */
      var animClass = (index === items.length - 1 && count > 0) ? ' cart-item--new' : '';
      return '<div class="cart-item' + animClass + '">' +
        '<div class="cart-item__info">' +
          '<div class="cart-item__name">' + escapeHTML(item.name) + '</div>' +
          '<div class="cart-item__price">¥' + item.price + '</div>' +
        '</div>' +
        '<div class="cart-item__qty">' +
          '<button class="cart-item__qty-btn" data-action="decrease" data-product-id="' + item.id + '" aria-label="减少">−</button>' +
          '<span class="cart-item__qty-num">' + item.quantity + '</span>' +
          '<button class="cart-item__qty-btn" data-action="increase" data-product-id="' + item.id + '" aria-label="增加">+</button>' +
        '</div>' +
        '<button class="cart-item__remove" data-action="remove" data-product-id="' + item.id + '" aria-label="删除">&times;</button>' +
      '</div>';
    }).join('');
  }

  /* ========== 仅更新合计和角标（数量加减时用，不重建DOM） ========== */
  function updateCartTotals(){
    var cartTotalEl = document.getElementById('cartTotal');
    var cartFloatCount = document.getElementById('cartFloatCount');
    var count = CartManager.getCount();

    if (cartFloatCount) {
      cartFloatCount.textContent = count > 0 ? count : '';
    }
    if (cartTotalEl) {
      cartTotalEl.textContent = '¥' + CartManager.getTotal();
    }

    /* 如果购物车清空了，重建显示空状态 */
    if (count === 0) {
      var cartItemsEl = document.getElementById('cartItems');
      if (cartItemsEl) {
        cartItemsEl.innerHTML = '<div class="cart-panel__empty">购物车是空的<br>快去挑选心仪好物吧~</div>';
      }
    }
  }

  /* ========== 简单 HTML 转义 ========== */
  function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

})();
