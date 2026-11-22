/* VOLT Training Club — independent interactions; no SITE123 runtime. */
(() => {
  'use strict';
  // ADD AN APPROVED WHATSAPP NUMBER HERE, IN INTERNATIONAL FORMAT, EXAMPLE "5511999999999".
  // Leave empty for portfolio previews: nothing will be sent or collected.
  const WHATSAPP_NUMBER = '';

  const body = document.body;
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('nav-toggle');
  const close = document.getElementById('nav-close');
  const drawer = document.getElementById('mobile-nav');
  const navLinks = drawer?.querySelectorAll('.drawer-link') || [];
  const backdrop = document.createElement('div');
  backdrop.className = 'drawer-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.appendChild(backdrop);
  let restoreFocus = null;

  const openDrawer = () => {
    if (!drawer || !toggle) return;
    restoreFocus = document.activeElement;
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    body.classList.add('drawer-open');
    close?.focus();
  };
  const closeDrawer = () => {
    if (!drawer || !toggle || !drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('drawer-open');
    if (restoreFocus && document.contains(restoreFocus)) restoreFocus.focus();
  };
  toggle?.addEventListener('click', () => drawer?.classList.contains('is-open') ? closeDrawer() : openDrawer());
  close?.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  navLinks.forEach(link => link.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeDrawer();
    if (event.key !== 'Tab' || !drawer?.classList.contains('is-open')) return;
    const focusables = [...drawer.querySelectorAll('a[href],button:not([disabled])')].filter(el => el.getClientRects().length);
    if (!focusables.length) return;
    if (event.shiftKey && document.activeElement === focusables[0]) { event.preventDefault(); focusables.at(-1).focus(); }
    else if (!event.shiftKey && document.activeElement === focusables.at(-1)) { event.preventDefault(); focusables[0].focus(); }
  });
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Movimento progressivo: respeita preferências de acessibilidade e evita ocultar o que já está visível.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('#top .reveal').forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${Math.min(index * 110, 330)}ms`);
  });
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    document.querySelectorAll('#modalidades, #experiencia, #estrutura, #planos, #experimental, #faq').forEach(section => {
      const targets = section.querySelectorAll('.eyebrow, h2, .lead, .mod-card, .masonry figure, article, .panel, .faq-item');
      let counter = 0;
      targets.forEach(element => {
        if (element.classList.contains('reveal')) return;
        if (element.getBoundingClientRect().top <= window.innerHeight + 10) return;
        element.classList.add('reveal');
        element.style.setProperty('--reveal-delay', `${(counter++ % 4) * 90}ms`);
      });
    });
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.035, rootMargin: '0px 0px -25px 0px' });
    document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
  }

  // FAQ nativo com animação real de altura e resposta, inclusive no fechamento.
  document.querySelectorAll('#faq .faq-item').forEach(details => {
    const summary = details.querySelector('summary');
    const answer = details.querySelector(':scope > p');
    if (!summary || !answer) return;
    let animation = null;
    summary.addEventListener('click', event => {
      if (reducedMotion.matches || typeof details.animate !== 'function') return;
      event.preventDefault();
      if (animation) animation.finish();

      const opening = !details.open;
      const startHeight = details.getBoundingClientRect().height;
      details.open = opening;
      const endHeight = details.getBoundingClientRect().height;
      if (!opening) details.open = true;
      details.classList.toggle('is-closing', !opening);
      details.style.overflow = 'hidden';
      details.style.height = `${startHeight}px`;
      animation = details.animate(
        [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
        { duration: opening ? 470 : 370, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }
      );
      answer.animate(
        [
          { opacity: opening ? 0 : 1, transform: opening ? 'translateY(-9px)' : 'translateY(0)' },
          { opacity: opening ? 1 : 0, transform: opening ? 'translateY(0)' : 'translateY(-7px)' }
        ],
        { duration: opening ? 370 : 230, easing: 'ease-out' }
      );
      const active = animation;
      animation.onfinish = () => {
        details.open = opening;
        details.style.removeProperty('height');
        details.style.removeProperty('overflow');
        details.classList.remove('is-closing');
        active.cancel();
        if (animation === active) animation = null;
      };
    });
  });

  // Dropdown personalizado: preto, texto branco, microanimações e teclado acessível.
  // Mantém o <select> original para dados enviados no formulário e fallback sem JavaScript.
  const objectiveSelect = document.getElementById('trial-objetivo');
  if (objectiveSelect) {
    const originalLabel = document.querySelector('label[for="trial-objetivo"]');
    const choices = Array.from(objectiveSelect.options);
    const widget = document.createElement('div');
    widget.className = 'volt-select';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.id = 'trial-objetivo-trigger';
    trigger.className = 'volt-select__trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', 'trial-objetivo-listbox');
    const display = document.createElement('span');
    display.id = 'trial-objetivo-value';
    display.textContent = objectiveSelect.selectedOptions[0]?.textContent || 'Selecione seu objetivo';
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrow.setAttribute('viewBox', '0 0 24 24');
    arrow.setAttribute('fill', 'none');
    arrow.setAttribute('stroke', 'currentColor');
    arrow.setAttribute('stroke-width', '2');
    arrow.setAttribute('stroke-linecap', 'round');
    arrow.setAttribute('stroke-linejoin', 'round');
    const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arrowPath.setAttribute('d', 'm6 9 6 6 6-6');
    arrow.appendChild(arrowPath);
    trigger.append(display, arrow);
    if (originalLabel) {
      originalLabel.id = 'trial-objetivo-label';
      trigger.setAttribute('aria-labelledby', `${originalLabel.id} ${display.id}`);
      originalLabel.htmlFor = trigger.id;
    } else trigger.setAttribute('aria-label', 'Objetivo');

    const menu = document.createElement('div');
    menu.id = 'trial-objetivo-listbox';
    menu.className = 'volt-select__menu';
    menu.setAttribute('role', 'listbox');
    menu.setAttribute('aria-label', 'Selecione seu objetivo');
    menu.setAttribute('aria-hidden', 'true');
    const items = [];
    let isOpen = false;

    const hideMenu = (returnFocus = false) => {
      if (!isOpen) return;
      isOpen = false;
      widget.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      if (returnFocus) trigger.focus({ preventScroll: true });
    };
    const showMenu = (focusIndex = objectiveSelect.selectedIndex) => {
      isOpen = true;
      widget.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(() => items[Math.max(0, Math.min(items.length - 1, focusIndex))]?.focus({ preventScroll: true }));
    };
    const setChoice = index => {
      objectiveSelect.selectedIndex = index;
      display.textContent = choices[index].textContent;
      items.forEach((item, n) => item.setAttribute('aria-selected', String(n === index)));
      objectiveSelect.dispatchEvent(new Event('change', { bubbles: true }));
      hideMenu(true);
    };

    choices.forEach((choice, index) => {
      const item = document.createElement('div');
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', String(choice.selected));
      item.id = `trial-objetivo-opt-${index}`;
      item.tabIndex = -1;
      item.className = 'volt-select__option';
      item.textContent = choice.textContent;
      item.style.setProperty('--option-delay', `${index * 40}ms`);
      item.addEventListener('click', () => setChoice(index));
      item.addEventListener('keydown', event => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          items[(index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus({ preventScroll: true });
        } else if (event.key === 'Home' || event.key === 'End') {
          event.preventDefault();
          items[event.key === 'Home' ? 0 : items.length - 1].focus({ preventScroll: true });
        } else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setChoice(index);
        } else if (event.key === 'Escape') {
          event.preventDefault();
          hideMenu(true);
        } else if (event.key === 'Tab') hideMenu();
      });
      menu.appendChild(item);
      items.push(item);
    });
    widget.append(trigger, menu);
    objectiveSelect.insertAdjacentElement('afterend', widget);
    objectiveSelect.classList.add('volt-select__native');
    objectiveSelect.tabIndex = -1;
    objectiveSelect.setAttribute('aria-hidden', 'true');
    trigger.addEventListener('click', () => isOpen ? hideMenu(true) : showMenu());
    trigger.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (!isOpen) showMenu(event.key === 'ArrowUp' ? items.length - 1 : objectiveSelect.selectedIndex);
      } else if (event.key === 'Escape') hideMenu();
    });
    document.addEventListener('pointerdown', event => {
      if (isOpen && !widget.contains(event.target)) hideMenu();
    });
    widget.addEventListener('focusout', event => {
      if (!widget.contains(event.relatedTarget)) hideMenu();
    });
  }

  // Honor data-wa links but never open an unknown/unapproved phone number.
  const toast = document.createElement('div');
  toast.className = 'volt-toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');
  body.appendChild(toast);
  let toastTimeout;
  const notify = message => {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 6000);
  };
  const hasContact = /^\d{11,15}$/.test(WHATSAPP_NUMBER);
  document.querySelectorAll('[data-wa]').forEach(link => {
    const source = new URL(link.getAttribute('href'), location.href);
    const requestedText = source.searchParams.get('text') || 'Olá! Gostaria de saber mais sobre a VOLT Training Club.';
    if (hasContact) link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(requestedText)}`;
    else {
      link.href = '#experimental';
      link.removeAttribute('target');
      link.addEventListener('click', event => {
        event.preventDefault();
        notify('Contato da academia ainda não configurado. Nenhuma mensagem foi enviada.');
      });
    }
  });

  const form = document.getElementById('trial-form');
  const ok = document.getElementById('trial-success');
  const err = document.getElementById('trial-error');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    ok?.classList.add('hidden');err?.classList.add('hidden');
    if (!hasContact) {
      if (err) { err.textContent = 'O agendamento online ainda não está configurado. Nenhum dado foi enviado ou armazenado.';err.classList.remove('hidden'); }
      notify('Agendamento indisponível no momento. Nenhum dado foi enviado.');
      return;
    }
    const fields = new FormData(form);
    const message = [
      'Olá! Gostaria de agendar uma aula experimental no VOLT Training Club.',
      `Nome: ${String(fields.get('nome') || '').trim()}`,
      `WhatsApp: ${String(fields.get('whatsapp') || '').trim()}`,
      fields.get('email') ? `E-mail: ${String(fields.get('email')).trim()}` : null,
      `Objetivo: ${String(fields.get('objetivo') || '').trim()}`,
      fields.get('mensagem') ? `Mensagem: ${String(fields.get('mensagem')).trim()}` : null,
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    if (ok) {ok.textContent='Mensagem preparada no WhatsApp. Confirme o envio para concluir seu pedido.';ok.classList.remove('hidden');}
  });
})();
