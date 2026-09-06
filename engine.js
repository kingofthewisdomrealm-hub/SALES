let state = null;
const el = (id) => document.getElementById(id);

function fresh(personId, practice){
  return {
    person: PEOPLE[personId],
    practice: !!practice,
    scene: 1,
    phase: "approach",
    guard: personId==="gene" ? 4 : 3,
    trust: personId==="gene" ? 0 : 1,
    ownedProblem:false, namedWant:false, feltCost:false, voicedIntent:false, hasFact:false,
    jumps:0, turns:0,
    buyerSay:"\u2026",
    sellerSay:"You walk up. They open the door a third of the way.",
    buyerThink: PEOPLE[personId].fear,
    sellerThink:"Don't pitch. Get permission to ask one thing about the house.",
    coach:"Approach. Your job is to not look like the last closer they already met.",
    coachJump:false,
    visited:["approach"],
    jumped:new Set(),
    log:[],
    ended:null,
    face:"flat"
  };
}

function renderRail(){
  el("rail").innerHTML = PHASES.map(p=>{
    const now = state && state.phase===p.id && !state.ended;
    const done = state && state.visited.includes(p.id) && state.phase!==p.id;
    const jump = state && state.jumped.has(p.id);
    const cls = !state ? "" : state.ended && done ? "done" : now ? "now" : jump ? "jump" : done ? "done" : "";
    return `<div class="step ${cls}"><b>${p.n}</b>${p.name}</div>`;
  }).join("");
}

function optionsFor(){
  if(!state || state.ended) return [];
  return OPTIONS.filter(o => o.scene===state.scene);
}

function startTitle(){
  state = null;
  renderRail();
  el("stage").innerHTML = `
    <section class="title">
      <div class="kicker" style="letter-spacing:.14em;text-transform:uppercase;font-size:12px;font-weight:700;color:#3f6a5c">From the first knock to the signed next step</div>
      <h2>See the thought they will not say out loud.</h2>
      <p class="lede">Jeremy Miner–style NEPQ: connection before facts, their problem before your solution, their commitment before your presentation. Drawn from the porch job in Knockandrestore — rebuilt so the process is visible, the graphics are readable, and the sale actually finishes.</p>
      <div class="picks">
        <button class="pick" data-p="dale">
          <div class="role">Porch one</div>
          <div class="who">Dale Hart</div>
          <p>${PEOPLE.dale.blurb}</p>
        </button>
        <button class="pick" data-p="gene">
          <div class="role">Porch two</div>
          <div class="who">Gene Walsh</div>
          <p>${PEOPLE.gene.blurb}</p>
        </button>
      </div>
    </section>`;
  el("stage").querySelectorAll(".pick").forEach(btn=>{
    btn.onclick = ()=> begin(btn.dataset.p);
  });
}

function begin(pid){
  const practice = el("modePractice").classList.contains("on");
  state = fresh(pid, practice);
  state.sellerSay = "Harbor & Ridge. Storm work. I don't need the whole afternoon.";
  state.log.push({who:"System", text:"Scene 1 — the porch. Phase: Approach."});
  paint();
}

function figure(person, side){
  const p = person;
  const face = state.face || "flat";
  const hair = p.hair==="silver" ? "hair silver" : p.hair==="short" ? "hair short" : "hair";
  const body = side==="seller" ? "body" : `body ${p.body}`;
  return `
    <div class="person ${side}">
      <div class="cloud ${state ? "show" : ""}" id="cloud-${side}">
        <em>${side==="seller" ? "Seller thought" : "Unspoken"}</em>
        <span></span>
      </div>
      <div class="figure">
        <div class="${hair}"></div>
        <div class="head"></div>
        <div class="face"><i class="eye"></i><i class="eye"></i></div>
        <div class="mouth ${face}"></div>
        <div class="${body}"></div>
        <div class="leg l"></div><div class="leg r"></div>
      </div>
      <div class="label">${side==="seller" ? "Jordan" : p.name.split(" ")[0]}</div>
    </div>`;
}

