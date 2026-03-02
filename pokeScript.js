const base = "https://pokeapi.co/api/v2/pokemon/";
const ttl = 1000 * 60 * 60 * 24;

let current = null;
let team = [];
let mem = new Map();

function key(url) {
  return "poke_cache::" + url;
}

function read(url) {
  if (mem.has(url)) return mem.get(url);

  const raw = localStorage.getItem(key(url));
  if (!raw) return null;

  try {
    const obj = JSON.parse(raw);
    if (!obj || !obj.time || !obj.data) return null;
    if (Date.now() - obj.time > ttl) return null;

    mem.set(url, obj.data);
    return obj.data;
  } catch {
    return null;
  }
}

function write(url, data) {
  mem.set(url, data);

  try {
    localStorage.setItem(key(url),
      JSON.stringify({ time: Date.now(), data })
    );
  } catch {}
}

async function getJson(url) {
  const cached = read(url);
  if (cached) return cached;

  const res = await fetch(url);
  if (!res.ok) throw new Error();

  const data = await res.json();
  write(url, data);

  return data;
}

function setStatus(text) {
  document.getElementById("status").textContent = text;
}

function resetUI() {

  const img = document.getElementById("pokeImg");
  img.src = "default.png";

  const audio = document.getElementById("pokeAudio");
  audio.removeAttribute("src");
  audio.load();

  const selects = [
    document.getElementById("m1"),
    document.getElementById("m2"),
    document.getElementById("m3"),
    document.getElementById("m4")
  ];

  selects.forEach(s => s.innerHTML = "");

  document.getElementById("addBtn").disabled = true;

  current = null;
}

function sprite(p) {
  if (p.sprites && p.sprites.front_default)
    return p.sprites.front_default;

  return "";
}

function cry(p) {
  if (p.cries && p.cries.latest)
    return p.cries.latest;

  if (p.cries && p.cries.legacy)
    return p.cries.legacy;

  return "";
}

function fillMoves(list) {

  const selects = [
    document.getElementById("m1"),
    document.getElementById("m2"),
    document.getElementById("m3"),
    document.getElementById("m4")
  ];

  const opts = list.map(m =>
    `<option value="${m}">${m}</option>`
  ).join("");

  selects.forEach((s,i) => {
    s.innerHTML = opts;
    s.selectedIndex = Math.min(i,list.length-1);
  });
}

async function findPokemon() {

  const q = document.getElementById("query");
  const term = q.value.trim().toLowerCase();

  if (!term) return;

  resetUI();
  setStatus("Loading...");

  try {

    const data =
      await getJson(base + encodeURIComponent(term));

    current = data;

    const img = document.getElementById("pokeImg");
    const sp = sprite(data);
    if (sp) img.src = sp;

    const audio = document.getElementById("pokeAudio");
    const c = cry(data);
    if (c) audio.src = c;
    audio.load();

    const moves =
      data.moves.map(x => x.move.name);

    if (moves.length === 0) {
      setStatus("No moves found");
      return;
    }

    fillMoves(moves);

    document.getElementById("addBtn").disabled = false;

    setStatus("");

  } catch {

    setStatus("Not found");

  }
}

function renderTeam() {

  const teamBox =
    document.getElementById("team");

  if (team.length === 0) {
    teamBox.style.display = "none";
    teamBox.innerHTML = "";
    return;
  }

  teamBox.style.display = "block";

  teamBox.innerHTML = team.map(p => {

    const lis =
      p.moves.map(m =>
        `<li>${m}</li>`
      ).join("");

    return `
    <div class="teamRow">

      <div class="teamLeft">
        <img src="${p.img}">
        <div class="teamName">${p.name}</div>
      </div>

      <ul>${lis}</ul>

    </div>
    `;

  }).join("");
}

function addToTeam() {

  if (!current) return;

  if (team.length >= 6) {
    setStatus("Team full");
    return;
  }

  const selects = [
    document.getElementById("m1"),
    document.getElementById("m2"),
    document.getElementById("m3"),
    document.getElementById("m4")
  ];

  const chosen =
    selects.map(s => s.value);

  team.push({
    name: current.name,
    img: sprite(current),
    moves: chosen
  });

  renderTeam();

  setStatus("");
}

document.getElementById("findBtn")
.addEventListener("click", findPokemon);

document.getElementById("query")
.addEventListener("keydown", function(e){
  if(e.key === "Enter")
    findPokemon();
});

document.getElementById("addBtn")
.addEventListener("click", addToTeam);

fillMoves([""]);
resetUI();