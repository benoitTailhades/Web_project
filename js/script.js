
async function loadEvents(){
    try{
        const response = await fetch("../json/office_hour.json")
        if (!response.ok){
            throw new Error("Could not fetch office hour data")
        }
        return await response.json();

    }catch(error){
        console.error("Error: "+error)
    }
}
function displayEvents(events){
    events.forEach(event => {
        console.log(JSON.stringify(event));
    })
}
async function applyFilter() {
    let events = await loadEvents();
    const year = document.getElementById("filter-year").value;
    const semester = document.getElementById("filter-semester").value;
    const myCriteria = {
        prof: "",
        year: `${year !== "ALL" ? year : ""}`,
        semester: `${semester !== "ALL" ? semester : ""}`,
    }
    events = filterEvents(events, myCriteria);
    buildCalendar(events);

}
function filterEvents(events, criteria) {
    return events.filter(event => {
        // On vérifie chaque critère. Si le critère n'est pas fourni (null/undefined), on laisse passer l'event.
        const matchProf = !criteria.prof || event.teacher === criteria.prof;
        const matchYear = !criteria.year || event.year === criteria.year;
        const matchSemester = !criteria.semester || event.semester === criteria.semester;

        return matchProf && matchYear && matchSemester;
    });
}
function convertToCalendarEvents(data) {
    const events = {};

    const colors = [
        "event-blue",
        "event-green",
        "event-yellow",
        "event-red",
        "event-purple"
    ];

    function formatHour(hour, min) {
        let period = hour >= 12 ? "PM" : "AM";
        let h = hour % 12;
        if (h === 0) h = 12;
        return `${h}:${min.toString().padStart(2, "0")} ${period} ●`;
    }

    data.forEach((event, index) => {
        // Parse date: "MON-8-00"
        const [day, hour, min] = event.date.split("-");
        const h = parseInt(hour);
        const m = parseInt(min);


        const key = `${day}-${h}`;

        const formattedEvent = {
            cls: colors[index % colors.length], // couleur automatique
            t: formatHour(h, m),
            b: `${event.title} (${event.teacher})`,
            h: event.duration
        };

        if (!events[key]) {
            events[key] = [];
        }

        events[key].push(formattedEvent);
    });

    return events;
}
function buildCalendar(data) {
    // Build calendar grid

    var container = document.querySelector('.planning');
    if (!container) {
        return;
    }

    var hours = [];
    var grid = document.getElementById('cal-grid');
    grid.textContent = '';
    for (let h = 7; h <= 17; h++) {
        hours.push(h < 12 ? h + ' AM' : (h === 12 ? '12 PM' : (h-12) + ' PM'));
    }
    const events = convertToCalendarEvents(data);
    const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const now = new Date();
    const hour = now.getHours();
    const minuteRatio = now.getMinutes()/60;
    const displayHour = hour < 17;
    const currentDay = days[now.getDay()];

    const daylabel = document.querySelectorAll('.day-label');
    if (daylabel[now.getDay()]) {
        daylabel[now.getDay()].classList.add('today-header');
    }
    for (var hi = 0; hi < hours.length; hi++) {
        var hourNum = hi + 7;
        var timeEl = document.createElement('div');
        timeEl.className = 'time-label';
        timeEl.textContent = hours[hi];
        grid.appendChild(timeEl);
        for (var di = 0; di < days.length; di++) {
            var cell = document.createElement('div');
            cell.className = 'cal-cell' + (days[di]=== currentDay ? ' today' : '');
            var key = days[di] + '-' + hourNum;
            if (events[key]) {
                events[key].forEach(function(ev) {
                    var evEl = document.createElement('div');
                    evEl.className = 'event ' + ev.cls;
                    evEl.innerHTML = '<strong>' + ev.t + '</strong><br>' + ev.b;
                    evEl.style.top = '2px';
                    evEl.style.height = ev.h * 56 + "px";
                    cell.appendChild(evEl);
                });
            }
            if ((hour === hourNum) && (displayHour) && (cell.className === 'cal-cell today')){
                let hLine = document.createElement('div')
                hLine.className = 'cal-h-line';
                hLine.style.top = 56* minuteRatio + "px"
                cell.appendChild(hLine);
            }
            grid.appendChild(cell);
        }
    }
}
function checkSubmit(){
    const form = document.getElementById('myForm');
    const feedback = document.getElementById("formFeedback")
    form.addEventListener('submit', (event) => {event.preventDefault();})
    const formData = new FormData(form);
    var firstName = formData.get('firstname');
    var lastName = formData.get('lastname');
    var email = formData.get('email');
    var phone = formData.get('phone');
    var message = document.getElementById('message').value;
    if (!firstName){
        feedback.style.color = 'red';
        feedback.textContent = 'Please enter your first name';
    }else if (!lastName){
        feedback.style.color = 'red';
        feedback.textContent = 'Please enter your last name';
    }else if (!phone || phone.length !== 10){
        feedback.style.color = 'red';
        feedback.textContent = 'Please enter a valid phone number';
    }else if (!message){
        feedback.style.color = 'red';
        feedback.textContent = 'Please enter your message';
    }else if (!email.includes('@gmail.') && !email.includes('@efrei.net')){
        feedback.style.color = 'red';
        feedback.textContent = 'Please enter a valid email';

    }else{
        feedback.style.color = 'green';
        feedback.textContent = 'Thanks your message was successfully send !';
    }
}
// Fonction pour faire défiler le carrousel (attachée aux boutons onclick)
function scrollCarousel(year, direction) {
    const track = document.getElementById(`track-${year}`);
    if (track) {
        // On scrolle de la largeur visible du conteneur (ou de la largeur d'une carte)
        const scrollAmount = track.clientWidth *1.05;
        track.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
    }
}