function paint(){
  renderRail();
  if(!state){ startTitle(); return; }
  if(state.ended && state.ended!=="inspect"){ paintDebrief(); return; }

  const setClass = state.scene===2 ? "set table" : "set";
  const learn = !state.practice;
  const opts = optionsFor();
  const gPct = Math.min(100, state.guard*20);
  const tPct = Math.min(100, state.trust*20);

  el("stage").innerHTML = `
    <div class="scene-wrap">
      <div class="${setClass}">
        ${state.scene===1 ? `<div class="sky-sun"></div>
          <div class="house"><div class="roof"></div><div class="wall"><div class="door"></div><div class="win"></div></div></div>
          <div class="grass"></div>` : `<div class="table-prop"></div><div class="folder"></div>`}
        <div class="cast">
          ${figure({hair:"short", body:"", name:"Jordan Hale"}, "seller")}
          ${figure(state.person, "buyer")}
        </div>
      </div>
      <div class="speech-row">
        <div class="say"><div class="who">Jordan says</div><div class="tx">${esc(state.sellerSay)}</div></div>
        <div class="say them"><div class="who">${esc(state.person.name)} says</div><div class="tx">${esc(state.buyerSay)}</div></div>
      </div>
      <div class="meters">
        <span>Guard <b>${state.guard}</b><span class="bar"><i style="width:${gPct}%;background:${state.guard>=4?"var(--bad)":"var(--terra)"}"></i></span></span>
        <span>Trust <b>${state.trust}</b><span class="bar"><i style="width:${tPct}%"></i></span></span>
        <span>Owned problem <b>${state.ownedProblem?"yes":"not yet"}</b></span>
        <span>Intent <b>${state.voicedIntent?"spoken":"not yet"}</b></span>
      </div>
      <div class="coach ${state.coachJump?"jump":""}">${learn ? esc(state.coach) : "Practice mode — coach notes hidden until the debrief."}</div>
      <div class="choices" id="choices"></div>
    </div>`;

  const sellerCloud = el("stage").querySelector("#cloud-seller span");
  const buyerCloud = el("stage").querySelector("#cloud-buyer span");
  buyerCloud.textContent = state.buyerThink;
  if(learn){
    sellerCloud.textContent = state.sellerThink;
  }else{
    el("stage").querySelector("#cloud-seller").classList.remove("show");
  }

  const box = el("stage").querySelector("#choices");
  opts.forEach(o=>{
    const line = o.dynamic ? o.lines[state.person.id] : o.line;
    const fit = o.phase===state.phase || allowedAdvance(o);
    const b = document.createElement("button");
    b.className = "choice";
    b.innerHTML = `<span class="tag ${fit?"":"wrong"}">${o.label}</span><span class="line">${esc(line)}</span>`;
    b.onclick = ()=> choose(o);
    box.appendChild(b);
  });
}

function allowedAdvance(o){
  if(o.phase==="situation" && ["approach","connection"].includes(state.phase)) return state.guard<=3;
  if(o.phase==="problem" && state.hasFact) return true;
  if(o.phase==="solution" && state.ownedProblem) return true;
  if(o.phase==="consequence" && (state.namedWant || state.ownedProblem)) return true;
  if(o.phase==="commitment" && state.scene===1 && (state.ownedProblem || state.hasFact) && state.guard<=3) return true;
  if(o.phase==="commitment" && state.scene===2 && state.feltCost) return true;
  if(o.phase==="presentation" && state.voicedIntent && state.scene===2) return true;
  if(o.phase==="next" && o.id==="next-book" && state.voicedIntent && state.scene===2) return true;
  if(o.phase==="next" && o.id==="commit-look") return false;
  if(o.id==="exit-clean") return true;
  return o.phase===state.phase;
}

function choose(o){
  if(!state || state.ended) return;
  const person = state.person.id;
  const r = o.reply[person];
  const line = o.dynamic ? o.lines[person] : o.line;
  const onTime = allowedAdvance(o) || o.phase===state.phase;
  const early = !onTime && phaseIndex(o.phase) > phaseIndex(state.phase);

  state.turns++;
  state.sellerSay = line;
  state.buyerSay = r.say;
  state.buyerThink = r.think;
  state.face = r.guard && r.guard>0 ? "flat" : (r.owned || r.intent || r.want || r.cost) ? "open" : "flat";

  if(r.guard) state.guard = clamp(state.guard + r.guard, 0, 5);
  if(r.trust) state.trust = clamp(state.trust + r.trust, 0, 5);
  if(r.fact) state.hasFact = true;
  if(r.owned) state.ownedProblem = true;
  if(r.want) state.namedWant = true;
  if(r.cost) state.feltCost = true;
  if(r.intent) state.voicedIntent = true;

  if(early){
    state.jumps++;
    state.jumped.add(o.phase);
    state.coachJump = true;
    state.coach = o.coachJump || "That line belongs later. They felt the close before they felt understood.";
    state.sellerThink = "Too soon. Get back on the rail.";
    state.guard = clamp(state.guard+1, 0, 5);
  }else{
    state.coachJump = !!o.coachJump && !onTime;
    state.coach = o.coach || o.coachJump || "Hold the phase. Let them talk.";
    state.sellerThink = nextThink();
    if(onTime && !state.visited.includes(o.phase)) state.visited.push(o.phase);
    if(onTime) state.phase = advanceFrom(o);
  }

  state.log.push({who:"Jordan", text:line, phase:o.phase, jump:early});
  state.log.push({who:state.person.name, text:r.say});

  if(state.guard>=5){
    state.ended = "wall";
    paint(); return;
  }
  if(o.end==="followup"){
    state.ended = "followup";
    paint(); return;
  }
  if(o.end==="signed" && state.voicedIntent){
    state.ended = "signed";
    state.phase = "next";
    if(!state.visited.includes("next")) state.visited.push("next");
    paint(); return;
  }
  if(o.id==="commit-look" && state.voicedIntent && !early){
    state.scene = 2;
    state.phase = "situation";
    if(!state.visited.includes("commitment")) state.visited.push("commitment");
    state.coach = "Three days later. Findings on the table. Recap facts — do not open the binder.";
    state.sellerThink = "Situation first. Photos, not packages.";
    state.buyerThink = "He came back. That's more than the last one did.";
    state.sellerSay = "I went up. I took pictures. Can I show you what I actually found — not a package?";
    state.buyerSay = "Show me the pictures.";
    state.log.push({who:"System", text:"Scene 2 — kitchen table. Findings in hand."});
  }
  paint();
}

