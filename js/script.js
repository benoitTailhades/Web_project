
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
    var grid = document.getElementById('cal-grid');
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
