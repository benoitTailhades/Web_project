// ════════════════════════════════════════════════════════════════
//  PLANNING — Data loading & calendar
// ════════════════════════════════════════════════════════════════

// Fetches office hour events from the JSON data file
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

// Debug helper: logs each event object to the console
function displayEvents(events){
    events.forEach(event => {
        console.log(JSON.stringify(event));
    })
}

// Reads the filter dropdowns, applies criteria, and rebuilds the calendar
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

// Returns only the events that match every non-empty criterion
// An empty string criterion means "no filter on this field"
function filterEvents(events, criteria) {
    return events.filter(event => {
        const matchProf     = !criteria.prof     || event.teacher  === criteria.prof;
        const matchYear     = !criteria.year     || event.year     === criteria.year;
        const matchSemester = !criteria.semester || event.semester === criteria.semester;
        return matchProf && matchYear && matchSemester;
    });
}

// Converts the flat JSON event array into a keyed object: { "MON-8": [...], "TUE-10": [...] }
// so the calendar builder can look up events by day+hour in O(1)
function convertToCalendarEvents(data) {
    const events = {};

    const colors = [
        "event-blue",
        "event-green",
        "event-yellow",
        "event-red",
        "event-purple"
    ];

    // Formats a 24h hour/minute pair into a 12h AM/PM string with a bullet indicator
    function formatHour(hour, min) {
        let period = hour >= 12 ? "PM" : "AM";
        let h = hour % 12;
        if (h === 0) h = 12;
        return `${h}:${min.toString().padStart(2, "0")} ${period} ●`;
    }

    data.forEach((event, index) => {
        // Date format in the JSON: "MON-8-00"  →  day, hour, minute
        const [day, hour, min] = event.date.split("-");
        const h = parseInt(hour);
        const m = parseInt(min);

        const key = `${day}-${h}`;

        const formattedEvent = {
            cls: colors[index % colors.length], // cycle through color classes automatically
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

// Builds (or rebuilds) the full calendar grid from scratch
// Called on page load and every time filters are applied
function buildCalendar(data) {
    // Only run on the planning page
    var container = document.querySelector('.planning');
    if (!container) {
        return;
    }

    // Generate hour labels from 7 AM to 5 PM
    var hours = [];
    var grid = document.getElementById('cal-grid');
    grid.textContent = ''; // clear previous content before rebuilding
    for (let h = 7; h <= 17; h++) {
        hours.push(h < 12 ? h + ' AM' : (h === 12 ? '12 PM' : (h-12) + ' PM'));
    }

    const events = convertToCalendarEvents(data);
    const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const now = new Date();
    const hour = now.getHours();
    const minuteRatio = now.getMinutes() / 60;
    const displayHour = hour < 17; // only show the time indicator during calendar hours
    const currentDay = days[now.getDay()];

    // Highlight today's column header
    const daylabel = document.querySelectorAll('.day-label');
    if (daylabel[now.getDay()]) {
        daylabel[now.getDay()].classList.add('today-header');
    }

    // Build the grid row by row (one row per hour)
    for (var hi = 0; hi < hours.length; hi++) {
        var hourNum = hi + 7;

        // Time label cell on the left
        var timeEl = document.createElement('div');
        timeEl.className = 'time-label';
        timeEl.textContent = hours[hi];
        grid.appendChild(timeEl);

        // One cell per day of the week
        for (var di = 0; di < days.length; di++) {
            var cell = document.createElement('div');
            cell.className = 'cal-cell' + (days[di] === currentDay ? ' today' : '');

            var key = days[di] + '-' + hourNum;

            // Inject event blocks if any exist for this day/hour slot
            if (events[key]) {
                events[key].forEach(function(ev) {
                    var evEl = document.createElement('div');
                    evEl.className = 'event ' + ev.cls;
                    evEl.innerHTML = '<strong>' + ev.t + '</strong><br>' + ev.b;
                    evEl.style.top = '2px';
                    evEl.style.height = ev.h * 56 + "px"; // height proportional to duration
                    cell.appendChild(evEl);
                });
            }

            // Draw the current-time red line inside today's column
            if ((hour === hourNum) && displayHour && (cell.className === 'cal-cell today')) {
                let hLine = document.createElement('div');
                hLine.className = 'cal-h-line';
                hLine.style.top = 56 * minuteRatio + "px"; // position proportional to elapsed minutes
                cell.appendChild(hLine);
            }

            grid.appendChild(cell);
        }
    }
}

// ════════════════════════════════════════════════════════════════
//  CONTACT — Form validation
// ════════════════════════════════════════════════════════════════

// Validates all form fields and shows inline feedback without submitting
function checkSubmit(){
    const form = document.getElementById('myForm');
    const feedback = document.getElementById("formFeedback");

    // Prevent default browser submission
    form.addEventListener('submit', (event) => { event.preventDefault(); });

    const formData = new FormData(form);
    var firstName = formData.get('firstname');
    var lastName  = formData.get('lastname');
    var email     = formData.get('email');
    var phone     = formData.get('phone');
    var message   = document.getElementById('message').value;

    // Sequential validation: show the first error found, or a success message
    if (!firstName) {
        feedback.style.color = 'red';
        feedback.textContent = 'Please enter your first name';
    } else if (!lastName) {
        feedback.style.color = 'red';
        feedback.textContent = 'Please enter your last name';
    } else if (!phone || phone.length !== 10) {
        feedback.style.color = 'red';
        feedback.textContent = 'Please enter a valid phone number';
    } else if (!message) {
        feedback.style.color = 'red';
        feedback.textContent = 'Please enter your message';
    } else if (!email.includes('@gmail.') && !email.includes('@efrei.net')) {
        feedback.style.color = 'red';
        feedback.textContent = 'Please enter a valid email';
    } else {
        feedback.style.color = 'green';
        feedback.textContent = 'Thanks, your message was successfully sent!';
    }
}

// Blocks non-numeric keystrokes in the phone number input field
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('keydown', (event) => {
        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'];
        if (allowedKeys.includes(event.key)) return;

        // Reject anything that is not a digit or is a space
        if (isNaN(event.key) || event.key === ' ') {
            event.preventDefault();
        }
    });
}

// ════════════════════════════════════════════════════════════════
//  FORMATIONS — Carousel scroll helper
// ════════════════════════════════════════════════════════════════

// Scrolls the carousel track for a given year left (-1) or right (+1)
function scrollCarousel(year, direction) {
    const track = document.getElementById(`track-${year}`);
    if (track) {
        const scrollAmount = track.clientWidth * 1.05; // scroll roughly one viewport width
        track.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
    }
}

// ════════════════════════════════════════════════════════════════
//  SYLLABUS — HTML builder helpers
// ════════════════════════════════════════════════════════════════

// Returns a simple "not found" message block
function notFound(msg) {
    return `<div class="syllabus-loader">${msg}</div>`;
}

// Extracts the initials from a full name (e.g. "John Doe" → "JD")
function initials(name) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// Generates the full syllabus page HTML from a course data object
function buildSyllabus(course) {
    const d  = course.course_data;
    const ov = d.overview;

    // Sort evaluation entries by weight descending for the table
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

      <!-- Main column -->
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

        <!-- Evaluation breakdown table with progress bars -->
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

      <!-- Right sidebar -->
      <aside class="syllabus-sidebar">

        <!-- Responsible teachers -->
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

        <!-- Prerequisite tags -->
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

// ════════════════════════════════════════════════════════════════
//  DOM READY — All event listeners and page initialisation
// ════════════════════════════════════════════════════════════════

// Animated navigation underline — moves to the hovered or active nav item
document.addEventListener('DOMContentLoaded', () => {
    const underline  = document.querySelector('.nav-underline');
    const items      = document.querySelectorAll('.nav-item');
    const activeItem = document.querySelector('.nav-item.active');

    function moveUnderline(element) {
        if (element) {
            underline.style.width = element.offsetWidth + 'px';
            underline.style.left  = element.offsetLeft  + 'px';
        }
    }

    // Position the underline on the active tab when the page loads
    if (activeItem) {
        moveUnderline(activeItem);
    }

    // Slide the underline to the hovered item
    items.forEach(item => {
        item.addEventListener('mouseenter', (e) => moveUnderline(e.target));
    });

    // Return the underline to the active tab when the cursor leaves the nav
    document.querySelector('nav ul').addEventListener('mouseleave', () => {
        moveUnderline(activeItem);
    });
});

// Planning page — loads and renders the calendar on page load
document.addEventListener('DOMContentLoaded', async () => {
    var events = await loadEvents();
    const myCriteria = { prof: "", year: "", semester: "" };
    events = filterEvents(events, myCriteria);
    buildCalendar(events);
});

// Mobile hamburger menu — toggles the nav list visibility and the X animation
document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.getElementById('hamburger');
    const navList   = document.getElementById('nav-list');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navList.classList.toggle('active');   // show/hide the menu
            hamburger.classList.toggle('open');   // animate the icon into an X
        });
    }
});