function phaseIndex(id){ return PHASES.findIndex(p=>p.id===id); }

function advanceFrom(o){
  if(o.phase==="connection" && state.guard<=3) return "situation";
  if(o.phase==="situation" && state.hasFact) return "problem";
  if(o.phase==="problem" && state.ownedProblem) return state.scene===1 ? "commitment" : "solution";
  if(o.phase==="solution" && state.namedWant) return "consequence";
  if(o.phase==="consequence" && state.feltCost) return "commitment";
  if(o.phase==="commitment" && state.voicedIntent) return state.scene===1 ? "next" : "presentation";
  if(o.phase==="presentation") return "next";
  return o.phase;
}

function nextThink(){
  if(!state.hasFact) return "Get one true fact about the house today.";
  if(!state.ownedProblem) return "Don't invent the problem. Ask what the fact is costing them.";
  if(state.scene===1 && !state.voicedIntent) return "Ask if they want a look. Don't announce the ladder.";
  if(state.scene===2 && !state.namedWant) return "What does 'handled' look like to them?";
  if(state.scene===2 && !state.feltCost) return "One consequence question. Their future, their words.";
  if(state.scene===2 && !state.voicedIntent) return "Do they want it handled, or another season?";
  if(state.scene===2 && state.voicedIntent) return "Show only the south slope. Then a time.";
  return "Stay curious. Don't get certain.";
}

function paintDebrief(){
  const e = ENDINGS[state.ended] || ENDINGS.wall;
  const flags = [
    ["Fact on the table", state.hasFact],
    ["They owned the problem", state.ownedProblem],
    ["They described the want", state.namedWant],
    ["They named the cost", state.feltCost],
    ["They voiced intent", state.voicedIntent]
  ];
  renderRail();
  el("stage").innerHTML = `
    <section class="debrief">
      <div class="end-kicker">${esc(e.kicker)}</div>
      <h2>${esc(e.title)}</h2>
      <p style="max-width:62ch;color:var(--mute);font-size:17px;margin-top:6px">${esc(e.text)}</p>
      <div class="flags">
        ${flags.map(([n,on])=>`<span class="flag ${on?"":"off"}">${on?"\u2713":"\u2013"} ${n}</span>`).join("")}
        <span class="flag ${state.jumps?"":"off"}">${state.jumps} jumped line${state.jumps===1?"":"s"}</span>
        <span class="flag">Guard ended at ${state.guard} \u00b7 Trust ${state.trust}</span>
      </div>
      <p style="font-size:15px;max-width:62ch">${rewrite()}</p>
      <div class="log">${state.log.map(l=>`<div><b>${esc(l.who)}</b> ${l.jump?"<i style='color:var(--terra)'>jump</i> ":""}${esc(l.text)}</div>`).join("")}</div>
      <div style="margin-top:18px;display:flex;gap:8px">
        <button class="chip on" id="again">Run it again</button>
        <button class="ghost" id="other" style="color:var(--navy);border-color:var(--line)">Other porch</button>
      </div>
    </section>`;
  el("stage").querySelector("#again").onclick = ()=> begin(state.person.id);
  el("stage").querySelector("#other").onclick = startTitle;
}

function rewrite(){
  if(state.ended==="signed") return "Keep that sequence. The presentation was short because they had already sold themselves.";
  if(state.ended==="followup") return "Rewrite if you wanted the look: after the fact, ask whether the mark is just ugly or something they have to manage — then ask if they want to know where it's coming from.";
  if(!state.ownedProblem) return "Rewrite: stop explaining moisture. Ask what they already do about the mark. Ownership lives in their sentence.";
  if(!state.voicedIntent) return "Rewrite: trade the assumptive ladder for one commitment question. 'Do you want a look, or leave it?'";
  return "The wall is usually an early pitch. Connection first. Their words before yours.";
}

function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
function esc(s){ return String(s).replace(/[&<>"]/g,c=>({ "&":"&","<":"<",">":">","\"":""" }[c])); }

el("modeLearn").onclick = ()=>{
  el("modeLearn").classList.add("on"); el("modePractice").classList.remove("on");
  if(state){ state.practice=false; paint(); }
};
el("modePractice").onclick = ()=>{
  el("modePractice").classList.add("on"); el("modeLearn").classList.remove("on");
  if(state){ state.practice=true; paint(); }
};
el("restart").onclick = startTitle;

startTitle();
