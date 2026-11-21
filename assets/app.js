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

  const revealItems = document.querySelectorAll('.reveal');
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
      });
    }, { threshold: 0.07, rootMargin: '0px 0px 60px 0px' });
    revealItems.forEach(el => observer.observe(el));
  } else revealItems.forEach(el => el.classList.add('is-visible'));

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
