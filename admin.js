(() => {
  const profile = document.querySelector('.profile-wrap');
  const profileButton = document.querySelector('.profile-trigger');
  const profileMenu = document.querySelector('#profile-menu');
  const storeButton = document.querySelector('.dropdown-trigger');
  const storeMenu = document.querySelector('#store-menu');
  const actionPanel = document.querySelector('#action-panel');
  const sidebar = document.querySelector('#admin-sidebar');
  const mobileButton = document.querySelector('.mobile-menu');
  const scrim = document.querySelector('.sidebar-scrim');
  const dialog = document.querySelector('#logout-dialog');
  let toastTimer;

  function toast(message) {
    const node = document.querySelector('.toast-message');
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('show'), 2300);
  }
  function closeMenus({restoreFocus = false} = {}) {
    profileMenu.hidden = true;
    profileButton.setAttribute('aria-expanded', 'false');
    storeMenu.hidden = true;
    storeButton.setAttribute('aria-expanded', 'false');
    actionPanel.hidden = true;
    document.querySelectorAll('[data-panel]').forEach(button => button.setAttribute('aria-expanded', 'false'));
    if (restoreFocus) profileButton.focus();
  }
  function setPage(label) {
    document.querySelector('#current-page').textContent = label;
    document.querySelector('#page-title').textContent = label === 'Home' ? 'Welcome back, Amara' : label;
    document.querySelector('#page-subtitle').textContent = label === 'Home'
      ? 'Here’s what’s happening with your store today.'
      : `Manage ${label.toLowerCase()} for your Luxeora store.`;
    document.querySelectorAll('[data-page]').forEach(link => {
      const active = link.dataset.page === label && (link.classList.contains('side-link') || link.classList.contains('top-link'));
      if (link.classList.contains('side-link') || link.classList.contains('top-link')) {
        link.classList.toggle('is-active', active);
        link.classList.toggle('active', active);
        if (link.classList.contains('side-link')) {
          if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
        }
      }
    });
    closeMenus();
    sidebar.classList.remove('drawer-open');
    mobileButton.setAttribute('aria-expanded', 'false');
    scrim.setAttribute('tabindex', '-1');
  }
  function openPanel(name, button) {
    closeMenus();
    let content = '';
    if (name === 'search') {
      content = '<h2 class="panel-title">Search your store</h2><label class="sr-only" for="admin-search">Search your store</label><input class="panel-search" id="admin-search" type="search" placeholder="Orders, products, customers…" autocomplete="off"><p class="panel-copy search-result" aria-live="polite" style="margin-top:9px">Start typing to search your store.</p>';
    } else if (name === 'messages') {
      content = '<h2 class="panel-title">Messages</h2><div class="panel-item"><b>Repair enquiry</b><span>Could you alter a linen dress? · 2 hours ago</span></div><div class="panel-item"><b>Product question</b><span>Is the Golden Hour Face Oil in stock? · Yesterday</span></div><p class="panel-copy">These are sample inbox messages.</p>';
      document.querySelector('[data-panel="messages"]').classList.remove('has-dot');
      document.querySelector('[data-panel="messages"]').setAttribute('aria-label', 'Messages');
    } else if (name === 'calendar') {
      content = '<h2 class="panel-title">Store calendar</h2><p class="calendar-date">November 23</p><p class="panel-copy">No appointments scheduled for today.</p><div class="panel-item"><b>Upcoming</b><span>Inventory review · November 25</span></div>';
    } else {
      content = '<h2 class="panel-title">Notifications</h2><div class="panel-item"><b>Inventory running low</b><span>Cloud Nine Cleanser · 3 units left</span></div><div class="panel-item"><b>New order received</b><span>Order #LX-1048 · Today</span></div><p class="panel-copy">You’re all caught up.</p>';
      document.querySelector('[data-panel="notifications"]').classList.remove('has-dot');
      document.querySelector('[data-panel="notifications"]').setAttribute('aria-label', 'Notifications');
    }
    actionPanel.innerHTML = content;
    actionPanel.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    if (name === 'search') {
      const input = actionPanel.querySelector('input');
      input.focus();
      input.addEventListener('input', () => {
        actionPanel.querySelector('.search-result').textContent = input.value.trim()
          ? `Search is ready for “${input.value.trim()}”. Connect your store catalog to search live records.`
          : 'Start typing to search your store.';
      });
    }
  }

  profileButton.addEventListener('click', () => {
    const open = profileMenu.hidden;
    closeMenus();
    profileMenu.hidden = !open;
    profileButton.setAttribute('aria-expanded', String(open));
  });
  storeButton.addEventListener('click', () => {
    const open = storeMenu.hidden;
    closeMenus();
    storeMenu.hidden = !open;
    storeButton.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('[data-panel]').forEach(button => button.addEventListener('click', () => {
    const name = button.dataset.panel;
    const wasOpen = !actionPanel.hidden && button.getAttribute('aria-expanded') === 'true';
    if (wasOpen) closeMenus(); else openPanel(name, button);
  }));
  document.querySelectorAll('.side-link,.top-link[data-page],.top-dropdown [data-page],.account-links [data-page],.profile-summary [data-page]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      setPage(link.dataset.page);
      if (link.classList.contains('account-links') || link.closest('.account-links')) toast(`${link.dataset.page} selected`);
    });
  });
  document.querySelector('.upgrade-link').addEventListener('click', event => {
    event.preventDefault();
    toast('Plan options will be available when store billing is connected.');
  });
  document.querySelector('.logout-button').addEventListener('click', () => {
    closeMenus();
    dialog.showModal();
    dialog.querySelector('.cancel-logout').focus();
  });
  dialog.querySelector('.cancel-logout').addEventListener('click', () => dialog.close());
  dialog.querySelector('.confirm-logout').addEventListener('click', () => {
    dialog.close();
    toast('Authentication is not connected; no session was ended.');
  });
  mobileButton.addEventListener('click', () => {
    const open = !sidebar.classList.contains('drawer-open');
    sidebar.classList.toggle('drawer-open', open);
    mobileButton.setAttribute('aria-expanded', String(open));
    scrim.setAttribute('tabindex', open ? '0' : '-1');
    if (open) sidebar.querySelector('.side-link').focus();
  });
  scrim.addEventListener('click', () => {
    sidebar.classList.remove('drawer-open');
    mobileButton.setAttribute('aria-expanded', 'false');
    mobileButton.focus();
  });
  document.addEventListener('click', event => {
    if (!profile.contains(event.target) && !event.target.closest('.top-dropdown-wrap') && !event.target.closest('.action-panel') && !event.target.closest('[data-panel]')) closeMenus();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const menuWasOpen = !profileMenu.hidden || !storeMenu.hidden || !actionPanel.hidden;
    closeMenus();
    if (menuWasOpen) profileButton.focus();
    if (sidebar.classList.contains('drawer-open')) {
      sidebar.classList.remove('drawer-open');
      mobileButton.setAttribute('aria-expanded', 'false');
      mobileButton.focus();
    }
  });
})();
