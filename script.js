let array = [];
let speed = 500;
let isSorting = false;
let isPaused = false;

// ✅ Run after DOM loads
window.onload = function () {
    document.getElementById("speedSlider").addEventListener("input", function () {
        speed = 1100 - this.value; // 🔥 invert speed
    });
};

function generateArray() {
    const container = document.getElementById("array-container");
    container.innerHTML = "";
    array = [];

    for (let i = 0; i < 8; i++) {
        let value = Math.floor(Math.random() * 100) + 10;
        array.push(value);

        let bar = document.createElement("div");
        bar.classList.add("bar");
        bar.innerText = value;

        container.appendChild(bar);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort() {
    let bars = document.getElementsByClassName("bar");

    for (let i = 0; i < array.length; i++) {
        if (!isSorting) return;
        await waitWhilePaused();

        for (let j = 0; j < array.length - i - 1; j++) {
            if (!isSorting) return;
            await waitWhilePaused();

            // 🔴 Compare
            bars[j].style.backgroundColor = "red";
            bars[j + 1].style.backgroundColor = "red";

            bars[j].style.transform = "translateY(-20px)";
            bars[j + 1].style.transform = "translateY(-20px)";

            await sleep(speed);

            // 🟡 Swap using common function
            if (array[j] > array[j + 1]) {
                await highlightAndSwap(j, j + 1, bars);
            }

            // 🔵 Reset
            bars[j].style.backgroundColor = "blue";
            bars[j + 1].style.backgroundColor = "blue";

            bars[j].style.transform = "translateY(0px)";
            bars[j + 1].style.transform = "translateY(0px)";
        }

        // 🟢 Sorted
        bars[array.length - i - 1].style.backgroundColor = "green";
    }
}

function getUserArray() {
    let input = document.getElementById("arrayInput").value.trim();
    const container = document.getElementById("array-container");

    if (input !== "" && input.split(",").some(x => isNaN(x))) {
        alert("Please enter valid numbers separated by commas");
        return false;
    }

    if (input === "") return true;

    array = input.split(",").map(Number).slice(0, 8);

    container.innerHTML = "";

    array.forEach(value => {
        let bar = document.createElement("div");
        bar.classList.add("bar");
        bar.innerText = value;
        container.appendChild(bar);
    });

    return true;
}

async function startSorting() {
    document.getElementById("pauseBtn").disabled = false;

    let input = document.getElementById("arrayInput").value.trim();

    if (input === "" && array.length === 0) {
        alert("Please enter values or generate an array first!");
        return;
    }

    let valid = getUserArray();
    if (!valid) return;

    let algo = document.getElementById("algorithm").value;

    // ✅ Start sorting
    isSorting = true;

    // 🔒 Disable all except stop
    document.getElementById("generateBtn").disabled = true;
    document.getElementById("sortBtn").disabled = true;
    document.getElementById("algorithm").disabled = true;
    document.getElementById("arrayInput").disabled = true;

    document.getElementById("stopBtn").disabled = false;

    if (algo === "bubble") {
        await bubbleSort();
    } else if (algo === "selection") {
        await selectionSort();
    } else if (algo === "insertion") {
        await insertionSort();
    }

    // ✅ Enable everything after finish
    document.getElementById("generateBtn").disabled = false;
    document.getElementById("sortBtn").disabled = false;
    document.getElementById("algorithm").disabled = false;
    document.getElementById("arrayInput").disabled = false;

    document.getElementById("stopBtn").disabled = true;

    document.getElementById("pauseBtn").disabled = true;
    isPaused = false;
    document.getElementById("pauseBtn").innerText = "Pause";
}

function stopSorting() {
    isSorting = false;
    isPaused = false;

    document.getElementById("pauseBtn").innerText = "Pause";
}
async function selectionSort() {
    let bars = document.getElementsByClassName("bar");

    for (let i = 0; i < array.length; i++) {
        if (!isSorting) return;
        await waitWhilePaused();

        let minIndex = i;

        // 🟣 Current position
        bars[i].style.backgroundColor = "purple";

        for (let j = i + 1; j < array.length; j++) {
            if (!isSorting) return;
            await waitWhilePaused();

            // 🔴 Compare
            bars[j].style.backgroundColor = "red";
            await sleep(speed);

            if (array[j] < array[minIndex]) {
                bars[minIndex].style.backgroundColor = "blue";
                minIndex = j;
                bars[minIndex].style.backgroundColor = "yellow";
            } else {
                bars[j].style.backgroundColor = "blue";
            }
        }

        // 🟡 Swap using common function
        if (minIndex !== i) {
            await highlightAndSwap(i, minIndex, bars);
        }

        // 🟢 Sorted
        bars[i].style.backgroundColor = "green";
    }
}

async function insertionSort() {
    let bars = document.getElementsByClassName("bar");

    for (let i = 1; i < array.length; i++) {
        if (!isSorting) return;
        await waitWhilePaused();

        let key = array[i];
        let j = i - 1;

        bars[i].style.backgroundColor = "purple";
        await sleep(speed);

        while (j >= 0 && array[j] > key) {
            if (!isSorting) return;
            await waitWhilePaused();

            // ⛔ stop floating
            bars[j].style.animation = "none";
            bars[j + 1].style.animation = "none";

            // 🟡 highlight
            bars[j].style.backgroundColor = "yellow";
            bars[j + 1].style.backgroundColor = "yellow";

            bars[j].style.color = "#003366";
            bars[j + 1].style.color = "#003366";

            // ⬆️ lift
            bars[j].style.transform = "translateY(-25px)";
            bars[j + 1].style.transform = "translateY(-25px)";

            await sleep(speed);

            // 🔁 shift
            array[j + 1] = array[j];
            bars[j + 1].innerText = array[j];

            await sleep(speed);

            // ⬇️ drop
            bars[j].style.transform = "translateY(0px)";
            bars[j + 1].style.transform = "translateY(0px)";

            // reset
            bars[j].style.backgroundColor = "blue";
            bars[j + 1].style.backgroundColor = "blue";

            bars[j].style.color = "white";
            bars[j + 1].style.color = "white";

            // resume floating
            bars[j].style.animation = "floaty 3s ease-in-out infinite";
            bars[j + 1].style.animation = "floaty 3s ease-in-out infinite";

            j--;
        }

        // 🟡 insert key
        array[j + 1] = key;
        bars[j + 1].innerText = key;

        bars[j + 1].style.backgroundColor = "yellow";
        bars[j + 1].style.color = "#003366";

        await sleep(speed);

        bars[j + 1].style.color = "white";

        // 🟢 sorted part
        for (let k = 0; k <= i; k++) {
            bars[k].style.backgroundColor = "green";
        }
    }
}

function togglePause() {
    isPaused = !isPaused;

    let btn = document.getElementById("pauseBtn");
    btn.innerText = isPaused ? "Resume" : "Pause";
}

async function waitWhilePaused() {
    while (isPaused) {
        await sleep(100);
    }
}

async function highlightAndSwap(i, j, bars) {

    // ⛔ stop floating
    bars[i].style.animation = "none";
    bars[j].style.animation = "none";

    // 🟡 highlight
    bars[i].style.backgroundColor = "yellow";
    bars[j].style.backgroundColor = "yellow";

    // ✅ TEXT COLOR FIX
    bars[i].style.color = "#003366";
    bars[j].style.color = "#003366";

    // ⬆️ lift
    bars[i].style.transform = "translateY(-30px)";
    bars[j].style.transform = "translateY(-30px)";

    await sleep(speed);

    // 🔁 swap
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;

    bars[i].innerText = array[i];
    bars[j].innerText = array[j];

    await sleep(speed);

    // ⬇️ drop
    bars[i].style.transform = "translateY(0px)";
    bars[j].style.transform = "translateY(0px)";

    // 🔵 reset color back
    bars[i].style.color = "white";
    bars[j].style.color = "white";

    // ✅ resume floating
    bars[i].style.animation = "floaty 3s ease-in-out infinite";
    bars[j].style.animation = "floaty 3s ease-in-out infinite";
}

function swapNodes(i, j) {
    const container = document.getElementById("array-container");
    let nodes = container.children;

    let node1 = nodes[i];
    let node2 = nodes[j];

    let temp = document.createElement("div");

    container.insertBefore(temp, node1);
    container.insertBefore(node1, node2);
    container.insertBefore(node2, temp);
    container.removeChild(temp);
}