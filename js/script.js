document.addEventListener('DOMContentLoaded', () => {
    const underline = document.querySelector('.nav-underline');
    const items = document.querySelectorAll('.nav-item');
    const activeItem = document.querySelector('.nav-item.active');

    function moveUnderline(element) {
        if (element) {
            underline.style.left = element.offsetLeft + "px";
            underline.style.width = element.offsetWidth + "px";
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
    // Build calendar grid

function buildCalendar() {
        var container = document.querySelector('.planning');
        if (!container) {
            return;
        }

        var hours = [];
        for (let h = 7; h <= 17; h++) {
            hours.push(h < 12 ? h + ' AM' : (h === 12 ? '12 PM' : (h-12) + ' PM'));
        }
        const events = {
        'MON-8':  [{cls:'event-blue',   t:'8:00 AM ●', b:'Monday Wake-Up Hour',h:1}],
        'MON-9':  [{cls:'event-blue',   t:'9:00 AM ●', b:'All-Team Kickoff',h:1}],
        'MON-10': [{cls:'event-blue',   t:'10:00 AM ●',b:'Financial Update',h:1}],
        'MON-11': [{cls:'event-blue',   t:'11:00 AM ●',b:'😋 New Employee Welcome Lunch!',h:1}],
        'MON-13': [{cls:'event-blue',   t:'1:00 PM ●', b:'Design Review',h:1}],
        'MON-14': [{cls:'event-yellow', t:'2:00 PM ●', b:'1:1 with Jon',h:1}],
        'TUE-9':  [{cls:'event-blue',   t:'9:00 AM ●', b:'Design Review: Acme Marketi...',h:2}],
        'TUE-12': [{cls:'event-green',  t:'12:00 PM ●',b:'😋 Design System Kickoff Lunch',h:1}],
        'TUE-14': [{cls:'event-blue',   t:'2:00 PM ●', b:'Concept Design Review II',h:1}],
        'TUE-16': [{cls:'event-red',    t:'4:00 PM ●', b:'🚀 Design Team Happy Hour',h:1}],
        'WED-9':  [{cls:'event-purple', t:'9:00 AM ●', b:'Webinar: Figma ...',h:1}],
        'WED-11': [{cls:'event-purple', t:'11:00 AM ●',b:'Onboarding Presentation',h:1}],
        'WED-13': [{cls:'event-purple', t:'1:00 PM ●', b:'MVP Prioritization Workshop',h:1}],
        'THU-9':  [{cls:'event-blue',   t:'9:00 AM ●', b:'☕ Coffee Chat',h:1}],
        'THU-10': [{cls:'event-purple', t:'10:00 AM ●',b:'Health Benefits Walkthrough',h:1}],
        'THU-13': [{cls:'event-blue',   t:'1:00 PM ●', b:'Design Review',h:2}],
        'FRI-9':  [{cls:'event-blue',   t:'9:00 AM ●', b:'☕ Coffee Chat',h:1}],
        'FRI-12': [{cls:'event-green',  t:'12:00 PM ●',b:'😋 Marketing Meet-and-Greet',h:1}],
        'FRI-14': [{cls:'event-yellow', t:'2:00 PM ●', b:'1:1 with Heather',h:1}],
        'FRI-16': [{cls:'event-pink',   t:'4:00 PM ●', b:'❤ Happy Hour',h:1}],
        };
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

document.addEventListener('DOMContentLoaded', buildCalendar)

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
