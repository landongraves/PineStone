(() => {
  // Elements
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navItems = Array.from(document.querySelectorAll('.nav-item'));
  const yearEl = document.getElementById('year');
  const subscribeForm = document.getElementById('subscribe-form');
  const emailInput = document.getElementById('email');
  const msgEl = document.getElementById('subscribe-msg');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile toggle
  function openMenu(){
    navToggle?.setAttribute('aria-expanded','true');
    navMenu?.classList.add('show');
    document.body.style.overflow='hidden';
  }
  function closeMenu(){
    navToggle?.setAttribute('aria-expanded','false');
    navMenu?.classList.remove('show');
    document.body.style.overflow='';
  }
  navToggle?.addEventListener('click', ()=>{
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (expanded) closeMenu(); else openMenu();
  });

  // Dropdown handling
  navItems.forEach(item=>{
    const btn = item.querySelector('.nav-link');
    if (!btn) return;
    btn.addEventListener('click', (e)=>{
      // if has dropdown, toggle
      if (item.classList.contains('has-dropdown')){
        const open = item.classList.contains('open');
        // close others
        navItems.forEach(i=>i.classList.remove('open'));
        if (!open) item.classList.add('open');
        else item.classList.remove('open');
      }
    });
  });

  // close dropdowns on outside click
  document.addEventListener('click', (e)=>{
    if (!e.target.closest('.nav-inner')){
      navItems.forEach(i=>i.classList.remove('open'));
    }
  });

  // smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        closeMenu();
      }
    });
  });

  // Developer apply buttons
  document.querySelectorAll('.apply').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const email = prompt('Enter your email to apply:');
      if (!email) return alert('Application cancelled');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert('Please enter a valid email');
      // store application locally
      const apps = JSON.parse(localStorage.getItem('deepforest_apps')||'[]');
      apps.push({email:email, date:new Date().toISOString()});
      localStorage.setItem('deepforest_apps', JSON.stringify(apps));
      alert('Thanks — your application has been received.');
    });
  });

  // Subscribe form handling
  subscribeForm?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = (emailInput?.value||'').trim();
    if (!validateEmail(email)){
      showMsg('Please provide a valid email.', false);
      emailInput.focus();
      return;
    }
    const subs = JSON.parse(localStorage.getItem('deepforest_subs')||'[]');
    if (subs.includes(email)){
      showMsg('You are already subscribed.', true);
      return;
    }
    subs.push(email);
    localStorage.setItem('deepforest_subs', JSON.stringify(subs));
    showMsg('Thanks — check your inbox for a welcome email.', true);
    subscribeForm.reset();
  });

  function showMsg(text, success){
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.style.color = success ? 'var(--success)' : 'var(--accent-2)';
    setTimeout(()=>{ msgEl.textContent = ''; }, 5000);
  }
  function validateEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Small accessibility: press Escape to close menus
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape'){
      closeMenu();
      navItems.forEach(i=>i.classList.remove('open'));
    }
  });

  // enhance code visual: add colored spans and line numbers
  (function enhanceCode(){
    const codeEl = document.querySelector('.code-visual pre code');
    const lnWrap = document.createElement('div');
    lnWrap.className = 'line-numbers';
    if (!codeEl) return;
    const text = codeEl.textContent || '';
    const lines = text.split('\n');
    // improved simple Python highlighter
    // wrap each line into a block for consistent height
    const wrapped = lines.map(line=>{
      let s = line
        .replace(/(#[^\n]*)/g, '<span class="comment">$1</span>')
        .replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"]*"|'[^']*')/g, '<span class="str">$1</span>')
        .replace(/\b(def|for|in|print|return|if|else|import|from|class|with|as|try|except|while|break|continue)\b/g, '<span class="kw">$1</span>')
        .replace(/\b(\d+[\.\d]*)\b/g, '<span class="num">$1</span>');
      return `<span class="code-line">${s || '&nbsp;'}</span>`;
    }).join('');

    codeEl.innerHTML = wrapped;
    // line numbers (left side) aligned with code lines
    lines.forEach((_,i)=>{
      const el = document.createElement('div'); el.textContent = i+1; lnWrap.appendChild(el);
    });
    const visual = document.querySelector('.code-visual');
    visual?.appendChild(lnWrap);
  })();

  // search focus shortcut: press / to focus search
  document.addEventListener('keydown', (e)=>{
    const tag = (document.activeElement||{}).tagName;
    if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA'){
      const s = document.getElementById('nav-search');
      if (s){ e.preventDefault(); s.focus(); }
    }
  });

})();
