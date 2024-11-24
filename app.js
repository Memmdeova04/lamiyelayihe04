const insertButtons = document.querySelectorAll(".insert-buttons");
const outButtons = document.querySelectorAll('.out-buttons');
const activedInsert = document.querySelector('.active-insert');
const activeOut = document.querySelector('.active-out');
const outInput = document.querySelector('.out-input');
const insertInput = document.querySelector('.insert-input');
const notificationInsert = document.querySelector('.notification-insert');
const notificationOut = document.querySelector('.notification-out');
const errorr = document.getElementById('errorr');
let activeBtnInsert = `RUB`;
let activeBtnOut = 'USD';
insertButtons.forEach((button) => button.addEventListener('click', selectInsert));
outButtons.forEach((button) => button.addEventListener('click', selectOut));

window.addEventListener('online', () => {
    errorr.textContent = ''; 
    errorr.style.color = 'transparent'; 
    if (activeBtnInsert !== activeBtnOut) {
        changeInsert();
    }
});
window.addEventListener('offline', () => {
    errorr.textContent = 'No internet connection'; 
    errorr.style.color = 'red'; 
});

function updateInsertNotification(rate) {
    notificationInsert.textContent = `1 ${activeBtnInsert} = ${rate} ${activeBtnOut}`;
}

function updateOutNotification(rate) {
    notificationOut.textContent = `1 ${activeBtnOut} = ${rate} ${activeBtnInsert}`;
}

function selectInsert(event) {
    if (window.navigator.onLine) {
        if (activeBtnInsert !== event.target.textContent) {
            let clickedButton = event.target;
            insertButtons.forEach((node) => node.classList.remove('active-insert'));
            clickedButton.classList.add("active-insert");
            activeBtnInsert = clickedButton.textContent;
            if (activeBtnInsert !== activeBtnOut && insertInput.value != '') {
                fetch(`https://v6.exchangerate-api.com/v6/810616554d6955ca72afbcad/latest/${activeBtnInsert}`)
                    .then(response => response.json())
                    .then(data => {
                        updateInsertNotification(data.conversion_rates[activeBtnOut]);
                    });
                fetch(`https://v6.exchangerate-api.com/v6/810616554d6955ca72afbcad/latest/${activeBtnOut}`)
                    .then(response => response.json())
                    .then(data => {
                        updateOutNotification(data.conversion_rates[activeBtnInsert]);
                    });
            }
            changeOut();
        }
    } else {
        changeOut();
        errorr.style.color = "red";
        errorr.textContent = 'No internet connection';
    }
}

function selectOut(event) {
    if (window.navigator.onLine) {
        if (activeBtnOut !== event.target.textContent) {
            let clickedButton = event.target;
            outButtons.forEach((node) => node.classList.remove('active-out'));
            clickedButton.classList.add("active-out");
            activeBtnOut = clickedButton.textContent;
            if (activeBtnOut !== activeBtnInsert && outInput.value != '') {
                fetch(`https://v6.exchangerate-api.com/v6/810616554d6955ca72afbcad/latest/${activeBtnOut}`)
                    .then(response => response.json())
                    .then(data => {
                        updateOutNotification(data.conversion_rates[activeBtnInsert]);
                    });
                fetch(`https://v6.exchangerate-api.com/v6/810616554d6955ca72afbcad/latest/${activeBtnInsert}`)
                    .then(response => response.json())
                    .then(data => {
                        updateInsertNotification(data.conversion_rates[activeBtnOut]);
                    });
            }
            changeInsert();
        } else {
            changeInsert();
        }
    } else {
        console.error("No internet connection!");
    }
}

function changeInsert() {
    if (navigator.onLine) {
        if (activeBtnInsert !== activeBtnOut) {
            fetch(`https://v6.exchangerate-api.com/v6/810616554d6955ca72afbcad/latest/${activeBtnInsert}`)
                .then(response => response.json())
                .then(data => {
                    let result = parseFloat(+insertInput.value) * parseFloat(+data.conversion_rates[activeBtnOut]);
                    outInput.value = result.toFixed(4);
                });
        } else {
            outInput.value = insertInput.value;
        }
    } else {
        console.error("No internet connection!");
    }
}

insertInput.addEventListener('keydown', () => {
    if (insertInput.value !== ``) {
        changeInsert();
    } else {
        outInput.value = 0;
    }
});

function changeOut() {
    if (navigator.onLine) {
        if (activeBtnInsert !== activeBtnOut) {
            fetch(`https://v6.exchangerate-api.com/v6/810616554d6955ca72afbcad/latest/${activeBtnOut}`)
                .then(response => response.json())
                .then(data => {
                    let result = parseFloat(+outInput.value) * parseFloat(+data.conversion_rates[activeBtnInsert]);
                    insertInput.value = result.toFixed(4);
                });
        } else {
            insertInput.value = outInput.value;
        }
    } else {
        console.error("No internet connection!");
    }
}

outInput.addEventListener('keyup', () => {
    if (outInput.value !== '') {
        changeOut();
    } else {
        insertInput.value = 0;
    }
});