const phoneInput = document.getElementById('phone');

if (phoneInput) {
    phoneInput.addEventListener('keydown', (event) => {
        // Allow: backspace, delete, tab, escape, and enter
        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'];
        if (allowedKeys.includes(event.key)) return;

        // Block if the character is not a digit
        if (isNaN(event.key) || event.key === ' ') {
            event.preventDefault();
            document.getElementById("phoneInput").value--;
        }
    });
}

/* ── Helpers ── */
function notFound(msg) {
    return `<div class="syllabus-loader">${msg}</div>`;
}

function initials(name) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

/* ── Constructeur HTML principal ── */
function buildSyllabus(course) {
    const d  = course.course_data;
    const ov = d.overview;

    // Évaluation : trier par poids décroissant
    const evalEntries = Object.entries(d.evaluation)
        .map(([k, v]) => ({ label: k.replace(/_/g, ' '), pct: parseInt(v) }))
        .sort((a, b) => b.pct - a.pct);

    return `
    <!-- ── HERO ── -->
    <div class="syllabus-hero">
      <a class="back-link" href="formations.html">&#8592; Back to Formations</a>
      <span class="course-code-badge">${course.course_code}</span>
      <h1>${course.course_name}</h1>
      <p class="hero-summary">${ov.summary}</p>
    </div>

    <!-- ── META BAR ── -->
    <div class="syllabus-meta-bar">
      <div class="meta-item">
        <span class="meta-label">Year</span>
        <span class="meta-value"><span>${course.years}</span></span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Credits</span>
        <span class="meta-value"><span>${ov.credits}</span> ECTS</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Total Hours</span>
        <span class="meta-value"><span>${ov.total_hours}</span> h</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Department</span>
        <span class="meta-value">${ov.department}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Language</span>
        <span class="meta-value">${ov.language}</span>
      </div>
    </div>

    <!-- ── BODY ── -->
    <div class="syllabus-body">

      <!-- Colonne principale -->
      <div class="syllabus-main">

        <!-- Syllabus topics -->
        <div class="syl-section">
          <h2><span class="icon"></span> Syllabus Topics</h2>
          <ul class="topics-list">
            ${d.syllabus_topics.map(t => `<li>${t}</li>`).join('')}
          </ul>
        </div>

        <!-- Learning outcomes -->
        <div class="syl-section">
          <h2><span class="icon"></span> Learning Outcomes</h2>
          <ul class="outcomes-list">
            ${d.learning_outcomes.map(o => `<li>${o}</li>`).join('')}
          </ul>
        </div>

        <!-- Evaluation -->
        <div class="syl-section">
          <h2><span class="icon"></span> Evaluation</h2>
          <table class="eval-table">
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Weight</th>
                <th style="width:200px">Distribution</th>
              </tr>
            </thead>
            <tbody>
              ${evalEntries.map(e => `
                <tr>
                  <td>${e.label}</td>
                  <td class="eval-weight">${e.pct}%</td>
                  <td>
                    <div class="eval-bar-wrap">
                      <div class="eval-bar" style="width:${e.pct}%"></div>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

      </div>

      <!-- Sidebar droite -->
      <aside class="syllabus-sidebar">
        <!-- Responsables -->
        <div class="sidebar-card">
          <h3>Responsible</h3>
          <div class="responsible-item">
            <div class="responsible-avatar">${initials(ov.responsibles.module)}</div>
            <div>
              <div class="responsible-name">${ov.responsibles.module}</div>
              <div class="responsible-role">Module Responsible</div>
            </div>
          </div>
          <div class="responsible-item">
            <div class="responsible-avatar">${initials(ov.responsibles.ue)}</div>
            <div>
              <div class="responsible-name">${ov.responsibles.ue}</div>
              <div class="responsible-role">UE Responsible</div>
            </div>
          </div>
        </div>

        <!-- Prérequis -->
        <div class="sidebar-card">
          <h3>Prerequisites</h3>
          <div class="prereq-tags">
            ${d.prerequisites.map(p => `<span class="prereq-tag">${p}</span>`).join('')}
          </div>
        </div>

      </aside>
    </div>
  `;
}

// Animated Nav bar script
document.addEventListener('DOMContentLoaded', () => {
    const underline = document.querySelector('.nav-underline');
    const items = document.querySelectorAll('.nav-item');
    const activeItem = document.querySelector('.nav-item.active');

    function moveUnderline(element) {
        if (element) {
            underline.style.width = element.offsetWidth + 'px';
            underline.style.left = element.offsetLeft + 'px';
        }
    }

    // Position initiale sur l'onglet actif au chargement
    if (activeItem) {
        moveUnderline(activeItem);
    }

    // Effet de glisse au survol (optionnel mais recommandé pour l'effet de glisse)
    items.forEach(item => {
        item.addEventListener('mouseenter', (e) => moveUnderline(e.target));
    });

    // Retour à l'onglet actif quand la souris quitte la nav
    document.querySelector('nav ul').addEventListener('mouseleave', () => {
        moveUnderline(activeItem);
    });
});

// Calendar script
document.addEventListener('DOMContentLoaded', async () =>{
    var events = await loadEvents();
    const myCriteria = {
        prof:"",
        year:"",
        semester:""
    }
    events = filterEvents(events, myCriteria);
    buildCalendar(events);
})

// Animated Nav bar for mobile (Hamburger menu)
document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.getElementById('hamburger');
    const navList = document.getElementById('nav-list');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            // Bascule la classe "active" pour afficher/cacher le menu
            navList.classList.toggle('active');

            // Animation optionnelle du hamburger en "X"
            hamburger.classList.toggle('open');
        });
    }
});
// Script for the dynamic Teacher pages
document.addEventListener('DOMContentLoaded', () => {

    // On cible le conteneur vide dans teachers.html
    const container = document.getElementById('teachers-list');

    // On vérifie qu'on est bien sur la bonne page avant d'exécuter le code
    if (container) {

        // On récupère le fichier JSON
        fetch('../json/teacher_data.json')
            .then(response => response.json())
            .then(data => {

                // On vide le conteneur au cas où
                container.innerHTML = '';

                // On boucle sur chaque professeur du fichier JSON
                data.forEach(prof => {

                    // On crée le HTML pour un professeur
                    // Les ` (backticks) permettent d'écrire du HTML sur plusieurs lignes et d'insérer des variables avec ${}
                    const profHTML = `
                        <div class="teacher-row">
                            <div class="text">
                                <h2>${prof.nom}</h2>
                                <p><strong>Formation :</strong> ${prof.formation}</p>
                                <a class="btn-black" href="teacher_profile.html?id=${prof.id}">See profile</a>
                            </div>
                            <div class="teacher-img"><div class="dots-pattern"></div></div>
                            <!-- <img src="${prof.photo}" alt="Photo de ${prof.nom}"> -->
                            </div>
                    `;

                    // On ajoute ce code HTML à l'intérieur de notre conteneur
                    container.innerHTML += profHTML;
                });
            })
            .catch(error => console.error('Error while loading teachers data:', error));
    }
});
// Script for dynamic Teacher profile page
document.addEventListener('DOMContentLoaded',()=> {

    const urlParams = new URLSearchParams(window.location.search);
    const teacherId = parseInt(urlParams.get('id'));
    const container = document.getElementById('teacher_profile')
    if (container) {
        fetch('../json/teacher_data.json')
            .then(response => response.json())
            .then(data => {
                container.innerHTML = '';
                data.forEach(teacher => {
                    if (teacher.id === teacherId) {
                        container.innerHTML = `
                        <div class="profile-hero">
                            <div class="text">
                                <h1>${teacher.nom}</h1>
                                <p>${teacher.formation} teacher</p>
                                <h2>Office hour</h2>
                                <p>${teacher.office_hours}</p>
                            </div>
                            <div class="butterfly-img">
                                <svg class="butterfly-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                    <g fill="none">
                                        <!-- butterfly wings in dotted style -->
                                        <ellipse cx="70" cy="80" rx="55" ry="65" fill="#c8c0e8" opacity="0.7"/>
                                        <ellipse cx="130" cy="80" rx="55" ry="65" fill="#c8c0e8" opacity="0.7"/>
                                        <ellipse cx="75" cy="130" rx="40" ry="45" fill="#d8d0f0" opacity="0.6"/>
                                        <ellipse cx="125" cy="130" rx="40" ry="45" fill="#d8d0f0" opacity="0.6"/>
                                        <!-- body -->
                                        <ellipse cx="100" cy="100" rx="6" ry="50" fill="#8878c8"/>
                                        <!-- dots texture -->
                                        <circle cx="60" cy="70" r="3" fill="#a898d8" opacity="0.5"/>
                                        <circle cx="80" cy="60" r="2" fill="#a898d8" opacity="0.5"/>
                                        <circle cx="55" cy="90" r="2" fill="#a898d8" opacity="0.5"/>
                                        <circle cx="140" cy="70" r="3" fill="#a898d8" opacity="0.5"/>
                                        <circle cx="120" cy="60" r="2" fill="#a898d8" opacity="0.5"/>
                                        <circle cx="145" cy="90" r="2" fill="#a898d8" opacity="0.5"/>
                                        <!-- antennae -->
                                        <line x1="97" y1="52" x2="80" y2="30" stroke="#8878c8" stroke-width="1.5"/>
                                        <line x1="103" y1="52" x2="120" y2="30" stroke="#8878c8" stroke-width="1.5"/>
                                        <circle cx="80" cy="30" r="3" fill="#8878c8"/>
                                        <circle cx="120" cy="30" r="3" fill="#8878c8"/>
                                    </g>
                                </svg>
                            </div>
                        </div>
                        <div class="profile-cols">
                <div>
                    <h3>Biographie</h3>
                    <p>${teacher.biographie}</p>
                </div>
                <div>
                    <h3>See Articles →</h3>
                </div>
            </div>`
                    }
                })

            })

    }
})
//Script for dynamic Research page
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('research-list')

    if (container) {
        fetch('../json/articles_data.json')
            .then(response => response.json())
            .then(data => {

                // On vide le conteneur au cas où
                container.innerHTML = '';

                // On boucle sur chaque professeur du fichier JSON
                data.forEach(article => {

                    // On crée le HTML pour un professeur
                    // Les ` (backticks) permettent d'écrire du HTML sur plusieurs lignes et d'insérer des variables avec ${}
                    const articleHTML = `
                        <div class="research-card">
                           <!-- <img src="${article.image}"--> 
                           <div class="research-img">
                            <div class="starburst">
                              <svg class="starburst-svg" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
                                <g transform="translate(60,40)">
                                  <circle r="18" fill="#1a7aaa"/>
                                  <line x1="0" y1="-38" x2="0" y2="38" stroke="#1a7aaa" stroke-width="6"/>
                                  <line x1="-38" y1="0" x2="38" y2="0" stroke="#1a7aaa" stroke-width="6"/>
                                  <line x1="-27" y1="-27" x2="27" y2="27" stroke="#1a7aaa" stroke-width="5"/>
                                  <line x1="27" y1="-27" x2="-27" y2="27" stroke="#1a7aaa" stroke-width="5"/>
                                  <line x1="-10" y1="-36" x2="10" y2="36" stroke="#1a7aaa" stroke-width="4"/>
                                  <line x1="10" y1="-36" x2="-10" y2="36" stroke="#1a7aaa" stroke-width="4"/>
                                  <line x1="-36" y1="-10" x2="36" y2="10" stroke="#1a7aaa" stroke-width="4"/>
                                  <line x1="36" y1="-10" x2="-36" y2="10" stroke="#1a7aaa" stroke-width="4"/>
                                </g>
                              </svg>
                            </div>
                          </div>
                           <div class="info">
                            <h3>${article.title}</h3>
                            <p>${article.description}</p>
                            <a href="article.html">See Article</a>
                            <!--<a href="${article.article_page}">See Article</a>-->
                          </div>
                        </div>
                    `;

                    container.innerHTML += articleHTML;
                });
            })
            .catch(error => console.error('Error while loading teachers data:', error));
    }

})

