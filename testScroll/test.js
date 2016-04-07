window.onload = function () {
    var block_count = 1;
    var add_state = false;
    var addBlockContent = function (count) {
        var i, div, red, green, blue;
        for(i = 0; i < count; i++) {
            div = document.createElement('div');
            red = Math.floor(Math.random() * 256);
            green = Math.floor(Math.random() * 256);
            blue = Math.floor(Math.random() * 256);

            div.style = 'background-color: rgba(' + red + ', ' + green + ', ' + blue + ', 1);';
            div.className = 'block-content';
            div.innerText = block_count++;
            document.body.appendChild(div);
        }
    };

    addBlockContent(20);
    window.onscroll = function (e) {
        //console.log('clientHeight: ' + document.body.clientHeight + '\n' +
                    //'offsetHeight: ' + document.body.offsetHeight + '\n' +
                    //'scrollHeight: ' + document.body.scrollHeight);
        if(document.body.scrollTop + document.body.clientHeight >= document.body.scrollHeight && !add_state) {
            add_state = true;
            console.log('刷新');
            setTimeout(function () {
                var count = Math.floor(Math.random() * 20);
                console.log('刷新, 新增' + count + '条');
                addBlockContent(count);
                add_state = false;
            }, 2000);
        }
    };
};
