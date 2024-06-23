// Lấy các phần tử HTML
const hoursInput = document.getElementById("hoursInput");
const minutesInput = document.getElementById("minutesInput");
const secondsInput = document.getElementById("secondsInput");
const hoursDisplay = document.querySelector(".hours");
const minutesDisplay = document.querySelector(".minutes");
const secondsDisplay = document.querySelector(".seconds");
const startButton = document.querySelector("#startBtn")

let countdownInterval; // Biến để lưu setInterval

startButton.addEventListener("click", startCountdown);

function startCountdown() {
    if (hoursInput.value == "")
        hoursInput.value = 0;
    if (minutesInput.value == "")
        minutesInput.value = 0;
    if (secondsInput.value == "")
        secondsInput.value = 0;
    // Lấy giá trị từ input và chuyển đổi thành tổng số giây
    let totalSeconds = (
        parseInt(hoursInput.value) * 3600 +
        parseInt(minutesInput.value) * 60 +
        parseInt(secondsInput.value)
    );

    if (totalSeconds <= 0 || totalSeconds === 0) {
        alert("Please enter a correct input");
        hoursInput.value = "";
        minutesInput.value = "";
        secondsInput.value = "";
        setTimeout(() => { location.reload(); }, 400);
        return;
    }

    clearInterval(countdownInterval); // Xóa countdown cũ nếu có

    updateDisplay(totalSeconds); // Cập nhật hiển thị lần đầu

    countdownInterval = setInterval(() => {
        totalSeconds--;
        updateDisplay(totalSeconds);

        if (totalSeconds <= 0) {
            clearInterval(countdownInterval);
            const alarmSound = document.getElementById("alarmSound");
            alarmSound.play();
            // alert("It's TIME!!!");
        }
    }, 1000);
}

function updateDisplay(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    hoursDisplay.textContent = pad(hours);
    minutesDisplay.textContent = pad(minutes);
    secondsDisplay.textContent = pad(seconds);
}

function pad(number) {
    return (number < 10 ? "0" : "") + number;
}

const playerContainer = document.getElementById("playerContainer");
let isDragging = false;
let offsetX, offsetY;

playerContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - playerContainer.offsetLeft;
    offsetY = e.clientY - playerContainer.offsetTop;
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        playerContainer.style.left = (e.clientX - offsetX) + "px";
        playerContainer.style.top = (e.clientY - offsetY) + "px";
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});
