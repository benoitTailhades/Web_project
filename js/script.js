
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const el = document.getElementById('page-' + id);
    if (el) { el.classList.add('active'); }
    window.scrollTo(0,0);
    document.querySelectorAll('nav ul a').forEach(a => a.classList.remove('active'));
}

    // Build calendar grid
(
    function buildCalendar() {
    var hours = [];
    for (var h = 7; h <= 17; h++) {
        hours.push(h < 12 ? h + ' AM' : (h === 12 ? '12 PM' : (h-12) + ' PM'));
    }
    var events = {
    'MON-8':  [{cls:'event-blue',   t:'8:00 AM ●', b:'Monday Wake-Up Hour'}],
    'MON-9':  [{cls:'event-blue',   t:'9:00 AM ●', b:'All-Team Kickoff'}],
    'MON-10': [{cls:'event-blue',   t:'10:00 AM ●',b:'Financial Update'}],
    'MON-11': [{cls:'event-blue',   t:'11:00 AM ●',b:'😋 New Employee Welcome Lunch!'}],
    'MON-13': [{cls:'event-blue',   t:'1:00 PM ●', b:'Design Review'}],
    'MON-14': [{cls:'event-yellow', t:'2:00 PM ●', b:'1:1 with Jon'}],
    'TUE-9':  [{cls:'event-blue',   t:'9:00 AM ●', b:'Design Review: Acme Marketi...'}],
    'TUE-12': [{cls:'event-green',  t:'12:00 PM ●',b:'😋 Design System Kickoff Lunch'}],
    'TUE-14': [{cls:'event-blue',   t:'2:00 PM ●', b:'Concept Design Review II'}],
    'TUE-16': [{cls:'event-red',    t:'4:00 PM ●', b:'🚀 Design Team Happy Hour'}],
    'WED-9':  [{cls:'event-purple', t:'9:00 AM ●', b:'Webinar: Figma ...'}],
    'WED-11': [{cls:'event-purple', t:'11:00 AM ●',b:'Onboarding Presentation'}],
    'WED-13': [{cls:'event-purple', t:'1:00 PM ●', b:'MVP Prioritization Workshop'}],
    'THU-9':  [{cls:'event-blue',   t:'9:00 AM ●', b:'☕ Coffee Chat'}],
    'THU-10': [{cls:'event-purple', t:'10:00 AM ●',b:'Health Benefits Walkthrough'}],
    'THU-13': [{cls:'event-blue',   t:'1:00 PM ●', b:'Design Review'}],
    'FRI-9':  [{cls:'event-blue',   t:'9:00 AM ●', b:'☕ Coffee Chat'}],
    'FRI-12': [{cls:'event-green',  t:'12:00 PM ●',b:'😋 Marketing Meet-and-Greet'}],
    'FRI-14': [{cls:'event-yellow', t:'2:00 PM ●', b:'1:1 with Heather'}],
    'FRI-16': [{cls:'event-pink',   t:'4:00 PM ●', b:'❤ Happy Hour'}],
    };
    var days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const now = new Date();
    const currentDay = days[now.getDay()];

    var daylabel = document.querySelectorAll('.day-label');
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
                cell.appendChild(evEl);
                });
            }
            grid.appendChild(cell);
        }
    }
})();
