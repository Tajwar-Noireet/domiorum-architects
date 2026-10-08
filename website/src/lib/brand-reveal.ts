export const brandRevealSessionKey = "domiorum-brand-intro-v1";

export const brandRevealBootstrap = `(()=>{
  try {
    let seen=false;
    try { seen=sessionStorage.getItem('${brandRevealSessionKey}')==='seen'; } catch {}
    if (seen) return;
    const root=document.documentElement;
    root.dataset.brandIntro='playing';
    setTimeout(()=>{
      if(root.dataset.brandIntro!=='playing') return;
      root.dataset.brandIntroExpired='true';
      delete root.dataset.brandIntro;
      const shell=document.getElementById('site-shell');
      if(shell) shell.inert=false;
    },9000);
  } catch {}
})();`;
