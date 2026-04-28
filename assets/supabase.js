import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ebwehwgjunjoxhptmjzz.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Q_NsRi-f4GU1sRmCjCBhUQ_SU0Cy0NV';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    window.location.replace('/');
    return null;
  }
  return session;
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.replace('/');
}

export function renderNav(targetId, session) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const isAuthed = !!session;
  el.innerHTML = `
    <a class="brand" href="/"><span class="grad">AI</span>.academy</a>
    <div class="links">
      ${isAuthed
        ? `<a href="/courses.html">Courses</a>
           <span class="greeting">hi <span class="email">${escapeHtml(session.user.email)}</span></span>
           <button class="linklike" id="signout-btn">sign out</button>`
        : `<a href="/#auth">Sign in</a>`}
    </div>
  `;
  const btn = document.getElementById('signout-btn');
  if (btn) btn.addEventListener('click', signOut);
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