// Script for dynamic Formations page (Carousels)
document.addEventListener('DOMContentLoaded', () => {
    const formationsContainer = document.getElementById('formations-container');

    if (formationsContainer) {
        fetch('../json/formations_data.json')
            .then(response => response.json())
            .then(data => {
                // 1. Grouper les cours par année
                const groupedByYear = data.reduce((acc, course) => {
                    if (!acc[course.years]) {
                        acc[course.years] = [];
                    }
                    acc[course.years].push(course);
                    return acc;
                }, {});

                // 2. Définir l'ordre d'affichage souhaité
                const yearsOrder = ["P1", "P2", "ING1", "ING2", "ING3"];

                // 3. Vider le conteneur
                formationsContainer.innerHTML = '';

                // 4. Générer le HTML pour chaque année
                yearsOrder.forEach(year => {
                    if (groupedByYear[year] && groupedByYear[year].length > 0) {

                        // Création du HTML pour les cartes de cette année
                        const cardsHTML = groupedByYear[year].map(course => `
                            <a class="testimonial-card" href="syllabus.html?id=${course.id}">
                                <div class="card-image-container">
                                    <img src="${course.course_image}" alt="${course.course_name}" class="card-img" onerror="this.src='https://placehold.co/600x400/png'">
                                </div>
                                <div class="card-content">
                                    <p class="formation-name">${course.course_code} - ${course.course_name}</p>
                                </div>
                            </a>
                        `).join('');

                        // Création de la section complète avec le carrousel
                        const sectionHTML = `
                            <div class="formation-section" id="${year}">
                                <h2>${year}</h2>
                                <div class="carousel-wrapper">
                                    <button class="carousel-btn prev" onclick="scrollCarousel('${year}', -1)">&#10094;</button>
                                    
                                    <div class="carousel-track" id="track-${year}">
                                        ${cardsHTML}
                                    </div>
                                    
                                    <button class="carousel-btn next" onclick="scrollCarousel('${year}', 1)">&#10095;</button>
                                </div>
                            </div>
                        `;

                        formationsContainer.innerHTML += sectionHTML;
                    }
                });
            })
            .catch(error => console.error('Erreur lors du chargement des formations:', error));
    }
});

// Script for dynamic Syllabus page
document.addEventListener('DOMContentLoaded', () => {
    const root   = document.getElementById('syllabus-root');
    const params = new URLSearchParams(window.location.search);
    const courseId = parseInt(params.get('id'));

    if (!courseId) {
        root.innerHTML = notFound('No course selected. <a href="formations.html">← Back to formations</a>');
        return;
    }

    fetch('../json/formations_data.json')
        .then(r => r.json())
        .then(data => {
            const course = data.find(c => c.id === courseId);
            if (!course) {
                root.innerHTML = notFound(`Course #${courseId} not found. <a href="formations.html">← Back</a>`);
                return;
            }
            document.title = `${course.course_code} — ${course.course_name}`;
            root.innerHTML = buildSyllabus(course);
        })
        .catch(() => {
            root.innerHTML = notFound('Could not load course data.');
        });
});