// Teachers page — dynamically renders the teacher list from JSON
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('teachers-list');

    if (container) {
        fetch('../json/teacher_data.json')
            .then(response => response.json())
            .then(data => {
                container.innerHTML = '';

                // Create one teacher row card per entry in the JSON
                data.forEach(prof => {
                    const profHTML = `
                        <div class="teacher-row">
                            <div class="text">
                                <h2>${prof.nom}</h2>
                                <p><strong>Formation:</strong> ${prof.formation}</p>
                                <a class="btn-black" href="teacher_profile.html?id=${prof.id}">See profile</a>
                            </div>
                            <div class="teacher-img">
                                <img src="${prof.photo}" alt="Photo of ${prof.nom}">
                            </div>
                        </div>
                    `;
                    container.innerHTML += profHTML;
                });
            })
            .catch(error => console.error('Error while loading teacher data:', error));
    }
});

// Teacher profile page — loads the teacher matching the URL ?id= parameter,
// then fetches their related articles and injects everything into the page
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const teacherId = parseInt(urlParams.get('id'));
    const container = document.getElementById('teacher_profile');

    if (container) {
        // Fetch both data sources in parallel for better performance
        Promise.all([
            fetch('../json/teacher_data.json').then(response => response.json()),
            fetch('../json/articles_data.json').then(response => response.json())
        ])
            .then(([teachersData, articlesData]) => {
                container.innerHTML = '';

                const teacher = teachersData.find(t => t.id === teacherId);

                if (teacher) {
                    // Keep only the articles whose id is listed in the teacher's article_id array
                    const teacherArticles = articlesData.filter(article =>
                        teacher.article_id && teacher.article_id.includes(article.id)
                    );

                    // Build the articles list HTML, or show a fallback message
                    let articlesHTML = '';
                    if (teacherArticles.length > 0) {
                        articlesHTML = '<ul>' + teacherArticles.map(article => `
                        <li style="margin-bottom: 10px;">
                            <a href="${article.article_page}" style="color: var(--text-dark); font-weight: bold; text-decoration: none;">
                                ${article.title}
                            </a>
                            <br>
                            <span style="font-size: 13px; color: var(--text-gray);">${article.description}</span>
                        </li>
                    `).join('') + '</ul>';
                    } else {
                        articlesHTML = '<p style="color: var(--text-gray); font-style: italic;">No articles published yet.</p>';
                    }

                    container.innerHTML = `
                <div class="profile-hero">
                    <div class="text">
                        <h1>${teacher.nom}</h1>
                        <p>${teacher.formation} teacher</p>
                        <h2>Office hours</h2>
                        <p>${teacher.office_hours}</p>
                    </div>
                    <div class="butterfly-img">
                        <img src="${teacher.photo}" alt="Photo of ${teacher.nom}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">
                    </div>
                </div>
                <div class="profile-cols">
                    <div>
                        <h3>Biography</h3>
                        <p>${teacher.biographie}</p>
                    </div>
                    <div>
                        <h3>See Articles →</h3>
                        ${articlesHTML}
                    </div>
                </div>`;
                } else {
                    container.innerHTML = '<p>Teacher not found.</p>';
                }
            })
            .catch(error => console.error("Error fetching data:", error));
    }
});

