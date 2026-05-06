console.log("Console here!");

function quizAlert() {
    var name = document.getElementById("name").value;
    var surname = document.getElementById("surname").value;
    var birth = document.getElementById("birth").value;
    var email = document.getElementById("email").value;
    var status = document.getElementById("status").value;

    if (name === "" || surname === "" || birth === "" || email === "" || status === "") {
        alert("Fill all the fields sleepy head!");
        return;
    }

    alert("You're about to start the quiz!");
    quizConfirm();
}

function quizConfirm() {
    var res = confirm("Are you sure you want to continue?");

    if (res == true) {
        alert("Quiz starting in 5 seconds starting after closing the tab!");

        document.getElementById("information").disabled = true;
        document.getElementById("startBtn").style.display = "none";

        var timer = 5;
        var confirmation = document.createElement("p");
        confirmation.textContent = timer + " seconds";
        confirmation.style.color = "red";
        confirmation.style.fontSize = "1.5em";
        confirmation.style.fontWeight = "bold";
        confirmation.style.textAlign = "center";

        var start = document.getElementById("information");
        start.appendChild(confirmation);

        var interval = setInterval(function () {
            timer--;
            console.log(timer);
            confirmation.textContent = timer + " seconds";

            if (timer == 0) {
                clearInterval(interval);
                confirmation.textContent = "Good luck for the test!";
                document.getElementsByClassName("quiz")[0].style.display = "block";
                document.getElementsByTagName("button")[0].style.display = "block";
            }
        }, 1000);

    } else {
        alert("You will be redirected to the home page!");
        window.location.href = "Home.html";
    }
}

var attemptCount = 0;

function submitQuiz() {
    attemptCount++;
    var score = 0;

    var q1Answers = document.getElementsByName("q1");
    for (var i = 0; i < q1Answers.length; i++) {
        if (q1Answers[i].checked && q1Answers[i].value === "A") {
            score += 4;
        }
    }

    if (document.getElementById("q2_1").checked) score += 3;
    if (document.getElementById("q2_2").checked) score += 3;
    if (document.getElementById("q2_3").checked) score -= 3;

    var q3Text = document.getElementById("Q3").value.toLowerCase();
    var keywords = ["pollution maximization"];

    for (var j = 0; j < keywords.length; j++) {
        if (q3Text.includes(keywords[j])) {
            score += 10;
            break;
        }
    }

    var tbody = document.querySelector("#result tbody");
    var row = document.createElement("tr");
    var cellAttempt = document.createElement("td");
    var cellScore = document.createElement("td");

    cellAttempt.textContent = attemptCount;
    cellScore.textContent = score;

    row.appendChild(cellAttempt);
    row.appendChild(cellScore);
    tbody.appendChild(row);

    var radioBtns = document.querySelectorAll('input[type="radio"]');
    radioBtns.forEach(btn => btn.checked = false);

    var checkBtns = document.querySelectorAll('input[type="checkbox"]');
    checkBtns.forEach(btn => btn.checked = false);

    document.getElementById("Q3").value = "";

    if (attemptCount >= 3) {
        var submitBtn = document.querySelector('button.quiz');
        submitBtn.disabled = true;
        submitBtn.style.backgroundColor = "grey";
        alert("You consumed all 3 of your attempts !");
    }
}