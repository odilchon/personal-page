(async () => {
  const { lang } = document.documentElement;
  const { page, base } = document.body.dataset;
  const response = await fetch(base + 'content/' + lang + '.json?v=12');
  if (!response.ok) throw new Error('Content unavailable');
  const d = await response.json();
  const { corporate, education, 'mobile-clinics': mobileClinics } = d.programs;
  const programPages = [['partners', d.partners], ['education', education]];
  const navItems = [
    ['index', d.nav[0]], ['about', d.aboutLabel], ['services', d.nav[2]],
    ['partners', d.partners.name], ['education', education.name, education.shortName], ['contact', d.nav[4]]
  ];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]
  );
  const url = (target, language = lang) => {
    const [route, anchor] = target.split('#');
    return base + (language === 'ru' ? '' : language + '/') + route + '.html' + (anchor ? '#' + anchor : '');
  };
  const current = target => target === page ? 'aria-current="page"' : '';
  const arrow = '<span aria-hidden="true">↗</span>';
  const button = (label, action, style = 'primary') =>
    `<button type="button" class="button ${style}" data-action="${action}">${esc(label)} ${arrow}</button>`;
  const book = (label = d.book) => button(label, 'book');
  const link = (label, target, style = 'text-link') =>
    `<a class="${style}" href="${url(target)}">${esc(label)} ${arrow}</a>`;
  const logo = `<img src="${base}assets/mercymed-logo.png" alt="MercyMed" width="576" height="192">`;
  const navLink = (target, label) =>
    `<a ${current(target)} href="${url(target)}">${esc(label)}</a>`;
  const mainLinks = navItems.map(([target, label]) => navLink(target, label)).join('');
  const languages = ['ru', 'ky', 'en'].map(language => `
    <a lang="${language}" hreflang="${language}" ${language === lang ? 'aria-current="true"' : ''}
      href="${url(page, language)}">${language === 'ky' ? 'KG' : language.toUpperCase()}</a>`).join('');

  document.querySelector('#site-header').innerHTML = `
    <div class="header-inner">
      <a class="logo" href="${url('index')}" aria-label="MercyMed · ${esc(d.nav[0])}">${logo}</a>
      <nav class="desktop-nav" aria-label="${esc(d.menu)}">
        ${navItems.map(([target, label, shortLabel]) => navLink(target, shortLabel ?? label)).join('')}
      </nav>
      <nav class="languages" aria-label="${esc(d.languagesLabel)}">${languages}</nav>
      <div class="header-book">${book(d.headerBookLabel)}</div>
      <button type="button" class="menu-button" aria-expanded="false" aria-controls="mobile-nav">${esc(d.menu)} <span aria-hidden="true">☰</span></button>
    </div>
    <nav id="mobile-nav" hidden aria-label="${esc(d.menu)}">
      ${mainLinks}
    </nav>`;
  document.body.insertAdjacentHTML('beforeend', `
    <div class="mobile-actions">${book()}${button(d.call, 'call', 'secondary')}</div>`);

  const intro = (title, copy) => `
    <section class="page-intro">
      <p class="eyebrow">${esc(d.eyebrow)}</p>
      <h1>${esc(title)}</h1>
      <p class="lead">${esc(copy)}</p>
    </section>`;
  const cards = items => `
    <div class="cards">${items.map(([title, copy, status]) => `
      <article class="card">
        <h3>${esc(title)}</h3><p>${esc(copy)}</p>
        ${status ? `<span class="pending">${esc(status)}</span>` : ''}
      </article>`).join('')}</div>`;
  const cta = () => `
    <section class="cta">
      <div><h2>${esc(d.ctaTitle)}</h2><p>${esc(d.ctaText)}</p></div>${book()}
    </section>`;
  const programGrid = () => `
    <section class="section programs">
      <h2>${esc(d.programsTitle)}</h2>
      <div class="cards">${programPages.map(([target, item]) => `
        <article class="card program-card">
          <h3><a href="${url(target)}">${esc(item.name)} ${arrow}</a></h3>
          <p>${esc(item.summary)}</p>
        </article>`).join('')}</div>
    </section>`;
  const languagesInfo = () => `
    <aside class="language-block"><h2>${esc(d.languageTitle)}</h2><p>${esc(d.languages)}</p></aside>`;
  const partnerSection = (id, item) => `
    <section class="partner-section section" id="${id}">
      <h2>${esc(item.name)}</h2>
      <p class="lead">${esc(item.intro)}</p>
      <div class="cards">${item.topics.map(([title, copy]) => `
        <article class="card"><h3>${esc(title)}</h3><p>${esc(copy)}</p></article>`).join('')}</div>
    </section>`;
  const partnershipContact = title => `
    <section class="feature program-contact">
      <div><h2>${esc(title)}</h2><p>${esc(d.partnershipNotice)}</p></div>
      ${link(d.nav[4], 'contact', 'button primary')}
    </section>`;
  const teamSection = () => `
    <section id="team" class="section team-section">
      <h2>${esc(d.nav[3])}</h2><p class="lead">${esc(d.teamIntro)}</p>
      ${d.team.some(person => !person.photo || !person.bio) ? `<p class="team-note pending">${esc(d.teamStatus)}</p>` : ''}
      <div class="team-grid">${d.team.map(person => `
        <article class="staff-card">
          ${person.photo ? `<img class="staff-photo" loading="lazy" src="${base + esc(person.photo)}" alt="${esc(person.name + ' · ' + person.role)}">` : ''}
          <div class="staff-copy">
            <h3>${esc(person.name)}</h3><p>${esc(person.role)}</p>${person.bio ? `<p>${esc(person.bio)}</p>` : ''}
          </div>
        </article>`).join('')}</div>
    </section>`;

  let body;
  if (page === 'index') {
    body = `
      <section class="hero">
        <div>
          <p class="eyebrow">${esc(d.eyebrow)}</p>
          <h1>${esc(d.hero[0])} <span>${esc(d.hero[1])}</span></h1>
          <p class="lead">${esc(d.intro)}</p>
          <div class="actions">
            ${book()}${link(d.explore, 'services', 'button secondary')}${button(d.call, 'call', 'plain')}
          </div>
          <p class="hero-address"><span aria-hidden="true" class="dot"></span>${esc(d.location)}</p>
          <p class="micro">${esc(d.draft)}</p>
        </div>
        <aside class="visit-card">
          <h2>${esc(d.visitTitle)}</h2>
          <p>${esc(d.visitText)}</p>
          <a class="text-link" href="#before-your-visit">${esc(d.visitLink)} <span aria-hidden="true">↓</span></a>
        </aside>
      </section>
      <section class="principles" aria-label="${esc(d.aboutTitle)}">
        ${d.principles.map(([, title, copy]) => `
          <article><h2>${esc(title)}</h2><p>${esc(copy)}</p></article>`).join('')}
      </section>
      ${programGrid()}
      <section class="section service-preview">
        <div class="section-heading"><h2>${esc(d.servicesTitle)}</h2>${link(d.allServices, 'services')}</div>
        <p class="section-desc">${esc(d.servicesIntro)}</p>${cards(d.services.slice(0, 4))}
      </section>
      ${languagesInfo()}
      <section id="before-your-visit" class="section faq">
        <h2>${esc(d.faqTitle)}</h2>
        ${d.faq.map(([question, answer]) => `
          <details><summary>${esc(question)}<span aria-hidden="true">+</span></summary><p>${esc(answer)}</p></details>`).join('')}
      </section>
      ${cta()}`;
  } else if (page === 'about') {
    body = `
      ${intro(d.aboutTitle, d.aboutIntro)}
      <section class="about-care">
        <h2>${esc(d.principles[1][1])}</h2><p>${esc(d.aboutText)}</p>${link(d.teamLink, 'about#team')}
      </section>
      <div class="timeline">${d.history.map(([title, copy]) => `
        <article><h2>${esc(title)}</h2><p>${esc(copy)}</p></article>`).join('')}</div>
      ${programGrid()}${teamSection()}${cta()}`;
  } else if (page === 'services') {
    body = `
      ${intro(d.servicesTitle, d.servicesIntro)}${cards(d.services)}${languagesInfo()}
      <section class="section"><h2>${esc(d.additionalTitle)}</h2>${cards(d.additional)}</section>
      <section class="feature" id="organisations">
        <div><h2>${esc(corporate.name)}</h2><p>${esc(corporate.summary)}</p></div>
        ${link(d.learnMore, 'partners#corporate', 'button secondary')}
      </section>
      ${cta()}`;
  } else if (page === 'partners') {
    body = `
      ${intro(d.partners.name, d.partners.summary)}
      ${partnerSection('corporate', corporate)}
      ${partnerSection('mobile-clinics', mobileClinics)}
      ${partnershipContact(corporate.action)}`;
  } else if (page === 'contact') {
    body = `
      ${intro(d.contactTitle, d.contactIntro)}
      <div class="contact-grid">
        <div>
          <section><h2>${esc(d.contactsTitle)}</h2><p>${esc(d.contacts)}</p>
            <div class="actions">${book()}${button(d.call, 'call', 'secondary')}</div></section>
          <section><h2>${esc(d.hoursTitle)}</h2><p>${esc(d.hours)}</p></section>
          <section><h2>${esc(d.socialTitle)}</h2><p>${esc(d.socialText)}</p>
            <div class="socials">${['Instagram', '2GIS', 'O-Doctor'].map(profile =>
              `<button type="button" class="text-link" data-action="social" data-profile="${profile}">${profile} ${arrow}</button>`).join('')}</div>
          </section>
        </div>
        <section class="address-card">
          <h2>${esc(d.locationTitle)}</h2><p>${esc(d.location)}</p><p class="micro">${esc(d.address)}</p>
        </section>
      </div>`;
  } else if (page === 'education') {
    body = `
      ${intro(education.name, education.intro)}
      <div class="program-topics">${education.topics.map(([title, copy]) => `
        <section><h2>${esc(title)}</h2><p>${esc(copy)}</p></section>`).join('')}</div>
      ${partnershipContact(education.action)}`;
  }

  document.querySelector('#content').innerHTML =
    (d.review ? `<p class="translation-note">${esc(d.review)}</p>` : '') +
    (d.promotion ? `<aside class="promotion">${esc(d.promotion)}</aside>` : '') + body;
  document.querySelector('#site-footer').innerHTML = `
    <div class="footer-grid">
      <div class="footer-brand">${logo}<p>${esc(d.footer)}</p></div>
      <nav aria-label="${esc(d.footerNav)}">
        <div>${navItems.slice(0, 3).map(([target, label]) => navLink(target, label)).join('')}</div>
        <div>${navItems.slice(3).map(([target, label]) => navLink(target, label)).join('')}</div>
      </nav>
      <div><p>${esc(d.location)}</p><p>${esc(d.hoursTitle)} · ${esc(d.hours)}</p>
        <button type="button" class="text-link" data-action="call">${esc(d.call)} ${arrow}</button></div>
    </div>
    <div class="footer-bottom"><span>© 2026 MercyMed · COM360</span><p>${esc(d.privacy)}</p></div>`;

  const dialog = document.querySelector('dialog');
  dialog.innerHTML = `
    <button type="button" class="dialog-x" aria-label="${esc(d.close)}">×</button>
    <h2 id="dialog-title">${esc(d.dialogTitle)}</h2><p id="dialog-desc"></p>
    <div id="message"><p>${esc(d.messageLabel)}</p><pre>${esc(d.message)}</pre></div>
    <button type="button" class="button primary dialog-close">${esc(d.close)}</button>`;
  const menu = document.querySelector('.menu-button');
  const mobileNav = document.querySelector('#mobile-nav');

  function setMenuOpen(open) {
    mobileNav.hidden = !open;
    menu.setAttribute('aria-expanded', String(open));
  }
  menu.addEventListener('click', () => setMenuOpen(mobileNav.hidden));
  document.addEventListener('click', event => {
    if (!mobileNav.contains(event.target) && !menu.contains(event.target)) setMenuOpen(false);
    const control = event.target.closest('[data-action]');
    if (!control) return;
    const action = control.dataset.action;
    dialog.querySelector('#dialog-desc').textContent =
      action === 'social' ? control.dataset.profile + ' · ' + d.pending : d.dialogText;
    dialog.querySelector('#message').hidden = action !== 'book';
    dialog.showModal();
  });
  dialog.querySelectorAll('.dialog-close,.dialog-x').forEach(control =>
    control.addEventListener('click', () => dialog.close())
  );
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right ||
        event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || dialog.open) return;
    if (!mobileNav.hidden && menu.getClientRects().length) {
      setMenuOpen(false);
      menu.focus();
    }
  });
  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
})().catch(error => {
  console.error(error);
});
