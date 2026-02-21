(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function e(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(n){if(n.ep)return;n.ep=!0;const s=e(n);fetch(n.href,s)}})();const i=document.getElementById("search"),d=document.getElementById("searchBtn"),a=document.getElementById("results"),p=document.getElementById("country-name"),l=document.getElementById("details"),m=document.getElementById("save-btn");async function g(o){if(a){if(a.innerHTML="",o.length<2){a.innerHTML="<p>Start typing a country name...</p>";return}a.innerHTML="<p>Loading...</p>";try{const t=await fetch(`https://restcountries.com/v3.1/name/${o}`);if(!t.ok)throw new Error("No countries found");const e=await t.json();a.innerHTML=e.map(r=>`
      <div class="card" onclick="window.location.href='details.html?code=${r.cca3}'">
        <img src="${r.flags.png}" alt="${r.name.common}" width="120" />
        <h2>${r.name.common}</h2>
        <p>Capital: ${r.capital?.[0]||"N/A"}</p>
        <p>Population: ${r.population.toLocaleString()}</p>
      </div>
    `).join("")}catch(t){a.innerHTML=`<p style="color: red;">Error: ${t.message}</p>`}}}i&&i.addEventListener("input",o=>{const t=o.target.value.trim();g(t)});d&&i&&d.addEventListener("click",()=>{const o=i.value.trim();o?g(o):a.innerHTML="<p>Please type a country name.</p>"});if(p&&l&&m){const t=new URLSearchParams(window.location.search).get("code");t&&fetch(`https://restcountries.com/v3.1/alpha/${t}`).then(e=>e.json()).then(([e])=>{p.textContent=e.name.common,l.innerHTML=`
          <img src="${e.flags.png}" alt="${e.name.common}" width="240" />
          <p><strong>Capital:</strong> ${e.capital?.[0]||"N/A"}</p>
          <p><strong>Population:</strong> ${e.population.toLocaleString()}</p>
          <p><strong>Currency:</strong> ${Object.values(e.currencies||{})[0]?.name||"N/A"}</p>
          <p><strong>Languages:</strong> ${Object.values(e.languages||{}).join(", ")||"N/A"}</p>
          <p><strong>Region:</strong> ${e.region}</p>
        `,m.addEventListener("click",()=>{let r=JSON.parse(localStorage.getItem("favorites")||"[]");if(r.some(n=>n.code===t)){alert("Already saved!");return}r.push({code:t,name:e.name.common,flag:e.flags.png}),localStorage.setItem("favorites",JSON.stringify(r)),alert("Saved to favorites!")})}).catch(()=>{l.innerHTML='<p style="color: red;">Country not found</p>'})}function f(){const o=document.getElementById("favorites");if(!o)return;const t=JSON.parse(localStorage.getItem("favorites")||"[]");if(t.length===0){o.innerHTML="<p>No favorites saved yet.</p>";return}o.innerHTML=t.map(e=>`
    <div class="card">
      <img src="${e.flag}" alt="${e.name}" width="120" />
      <h2>${e.name}</h2>
    </div>
  `).join("")}f();
