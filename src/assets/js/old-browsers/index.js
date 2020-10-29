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
            var popup = createPopupMarkup(document.getElementById('xm-old-browsers-popup'));
            var supportedList = popup.querySelector('ul');
            var closeButton = popup.querySelector('.close-btn');
            var currentAgent = popup.querySelector('.current-agent');

            for (var listKey in inSupport) {
                if (inSupport.hasOwnProperty(listKey) && inSupport[listKey].show) {
                    var item = document.createElement('li');

                    item.innerHTML = inSupport[listKey].name + ', v' + (inSupport[listKey].showVersion || inSupport[listKey].version);
                    supportedList.appendChild(item);
                }
            }

            closeButton.addEventListener('click', function(e) {
                e.stopPropagation();
                popup.style.display = 'none';
            });

            currentAgent.innerHTML = currentBrowser.name + ', v' + currentBrowser.version;

            popup.style.display = 'table';
        }
    }

    function createPopupMarkup(popup) {
        popup.style.cssText = 'display: table;' +
            '  table-layout: fixed;' +
            '  position: fixed;' +
            '  top: 0;' +
            '  left: 0;' +
            '  width: 100%;' +
            '  height: 100%;' +
            '  background-color: rgba(255, 255, 255, .75);' +
            '  z-index: 10000;';

        var wrapper = document.createElement('div');
        wrapper.style.cssText = 'vertical-align: middle; display: table-cell;';
        popup.appendChild(wrapper)

        var content = document.createElement('div');
        content.style.cssText = 'margin: auto;' +
            '  max-width: 850px;' +
            '  padding: 30px 30px 0;' +
            '  background-color: #fff;' +
            '  border: 2px solid #f00;' +
            '  font-size: 1.2em;' +
            '  font-weight: 400;';
        wrapper.appendChild(content);

        var contentTags = getTranslatedContentTags(window.navigator.language);

        for (var i = 0; i < contentTags.length; i++) {
            content.insertAdjacentHTML('beforeend', contentTags[i]);
        }

        return popup;
    }

    function getTranslatedContentTags(browserLang) {
        var lang;
        switch (browserLang) {
            case 'uk-UA': lang = 'uk-UA'; break;
            case 'ru-RU': lang = 'uk-UA'; break;
            default: lang = 'en-US';
        }

        var i18n = {
            'en-US': {
                warn: 'Warning: ',
                outdated: 'Current browser version is outdated or not supported by application and may not work properly.',
                request: 'Please update your browser version to the following minimal versions:',
                current: 'Your current version is: ',
                close: 'Close',
            },
            'uk-UA': {
                warn: 'Увага: ',
                outdated: 'Поточна версія браузера застаріла або не підтримується додатком, і, можливо, вона не працюватиме належним чином.',
                request: 'Будь ласка, оновіть версію вашого браузера до однієї з наступних підтримуваних версій:',
                current: 'Ваша поточна версія: ',
                close: 'Закрити',
            },
            'ru-RU': {
                warn: 'Предупреждение: ',
                outdated: 'Текущая версия браузера устарела или не поддерживается приложением и может работать некорректно.',
                request: 'Пожалуйста, обновите версию вашего браузера до одной из следующих минимальных версий:',
                current: 'Ваша текущая версия:',
                close: 'Закрыть',
            },
        }

        return [
            '<p><strong>' + i18n[lang].warn + '</strong>' + i18n[lang].outdated + '</p>',
            '<p>' + i18n[lang].request + '</p>',
            '<ul></ul>',
            i18n[lang].current + '<span class="current-agent" style="text-decoration: underline;"></span>',
            '<button class="btn btn-primary close-btn" style="display: block; margin: 10px auto 30px;">' + i18n[lang].close + '</button>'
        ];
    }
}());
