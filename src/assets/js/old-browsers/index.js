(function(){
    // using vars for variables declaration in old browsers

    var inSupport = {
        edge: { name: 'Edge', version: 18, show: true, showVersion: 44 }, // Edge 44 equals Edge/18.18363 in userAgent
        msie2: { name: 'MSIE', version: 11, show: true },
        msie: { name: 'IE', version: 11, show: false },
        chrome: { name: 'Chrome', version: 83, show: true },
        opera: { name: 'Opera', version: 66, show: true },
        firefox: { name: 'Firefox', version: 78, show: true },
        safari: { name: 'Safari', version: 13, show: true },
        // netscape: { name: 'Netscape', version: 5, show: false },
    };

    var currentBrowser = (function() {
        var ua = window.navigator.userAgent;
        var temp;
        var matched = ua.match(
            /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
        ) || [];

        if (/trident/i.test(matched[1])) {
            temp = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return { name: 'IE', version: temp[1] || '' };
        }

        // notice that Edge on Chromium engine has userAgent like "Edg/84.0.522.52" (without 'e'), and will return ['Chrome', 84]
        if (matched[1] === 'Chrome') {
            temp = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (temp) {
                return {
                    name: temp[1].replace('OPR', 'Opera'),
                    version: temp[2],
                };
            }
        }

        matched = matched[2] ? [matched[1], matched[2]] : [navigator.appName, navigator.appVersion, '-?'];

        temp = ua.match(/version\/(\d+)/i);
        if (temp) {
            matched.splice(1, 1, temp[1]);
        }

        return { name: matched[0], version: matched[1] };
    }());

    for (var key in inSupport) {
        if (
            inSupport.hasOwnProperty(key) &&
            inSupport[key].name === currentBrowser.name &&
            inSupport[key].version > parseInt(currentBrowser.version)
        ) {
            // run all actions only if old browser detected
            var wrapper = document.getElementById('xm-old-browsers-popup');
            var supportedList = wrapper.querySelector('.supported');
            var closeButton = wrapper.querySelector('button');
            var currentAgent = wrapper.querySelector('.current-agent');

            for (var listKey in inSupport) {
                if (inSupport.hasOwnProperty(listKey) && inSupport[listKey].show) {
                    var item = document.createElement('li');

                    item.innerHTML = inSupport[listKey].name + ', v' + (inSupport[listKey].showVersion || inSupport[listKey].version);
                    supportedList.appendChild(item);
                }
            }

            closeButton.addEventListener('click', function(e) {
                e.stopPropagation();
                wrapper.style.display = 'none';
            });

            currentAgent.innerHTML = currentBrowser.name + ', v' + currentBrowser.version;

            wrapper.style.display = 'block';
        }
    }
}());
