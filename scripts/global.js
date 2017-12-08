function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            oldonload();
            func();
        }
    }
}

function load() {
    var more = document.querySelector('.loader'),
        moreTop = more.offsetTop,
        windowHeight = document.body.offsetHeight,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop,
        goTop = document.querySelector('.scroll-to-top');

    if (scrollTop > 300) {
        goTop.style.display = 'block';
    } else {
        goTop.style.display = 'none';
    }

    return moreTop < windowHeight + scrollTop;
}

function getNewContent(callback, name) {
    var request = new XMLHttpRequest(),
        json = '';
    if (request) {
        request.open('GET', name, true);
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                json = request.responseText;
                callback(JSON.parse(json));
            }
        };
        request.send(null);
    }
}

function choice(arr) {
    var res = [];
    for (var i = 0, len = arr.length; i < 21; i++) {
        res.push(arr[Math.floor(Math.random() * len)]);
    }
    return res;
}
