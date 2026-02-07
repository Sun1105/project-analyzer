document.addEventListener("DOMContentLoaded", () => {
  // 侧边栏折叠逻辑
  document.querySelectorAll(".tree-header").forEach(header => {
    header.addEventListener("click", () => {
      // 如果点击的是报告分析，不触发展开折叠，而是切换视图
      if (header.id === "btn-show-analysis") return;
      header.parentElement.classList.toggle("active");
    });
  });

  // 视图切换逻辑
  const reportList = document.getElementById("reportList");
  const analysisView = document.getElementById("analysisView");
  const btnShowAnalysis = document.getElementById("btn-show-analysis");
  const analysisPreviewContent = document.getElementById("analysis-preview-content");

  function showAnalysisView() {
    reportList.style.display = "none";
    analysisView.style.display = "block";
    // 高亮处理
    document.querySelectorAll(".tree-item").forEach(item => item.classList.remove("active-view"));
    document.getElementById("analysis-nav-item").classList.add("active-view");

    // 重置分析视图内的卡片显示状态
    if (analysisView) {
      analysisView.scrollTop = 0;
      const analysisCards = analysisView.querySelectorAll(".report-card");
      analysisCards.forEach(card => {
        card.style.display = "block";
        card.classList.remove("expanded");
      });
    }
  }

  function showReportListView() {
    reportList.style.display = "block";
    analysisView.style.display = "none";
    document.getElementById("analysis-nav-item").classList.remove("active-view");
  }

  // 绑定事件
  if (btnShowAnalysis) {
    btnShowAnalysis.addEventListener("click", (e) => {
      e.stopPropagation(); // 防止冒泡
      showAnalysisView();
    });
  }
  if (analysisPreviewContent) {
    analysisPreviewContent.addEventListener("click", (e) => {
      e.stopPropagation();
      showAnalysisView();
    });
  }

  // 点击其他筛选器时，切回列表视图
  document.querySelectorAll(".filter-option, .tag").forEach(el => {
    el.addEventListener("click", () => {
      showReportListView();
    });
  });

  // Back button logic
  const btnBackHome = document.getElementById("btn-back-home");

  document.querySelectorAll(".report-card").forEach(card => {
    card.addEventListener("click", (e) => {
      // 聚焦模式：隐藏其他卡片，只显示当前点击的卡片并展开
      document.body.classList.add("full-screen-mode");
      if (btnBackHome) btnBackHome.style.display = "flex";

      const allCards = document.querySelectorAll(".report-card");
      allCards.forEach(c => {
        if (c === card) {
          c.style.display = "block";
          c.classList.add("expanded");
        } else {
          c.style.display = "none";
        }
      });
      // 滚动到顶部
      document.querySelector('.report-list-area').scrollTop = 0;
    });
  });

  if (btnBackHome) {
    btnBackHome.addEventListener("click", () => {
      document.body.classList.remove("full-screen-mode");
      btnBackHome.style.display = "none";
      applyFilters();
    });
  }

  // 首页点击逻辑
  const brandHome = document.getElementById("brand-home");
  if (brandHome) {
    brandHome.addEventListener("click", () => {
      document.body.classList.remove("full-screen-mode");
      if (btnBackHome) btnBackHome.style.display = "none";

      // 1. 切换回列表视图
      showReportListView();
      
      // 2. 重置筛选状态
      state.year = 'all';
      state.type = 'all';
      state.tag = '';
      
      // 3. 重置 UI 状态
      // 清除所有选中状态
      document.querySelectorAll(".filter-option").forEach(opt => opt.classList.remove("selected"));
      document.querySelectorAll(".tag").forEach(tag => tag.classList.remove("active"));
      
      // 恢复默认选中项（"全部年份" 和 "全部类型"）
      document.querySelectorAll('.filter-option[data-year="all"]').forEach(opt => opt.classList.add("selected"));
      document.querySelectorAll('.filter-option[data-type="all"]').forEach(opt => opt.classList.add("selected"));

      // 4. 应用筛选（显示所有）并收起详情
      applyFilters();
      
      // 5. 额外确保所有卡片收起（applyFilters 中已经处理了，但为了保险起见）
      document.querySelectorAll(".report-card").forEach(c => {
        c.classList.remove("expanded");
      });
    });
  }

  const state = { year: 'all', type: 'all', tag: '' };
  function applyFilters() {
    const cards = document.querySelectorAll(".report-card");
    cards.forEach(card => {
      let visible = true;
      if (state.year !== "all") { if (card.dataset.year !== state.year) visible = false; }
      if (state.type !== "all") { if (card.dataset.type !== state.type) visible = false; }
      if (state.tag) { const tags = (card.dataset.tags || '').toLowerCase(); if (!tags.includes(state.tag)) visible = false; }
      
      // 显示符合条件的卡片，但移除展开状态，确保列表视图整洁
      if (visible) {
          card.style.display = "";
          card.classList.remove("expanded");
      } else {
          card.style.display = "none";
      }
    });
    // 滚动到顶部，防止过滤后位置尴尬
    const listArea = document.querySelector('.report-list-area');
    if (listArea) listArea.scrollTop = 0;
  }

  document.querySelectorAll(".filter-option").forEach(opt => {
    opt.addEventListener("click", function() {
      const parentBody = this.parentElement;
      parentBody.querySelectorAll(".filter-option").forEach(o => o.classList.remove("selected"));
      this.classList.add("selected");
      if (this.dataset.year) state.year = this.dataset.year;
      if (this.dataset.type) state.type = this.dataset.type;
      applyFilters();
    });
  });

  document.querySelectorAll(".tag").forEach(tag => {
    tag.addEventListener("click", function() {
      const isActive = this.classList.contains("active");
      document.querySelectorAll(".tag").forEach(t => t.classList.remove("active"));
      if (!isActive) {
        this.classList.add("active");
        state.tag = this.dataset.tag.toLowerCase();
      } else {
        state.tag = "";
      }
      applyFilters();
    });
  });

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.documentElement.classList.toggle("light-theme");
      if (document.documentElement.classList.contains("light-theme")) {
        themeToggle.innerText = "🌙 切换主题";
      } else {
        themeToggle.innerText = "☀️ 切换主题";
      }
    });
  }
});
