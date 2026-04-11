/**
 * CONVERTIR — Módulo de integración de sesión
 * Incluye este script en autoevaluacion_CONVERTIR.html,
 * evaluacion_convertir.html y evaluacion_ventas.html
 * con: <script src="sesion_integracion.js"></script>
 *
 * Lo que hace automáticamente:
 *  1. Lee los datos del promotor desde sessionStorage o URL params
 *  2. Pre-rellena los campos nombre, regional, cadena y PDV
 *  3. Los bloquea visualmente para evitar edición accidental
 *  4. Guarda el resultado en el historial local al terminar
 *  5. Agrega un banner de sesión activa en la parte superior
 */

(function(){
  'use strict';

  // ── Leer sesión ────────────────────────────────────────────────────────────
  function getSession(){
    try{ const s=sessionStorage.getItem('conv_session'); return s?JSON.parse(s):null; }
    catch(e){ return null; }
  }
  function getFromURL(){
    const p=new URLSearchParams(window.location.search);
    if(!p.get('nombre')) return null;
    return {
      nombre:p.get('nombre'), apellido:p.get('apellido')||'',
      nombreCompleto:`${p.get('nombre')} ${p.get('apellido')||''}`.trim(),
      regional:p.get('regional')||'', cadena:p.get('cadena')||'',
      pdv:p.get('pdv')||'', tipo:p.get('tipo')||'quick',
      codigo:p.get('codigo')||'', email:'',
      ts:new Date().toISOString(), fecha:new Date().toLocaleDateString('es-CO')
    };
  }

  const session = getSession() || getFromURL();

  if(!session) return; // sin sesión, nada que hacer

  // ── Exponer sesión globalmente para que las evaluaciones la usen ───────────
  window.CONV_SESSION = session;

  // ── Guardar resultado al terminar ──────────────────────────────────────────
  window.guardarResultadoSesion = function(tipo, pct, nivel){
    const key=`hist_${session.nombreCompleto}`;
    let hist=[];
    try{ hist=JSON.parse(localStorage.getItem(key)||'[]'); }catch(e){}
    hist.push({tipo, pct, nivel, fecha:session.fecha, ts:new Date().toISOString()});
    localStorage.setItem(key, JSON.stringify(hist));
    // también actualizar sessionStorage con último resultado
    try{
      const ss=JSON.parse(sessionStorage.getItem('conv_session')||'{}');
      ss[`ultimo_${tipo}`]={pct, nivel, fecha:session.fecha};
      sessionStorage.setItem('conv_session', JSON.stringify(ss));
    }catch(e){}
  };

  // ── Pre-rellenar campos al cargar el DOM ───────────────────────────────────
  document.addEventListener('DOMContentLoaded', function(){
    // Banner de sesión activa
    const banner=document.createElement('div');
    banner.id='conv-session-banner';
    banner.style.cssText=`
      background:#534AB7;color:#EEEDFE;font-family:'Montserrat',system-ui,sans-serif;
      padding:10px 16px;font-size:12px;font-weight:600;
      display:flex;align-items:center;justify-content:space-between;
      position:sticky;top:0;z-index:999;border-radius:0 0 10px 10px;
      box-shadow:0 2px 12px rgba(83,74,183,.25)`;
    banner.innerHTML=`
      <span>
        <span style="opacity:.7;font-weight:400">Sesión activa · </span>
        <strong>${session.nombreCompleto}</strong>
        <span style="opacity:.7"> · ${session.regional} · ${session.cadena||'—'}</span>
      </span>
      <a href="sesion_promotor.html" style="color:#AFA9EC;text-decoration:none;font-size:11px">← Volver al menú</a>`;
    document.body.insertBefore(banner, document.body.firstChild);

    // Map of field IDs to session values
    const fieldMap={
      'nombre':session.nombre,
      'q-nombre':session.nombre,
      'r-nombre':session.nombre,
      'apellido':session.apellido,
      'regional':session.regional,
      'q-regional':session.regional,
      'r-regional':session.regional,
      'cadena':session.cadena,
      'q-cadena':session.cadena,
      'r-cadena':session.cadena,
      'pdv':session.pdv,
      'q-pdv':session.pdv,
      'r-pdv':session.pdv,
      'fecha':session.fecha,
    };

    Object.entries(fieldMap).forEach(([id, val])=>{
      const el=document.getElementById(id);
      if(!el||!val) return;
      // Set value
      if(el.tagName==='SELECT'){
        for(let opt of el.options){
          if(opt.value===val||opt.text===val){ opt.selected=true; break; }
        }
      } else {
        el.value=val;
      }
      // Visual lock — readonly + style
      el.setAttribute('readonly','');
      el.setAttribute('disabled','');
      el.style.background='#F5F4FE';
      el.style.color='#534AB7';
      el.style.fontWeight='600';
      el.style.cursor='default';
      el.style.borderColor='#D0CFF0';
    });

    // Special: nombre completo field (some evals use this)
    const ncEl=document.getElementById('nombre-completo')||document.getElementById('nombreCompleto');
    if(ncEl){ ncEl.value=session.nombreCompleto; ncEl.setAttribute('disabled',''); }
  });

})();