// Research page — dynamically renders the article cards from JSON
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('research-list');

    if (container) {
        fetch('../json/articles_data.json')
            .then(response => response.json())
            .then(data => {
                container.innerHTML = '';

                // Create one research card per article entry
                data.forEach(article => {
                    const articleHTML = `
                        <div class="research-card">
                            <div class="research-img">
                                <img src="${article.image}" alt="Image of ${article.title}">
                            </div>
                            <div class="info">
                                <h3>${article.title}</h3>
                                <p>${article.description}</p>
                                <a href="${article.article_page}">See Article</a>
                            </div>
                        </div>
                    `;
                    container.innerHTML += articleHTML;
                });
            })
            .catch(error => console.error('Error while loading article data:', error));
    }
});

// Formations page — groups courses by year, then renders a carousel section for each
document.addEventListener('DOMContentLoaded', () => {
    const formationsContainer = document.getElementById('formations-container');

    if (formationsContainer) {
        fetch('../json/formations_data.json')
            .then(response => response.json())
            .then(data => {
                // Group courses by their 'years' field (e.g. "P1", "ING2")
                const groupedByYear = data.reduce((acc, course) => {
                    if (!acc[course.years]) {
                        acc[course.years] = [];
                    }
                    acc[course.years].push(course);
                    return acc;
                }, {});

                // Display years in a fixed curriculum order
                const yearsOrder = ["P1", "P2", "ING1", "ING2", "ING3"];

                formationsContainer.innerHTML = '';

                yearsOrder.forEach(year => {
                    if (groupedByYear[year] && groupedByYear[year].length > 0) {

                        // Build the card HTML for each course in this year
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

                        // Wrap the cards in a carousel section with prev/next buttons
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
            .catch(error => console.error('Error loading formations data:', error));
    }
});

// Syllabus page — reads the ?id= URL parameter, finds the matching course,
// and injects the full syllabus layout built by buildSyllabus()
document.addEventListener('DOMContentLoaded', () => {
    const root     = document.getElementById('syllabus-root');
    const params   = new URLSearchParams(window.location.search);
    const courseId = parseInt(params.get('id'));

    if (!root) return; // not on the syllabus page

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
            // Update the browser tab title to reflect the selected course
            document.title = `${course.course_code} — ${course.course_name}`;
            root.innerHTML = buildSyllabus(course);
        })
        .catch(() => {
            root.innerHTML = notFound('Could not load course data.');
        });
});