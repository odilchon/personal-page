(async () => {
  const { lang } = document.documentElement;
  const { page, base } = document.body.dataset;
  const response = await fetch(base + 'content/' + lang + '.json?v=14');
  if (!response.ok) throw new Error('Content unavailable');
  const d = await response.json();
  const { corporate, education, 'mobile-clinics': mobileClinics } = d.programs;
  const clinicPhone = '+996 770 231 813';
  const whatsappUrl = 'https://wa.me/' + clinicPhone.replace(/\D/g, '');
  const bookingUrl = whatsappUrl + '?text=' + encodeURIComponent(d.booking.message);
  const mapUrl = 'https://yandex.com/maps/org/mercy_med/215676724008/';
  const consultationLanguages = [
    ['ky', 'Кыргызча'], ['ru', 'Русский'], ['en', 'English'],
    ['zh', '中文'], ['de', 'Deutsch'], ['fr', 'Français']
  ];
  const programPages = [['partners', d.partners], ['education', education]];
  const navItems = [
    ['index', d.nav[0]], ['about', d.aboutLabel], ['services', d.nav[2]],
    ['team', d.nav[3]], ['contact', d.nav[4]]
  ];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]
  );
  const url = (target, language = lang) => {
    const [route, anchor] = target.split('#');
    return base + (language === 'ru' ? '' : language + '/') + route + '.html' + (anchor ? '#' + anchor : '');
  };
  const legacySections = {
    partners: ['partners', 'corporate', 'mobile-clinics'],
    education: ['education']
  };
  if (Object.hasOwn(legacySections, page)) {
    const anchor = location.hash.slice(1);
    const sections = legacySections[page];
    location.replace(url('about#' + (sections.includes(anchor) ? anchor : sections[0])));
    return;
  }
  if (page === 'about') {
    const openLegacyTeam = () => {
      if (location.hash === '#team') location.replace(url('team'));
    };
    if (location.hash === '#team') {
      openLegacyTeam();
      return;
    }
    window.addEventListener('hashchange', openLegacyTeam);
  }
  const current = target => target === page ? 'aria-current="page"' : '';
  const arrow = '<span aria-hidden="true">↗</span>';
  const lineIcon = paths => `<svg class="line-icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${paths}</svg>`;
  const globe = lineIcon('<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>');
  const check = lineIcon('<path d="m6 12 4 4 8-8"/>');
  const whatsappIcon = `<svg class="brand-icon whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M12.04 0A11.9 11.9 0 0 0 1.72 17.85L.02 24l6.3-1.65a11.95 11.95 0 0 0 5.71 1.45h.01A11.9 11.9 0 0 0 12.04 0Zm0 21.8a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.64-.24-.37a9.88 9.88 0 1 1 8.38 4.62Zm5.42-7.4c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.16c-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.7.3 1.26.49 1.7.63.71.23 1.36.2 1.88.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z"/>
  </svg>`;
  const instagramIcon = `<svg class="brand-icon instagram-icon" viewBox="0 0 24 24" aria-hidden="true"
    fill="none" stroke="currentColor" stroke-width="1.8">
    <rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.7" r="1" fill="currentColor" stroke="none"/>
  </svg>`;
  const profiles = [
    ['WhatsApp', whatsappUrl, whatsappIcon],
    ['Instagram', 'https://www.instagram.com/mercymed.kg/', instagramIcon],
    ['O-Doctor', 'https://odoctor.kg/clinics/bishkek/mercymed',
      `<img class="brand-icon" src="${base}assets/odoctor.png" width="20" height="20" alt="">`]
  ];
  const button = (label, action, style = 'primary') =>
    `<button type="button" class="button ${style}" data-action="${action}">${esc(label)} ${arrow}</button>`;
  const book = (label = d.book, icon = arrow) =>
    `<button type="button" class="button primary booking-button" data-action="book" aria-haspopup="dialog">${esc(label)} ${icon}</button>`;
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
        ${mainLinks}
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
          <h3><a href="${url('about#' + target)}">${esc(item.name)} ${arrow}</a></h3>
          <p>${esc(item.summary)}</p>
        </article>`).join('')}</div>
    </section>`;
  const languagesInfo = () => `
    <section class="language-block">
      <div class="language-intro"><span class="icon-tile">${globe}</span>
        <div><h2>${esc(d.languageTitle)}</h2><p>${esc(d.languages)}</p></div>
      </div>
      <ul class="consultation-languages" role="list">${consultationLanguages.map(([language, name]) =>
        `<li lang="${language}">${name}</li>`).join('')}</ul>
    </section>`;
  const topicList = (topics, heading = 'h4') => `
    <ul class="program-topics" role="list">${topics.map(([title, copy]) => `
      <li><${heading}>${esc(title)}</${heading}><p>${esc(copy)}</p></li>`).join('')}</ul>`;
  const partnerSection = (id, item) => `
    <section class="partner-section" id="${id}">
      <h4>${esc(item.name)}</h4>
      <p>${esc(item.intro)}</p>
      ${topicList(item.topics, 'h5')}
    </section>`;
  const programContact = (label, copy) => `
    <div class="program-contact"><p>${esc(copy)}</p>${link(label, 'contact', 'button secondary')}</div>`;
  const teamSection = () => `
    <section class="team-section" aria-label="${esc(d.nav[3])}">
      <div class="team-grid">${d.team.map(person => `
        <article class="staff-card">
          <img class="staff-photo" loading="lazy" width="400" height="400"
            src="${base + esc(person.photo)}" alt="${esc(person.photoAlt ?? person.name)}">
          <div class="staff-copy">
            <h2>${esc(person.name)}</h2><p>${esc(person.role)}</p>${person.bio ? `<p>${esc(person.bio)}</p>` : ''}
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
          ${link(d.contactDetails.directions, 'contact', 'text-link hero-directions')}
        </div>
        <aside class="visit-card">
          <img src="${base}assets/photos/first-visit.jpg" width="617" height="600" alt="" fetchpriority="high">
          <div class="visit-copy">
            <h2>${esc(d.visitTitle)}</h2>
            <p>${esc(d.visitText)}</p>
            <a class="text-link" href="#before-your-visit">${esc(d.visitLink)} <span aria-hidden="true">↓</span></a>
          </div>
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
    const chiefDoctor = d.team.find(person => person.photo.endsWith('/jonathan-williams.jpg'));
    body = `
      <section class="about-hero">
        <div>
          <p class="eyebrow">${esc(d.eyebrow)}</p>
          <h1>${esc(d.aboutTitle)}</h1>
          <p class="lead">${esc(d.aboutIntro)}</p><p>${esc(d.aboutContext)}</p>
          <div class="actions">${link(d.teamLink, 'team', 'button secondary')}</div>
        </div>
        <figure class="about-photo">
          <img src="${base + esc(chiefDoctor.photo)}" alt="" width="414" height="438" fetchpriority="high">
          <figcaption><strong>${esc(chiefDoctor.name)}</strong><span>${esc(chiefDoctor.role)}</span></figcaption>
        </figure>
      </section>
      <section class="about-care">
        <div><h2>${esc(d.principles[1][1])}</h2><p>${esc(d.aboutText)}</p></div>
        <ul class="care-points" role="list">${d.carePoints.map(([title, copy]) => `
          <li><span class="icon-tile">${check}</span><div><h3>${esc(title)}</h3><p>${esc(copy)}</p></div></li>`).join('')}</ul>
      </section>
      <div class="timeline">${d.history.map(([title, copy]) => `
        <article><h2>${esc(title)}</h2><p>${esc(copy)}</p></article>`).join('')}</div>
      <section class="section about-programs">
        <h2>${esc(d.programsTitle)}</h2>
        <section class="program-detail" id="partners">
          <h3>${esc(d.partners.name)}</h3>
          <div class="partner-grid">
            ${partnerSection('corporate', corporate)}
            ${partnerSection('mobile-clinics', mobileClinics)}
          </div>
          ${programContact(corporate.action, d.partnershipNotice)}
        </section>
        <section class="program-detail" id="education">
          <h3>${esc(education.name)}</h3>
          <p class="lead">${esc(education.audience)}</p>
          ${topicList(education.topics)}
          ${programContact(education.action, education.inquiry)}
        </section>
      </section>
      ${cta()}`;
  } else if (page === 'team') {
    body = `${intro(d.nav[3], d.teamIntro)}${teamSection()}${cta()}`;
  } else if (page === 'services') {
    body = `
      ${intro(d.servicesTitle, d.servicesIntro)}${cards(d.services)}${languagesInfo()}
      <section class="section"><h2>${esc(d.additionalTitle)}</h2>${cards(d.additional)}</section>
      <section class="feature" id="organisations">
        <div><h2>${esc(corporate.name)}</h2><p>${esc(corporate.summary)}</p></div>
        ${link(d.learnMore, 'about#corporate', 'button secondary')}
      </section>
      ${cta()}`;
  } else if (page === 'contact') {
    const c = d.contactDetails;
    body = `
      ${intro(d.contactTitle, d.contactIntro)}
      <div class="contact-grid">
        <div>
          <dl class="contact-facts">
            <div><dt>${esc(c.addressLabel)}</dt><dd>${esc(c.street)}<br><span class="micro">${esc(c.addressNote)}</span></dd></div>
            <div><dt>${esc(c.phoneLabel)}</dt><dd>
              <div class="phone-line"><strong>${clinicPhone}</strong>
                <button type="button" class="button secondary copy-phone" data-action="copy-phone">${esc(c.copy)}</button>
              </div>
              <span class="micro" id="copy-status" role="status"></span>
            </dd></div>
            <div><dt>${esc(d.hoursTitle)}</dt><dd>${esc(d.hours)}</dd></div>
          </dl>
          <section class="contact-booking">
            <h2>${esc(c.bookingTitle)}</h2><p>${esc(c.bookingNote)}</p>
            <div class="actions">${book(d.booking.title, whatsappIcon)}${button(d.call, 'call', 'secondary')}</div>
          </section>
        </div>
        <div>
          <a class="map-card" href="${mapUrl}">
            <span class="map-pin" aria-hidden="true"></span>
            <strong>${esc(c.mapLink)} ${arrow}</strong>
            <span>${esc(c.street)}</span>
          </a>
          <section class="contact-profiles">
            <h2>${esc(d.socialTitle)}</h2>
            <div class="socials">${profiles.map(([label, href, icon]) =>
              `<a class="button secondary" href="${href}">${icon} ${label}</a>`).join('')}</div>
          </section>
        </div>
      </div>`;
  }

  document.querySelector('#content').innerHTML =
    (d.promotion ? `<aside class="promotion">${esc(d.promotion)}</aside>` : '') + body;
  document.querySelector('#site-footer').innerHTML = `
    <div class="footer-grid">
      <div class="footer-brand">${logo}<p>${esc(d.footer)}</p></div>
      <nav aria-label="${esc(d.footerNav)}">
        <div>${navItems.slice(0, 3).map(([target, label]) => navLink(target, label)).join('')}</div>
        <div>${navItems.slice(3).map(([target, label]) => navLink(target, label)).join('')}</div>
      </nav>
      <div><p>${esc(d.contactDetails.street)}</p><p>${esc(d.hoursTitle)} · ${esc(d.hours)}</p>
        <button type="button" class="text-link" data-action="call">${esc(d.call)} ${arrow}</button></div>
    </div>
    <div class="footer-bottom"><span>© 2026 MercyMed · COM360</span><p>${esc(d.privacy)}</p></div>`;

  const dialog = document.querySelector('dialog');
  const { booking } = d;
  dialog.innerHTML = `
    <button type="button" class="dialog-x" aria-label="${esc(d.close)}">×</button>
    <h2 id="dialog-title"></h2><p id="dialog-desc"></p>
    <div id="message"><strong>${esc(booking.previewLabel)}</strong><p>${esc(booking.message)}</p></div>
    <div class="dialog-actions">
      <button type="button" class="button secondary dialog-close" autofocus>${esc(d.close)}</button>
      <a class="button primary booking-button" href="${bookingUrl}" id="open-whatsapp">${whatsappIcon} ${esc(booking.open)}</a>
    </div>`;
  const menu = document.querySelector('.menu-button');
  const mobileNav = document.querySelector('#mobile-nav');

  function setMenuOpen(open) {
    mobileNav.hidden = !open;
    menu.setAttribute('aria-expanded', String(open));
  }
  menu.addEventListener('click', () => setMenuOpen(mobileNav.hidden));
  document.addEventListener('click', async event => {
    if (!mobileNav.contains(event.target) && !menu.contains(event.target)) setMenuOpen(false);
    const control = event.target.closest('[data-action]');
    if (!control) return;
    const action = control.dataset.action;
    if (action === 'copy-phone') {
      const status = document.querySelector('#copy-status');
      try {
        await navigator.clipboard.writeText(clinicPhone);
        status.textContent = d.contactDetails.copied;
      } catch {
        status.textContent = d.contactDetails.copyFailed;
      }
      return;
    }
    const isBooking = action === 'book';
    dialog.querySelector('#dialog-title').textContent = isBooking ? booking.title : booking.callTitle;
    dialog.querySelector('#dialog-desc').textContent = isBooking ? booking.description : booking.callDescription;
    dialog.querySelector('#message').hidden = !isBooking;
    dialog.querySelector('#open-whatsapp').hidden = !isBooking;
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

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    const reveal = new IntersectionObserver((entries, observer) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        observer.unobserve(target);
        if (!reducedMotion.matches) {
          target.animate([
            { opacity: .64, transform: 'translateY(12px)' },
            { opacity: 1, transform: 'none' }
          ], { duration: 420, easing: 'ease-out' });
        }
      }
    }, { rootMargin: '0px 0px -18px' });
    const revealTargets = [
      '.principles > article', '.programs .card', '.service-preview .card', '.faq details',
      '.about-care', '.timeline > article', '.partner-section .program-topics li',
      '#education .program-topics li', '.program-contact', '.language-block', '.staff-card',
      '.contact-booking', '.contact-profiles', '.feature', '.cta'
    ];
    document.querySelectorAll(revealTargets.join(', '))
      .forEach(element => {
        if (element.getBoundingClientRect().top >= innerHeight - 18) reveal.observe(element);
      });
  }
})().catch(error => {
  console.error(error);
});
