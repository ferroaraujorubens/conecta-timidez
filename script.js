const demoProfiles = [
  {name:"Luna", age:18, initial:"L", color:"a", bio:"Adoro playlists novas, jogos cooperativos e conhecer pessoas tranquilamente.", interests:["🎮 Jogos","🎵 Música","🎬 Filmes"]},
  {name:"Miguel", age:19, initial:"M", color:"b", bio:"Sou fã de fantasia, livros e conversas sobre mundos imaginários.", interests:["📚 Leitura","🎬 Filmes","🎨 Arte"]},
  {name:"Rafa", age:18, initial:"R", color:"c", bio:"Gosto de desenhar, ouvir música e aprender coisas criativas.", interests:["🎨 Arte","🎵 Música","🌿 Natureza"]},
  {name:"Bia", age:20, initial:"B", color:"d", bio:"Amo animais, caminhadas tranquilas e fotografar a natureza.", interests:["🐾 Animais","🌿 Natureza","📚 Leitura"]},
  {name:"Caio", age:19, initial:"C", color:"e", bio:"Curto jogos, filmes de aventura e conversar sobre tecnologia.", interests:["🎮 Jogos","🎬 Filmes","⚽ Esportes"]},
  {name:"Nina", age:18, initial:"N", color:"f", bio:"Música é minha companhia favorita. Também adoro esportes e arte.", interests:["🎵 Música","⚽ Esportes","🎨 Arte"]}
];
const challengeData = [
  {icon:"☁", title:"Escreva uma apresentação para você", desc:"Anote três coisas de que gosta. Você não precisa mostrar a ninguém.", level:"Passo 1 · Só para você", action:"Marcar como feito"},
  {icon:"♡", title:"Explore um perfil com calma", desc:"Leia o perfil de alguém e encontre um interesse que vocês compartilham.", level:"Passo 2 · Observação", action:"Marcar como feito"},
  {icon:"✎", title:"Prepare uma pergunta simples", desc:"Pense em uma pergunta sobre um hobby, filme, jogo ou música.", level:"Passo 3 · Preparação", action:"Marcar como feito"},
  {icon:"💬", title:"Escreva uma mensagem de boas-vindas", desc:"Experimente escrever uma mensagem curta. Você decide se quer usá-la.", level:"Passo 4 · Prática", action:"Marcar como feito"},
  {icon:"✧", title:"Compartilhe algo no mural", desc:"Se estiver confortável, publique uma recomendação ou uma pequena conquista.", level:"Passo 5 · Participação", action:"Marcar como feito"}
];
const seedPosts = [
  {author:"Júlia", initial:"J", topic:"Pequenas conquistas", text:"Hoje consegui falar um pouco mais em um grupo de estudos. Foi uma coisa pequena, mas fiquei feliz por ter tentado. 💙", likes:4},
  {author:"Theo", initial:"T", topic:"Interesses e hobbies", text:"Qual jogo vocês recomendam para jogar com outras pessoas sem precisar conversar o tempo todo no começo?", likes:3},
  {author:"Mari", initial:"M", topic:"Fazendo amizades", text:"Às vezes ajuda começar falando sobre algo em comum. Não precisa sair uma conversa perfeita — só tentar já vale.", likes:7}
];
let completed = new Set();
let userProfile = {name:"Alex", bio:"Gosto de música, jogos e conversas tranquilas.", interests:["🎮 Jogos","🎵 Música"]};
let posts = [...seedPosts];
const $ = id => document.getElementById(id);

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function sharedCount(profile) {
  return profile.interests.filter(item => userProfile.interests.includes(item)).length;
}
function renderMatches() {
  const filter = $("matchFilter").value;
  const list = demoProfiles.filter(profile => filter === "all" || profile.interests.includes(filter))
    .sort((a,b) => sharedCount(b) - sharedCount(a));
  $("matchGrid").innerHTML = list.map(profile => {
    const shared = profile.interests.filter(item => userProfile.interests.includes(item));
    const score = userProfile.interests.length ? Math.round(shared.length / Math.max(userProfile.interests.length, profile.interests.length) * 100) : 0;
    return `<article class="match-card">
      <div class="match-top"><div class="match-avatar ${profile.color}">${profile.initial}</div>
      <div><h3>${escapeHTML(profile.name)}</h3><p>Perfil de demonstração · ${profile.age} anos</p></div>
      <span class="match-badge">${shared.length ? `${score}% afinidade` : "Para conhecer"}</span></div>
      <p class="match-bio">${escapeHTML(profile.bio)}</p>
      <div class="match-interests">${profile.interests.map(item => `<span>${escapeHTML(item)}</span>`).join("")}</div>
      <button class="button ${shared.length ? "" : "button-outline"}" data-person="${escapeHTML(profile.name)}" data-shared="${escapeHTML(shared.join(", "))}"> ${shared.length ? "♡ Ver afinidade e conversar" : "Conhecer perfil"} </button>
    </article>`;
  }).join("");
  $("emptyMatches").classList.toggle("hidden", list.length > 0);
}
function renderChallenges() {
  $("challengeList").innerHTML = challengeData.map((item,index) => {
    const done = completed.has(index);
    return `<article class="challenge-card ${done ? "completed" : ""}">
      <div class="challenge-number">${done ? "✓" : item.icon}</div>
      <div><h3>${item.title}</h3><p>${item.desc}</p><div class="challenge-meta">${item.level}</div></div>
      <button class="button ${done ? "button-outline" : ""}" data-challenge="${index}">${done ? "Concluído ✓" : item.action}</button>
    </article>`;
  }).join("");
  $("completedCount").textContent = completed.size;
  $("progressFill").style.width = `${completed.size / challengeData.length * 100}%`;
  $("progressFill").parentElement.setAttribute("aria-valuenow", String(completed.size));
}
function renderPosts() {
  $("forumList").innerHTML = posts.map((post,index) => `<article class="forum-post">
    <div class="post-head"><div class="post-avatar">${escapeHTML(post.initial)}</div><div><div class="post-author">${escapeHTML(post.author)}</div><div class="post-time">${post.userPost ? "publicação local · agora" : "publicação de exemplo"}</div></div><span class="post-topic">${escapeHTML(post.topic)}</span></div>
    <p>${escapeHTML(post.text).replace(/\n/g,"<br>")}</p>
    <button class="post-reaction ${post.reacted ? "reacted" : ""}" data-like="${index}">${post.reacted ? "♥" : "♡"} Apoiar · ${post.likes}</button>
  </article>`).join("");
}
function updateProfileAvatar() {
  const first = userProfile.name.trim().charAt(0).toUpperCase() || "A";
  $("profileAvatar").textContent = first;
}
$("profileForm").addEventListener("submit", event => {
  event.preventDefault();
  userProfile.name = $("displayName").value.trim() || "Alex";
  userProfile.bio = $("bioInput").value.trim();
  userProfile.interests = [...document.querySelectorAll("#interestOptions input:checked")].map(input => input.value);
  updateProfileAvatar();
  renderMatches();
  $("profileFeedback").textContent = "Perfil atualizado! As sugestões foram reorganizadas pelos interesses em comum.";
  showToast("Seu perfil foi atualizado neste navegador.");
});
$("matchFilter").addEventListener("change", renderMatches);
$("matchGrid").addEventListener("click", event => {
  const button = event.target.closest("button[data-person]");
  if (!button) return;
  const person = demoProfiles.find(item => item.name === button.dataset.person);
  const shared = person.interests.filter(item => userProfile.interests.includes(item));
  $("dialogTitle").textContent = shared.length ? `Você e ${person.name} têm algo em comum!` : `Conheça melhor ${person.name}`;
  $("dialogDescription").textContent = shared.length ? `Interesses em comum: ${shared.join(", ")}. Que tal começar com uma pergunta simples sobre um desses assuntos?` : `Ainda não encontramos interesses iguais, mas você pode explorar o perfil de ${person.name} e descobrir algo novo.`;
  $("messageDraft").value = shared.length ? `Oi, ${person.name}! Vi que você também gosta de ${shared[0]}. O que você mais curte nisso?` : `Oi, ${person.name}! Vi seu perfil e queria conhecer um pouco mais sobre seus hobbies.`;
  $("messageDialog").showModal();
});
$("closeDialog").addEventListener("click", () => $("messageDialog").close());
$("cancelMessage").addEventListener("click", () => $("messageDialog").close());
$("saveMessage").addEventListener("click", () => {
  const draft = $("messageDraft").value.trim();
  if (draft) showToast("Ideia de mensagem guardada apenas para esta demonstração.");
  $("messageDialog").close();
});
$("challengeList").addEventListener("click", event => {
  const button = event.target.closest("button[data-challenge]");
  if (!button) return;
  const index = Number(button.dataset.challenge);
  if (completed.has(index)) completed.delete(index); else completed.add(index);
  renderChallenges();
  showToast(completed.has(index) ? "Muito bem! Cada pequeno passo conta. 💙" : "Desafio reaberto. Faça no seu tempo.");
});
$("postText").addEventListener("input", () => $("charCount").textContent = `${$("postText").value.length}/300`);
$("postForm").addEventListener("submit", event => {
  event.preventDefault();
  const text = $("postText").value.trim();
  if (!text) return;
  posts.unshift({author:userProfile.name || "Visitante", initial:(userProfile.name || "V").charAt(0).toUpperCase(), topic:$("postTopic").value, text, likes:0, userPost:true});
  $("postText").value = "";
  $("charCount").textContent = "0/300";
  $("postFeedback").textContent = "Publicação adicionada ao mural local desta demonstração.";
  renderPosts();
  showToast("Sua publicação apareceu no mural!");
});
$("forumList").addEventListener("click", event => {
  const button = event.target.closest("button[data-like]");
  if (!button) return;
  const post = posts[Number(button.dataset.like)];
  if (!post) return;
  post.reacted = !post.reacted;
  post.likes += post.reacted ? 1 : -1;
  renderPosts();
});
$("openProfile").addEventListener("click", () => {
  $("perfil").scrollIntoView({behavior:"smooth"});
  $("displayName").focus({preventScroll:true});
});
$("menuToggle").addEventListener("click", () => {
  const nav = $("mainNav");
  const open = nav.classList.toggle("open");
  $("menuToggle").setAttribute("aria-expanded", String(open));
  $("menuToggle").setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});
document.querySelectorAll("#mainNav a").forEach(link => link.addEventListener("click", () => {
  $("mainNav").classList.remove("open");
  $("menuToggle").setAttribute("aria-expanded","false");
}));
renderMatches();
renderChallenges();
renderPosts();
