/*
        Zhongzhong - A Chinese-English Popup Dictionary
        Copyright (C) 2015 Pablo Roman
        https://chrome.google.com/webstore/detail/dggcgdjndddfmcfoipccicfoajmciacf
*/

function loadVals() {
    var storedValue = localStorage['popupcolor'];
    for (var i = 0; i < document.optform.popupcolor.length; i++) {
        if(document.optform.popupcolor[i].value == storedValue) {
            document.optform.popupcolor[i].selected = true;
            break;
        }
    }

    document.optform.tonecolors.checked = localStorage['tonecolors'] == 'yes';

    document.optform.tone1.value = localStorage['tone1'] || "#ff8080";
    document.optform.tone1.style.color = document.optform.tone1.value;
    document.optform.tone2.value = localStorage['tone2'] || "#80ff80";
    document.optform.tone2.style.color = document.optform.tone2.value;
    document.optform.tone3.value = localStorage['tone3'] || "#8080ff";
    document.optform.tone3.style.color = document.optform.tone3.value;
    document.optform.tone4.value = localStorage['tone4'] || "#df80ff";
    document.optform.tone4.style.color = document.optform.tone4.value;
    document.optform.tone5.value = localStorage['tone5'] || "#ddd";
    document.optform.tone5.style.color = document.optform.tone5.value;

    storedValue = localStorage['fontSize'];
    if(storedValue == 'small') {
        document.optform.fontSize[1].selected = true;
    }
    else {
        document.optform.fontSize[0].selected = true;
    }

    storedValue = localStorage['font'];
    if(storedValue == 'sans') {
        document.optform.font[0].selected = true;
    }
    else if(storedValue == 'serif') {
        document.optform.font[1].selected = true;
    }
    else { // == 'handdrawn'
        document.optform.font[2].selected = true;
    }

    storedValue = localStorage['chars'];
    if(storedValue == 'both') {
        document.optform.chars[0].selected = true;
    }
    else if(storedValue == 'traditional') {
        document.optform.chars[1].selected = true;
    }
    else {
        document.optform.chars[2].selected = true;
    }

    storedValue = localStorage['dicts'];
    if(storedValue == 'engHan') {
        document.optform.dicts[0].selected = true;
    }
    else if(storedValue == 'hanEng') {
        document.optform.dicts[1].selected = true;
    }

    document.optform.zhuyin.checked = localStorage['zhuyin'] == 'yes';

    document.optform.pinyin.checked = localStorage['pinyin'] == 'yes';

    document.optform.definitions.checked = localStorage['definitions'] == 'yes';

    document.optform.grammar.checked = localStorage['grammar'] == 'yes';

    storedValue = localStorage['voice'];
    if(storedValue == 'zh-CN') {
        document.optform.voice[0].selected = true;
    }
    else { // == 'taiwan'
        document.optform.voice[1].selected = true;
    }

    document.optform.enableKey.value = localStorage['enableKey'] || 'Z';
    console.log(document.optform.enableKey.value, localStorage['enableKey'] || 'Z')
}

function storeVals() {
    localStorage['popupcolor'] = document.optform.popupcolor.value;
    chrome.extension.getBackgroundPage().zhongwenMain.config.css = localStorage['popupcolor'];

    localStorage['tonecolors'] = document.optform.tonecolors.checked ? 'yes' : 'no';
    chrome.extension.getBackgroundPage().zhongwenMain.config.tonecolors = localStorage['tonecolors'];

    localStorage['tone1'] = document.optform.tone1.value;
    localStorage['tone2'] = document.optform.tone2.value;
    localStorage['tone3'] = document.optform.tone3.value;
    localStorage['tone4'] = document.optform.tone4.value;
    localStorage['tone5'] = document.optform.tone5.value;
    chrome.extension.getBackgroundPage().zhongwenMain.config.tones = [localStorage['tone1'],
                                                                      localStorage['tone2'],
                                                                      localStorage['tone3'],
                                                                      localStorage['tone4'],
                                                                      localStorage['tone5']];

    localStorage['fontSize'] = document.optform.fontSize.value;
    chrome.extension.getBackgroundPage().zhongwenMain.config.fontSize = localStorage['fontSize'];

    localStorage['font'] = document.optform.font.value;
    chrome.extension.getBackgroundPage().zhongwenMain.config.font = localStorage['font'];

    localStorage['chars'] = document.optform.chars.value;
    chrome.extension.getBackgroundPage().zhongwenMain.config.chars = localStorage['chars'];

    localStorage['dicts'] = document.optform.dicts.value;
    chrome.extension.getBackgroundPage().zhongwenMain.config.dicts = localStorage['dicts'];

    localStorage['zhuyin'] = document.optform.zhuyin.checked ? 'yes' : 'no';
    chrome.extension.getBackgroundPage().zhongwenMain.config.zhuyin = localStorage['zhuyin'];

    localStorage['pinyin'] = document.optform.pinyin.checked ? 'yes' : 'no';
    chrome.extension.getBackgroundPage().zhongwenMain.config.pinyin = localStorage['pinyin'];

    localStorage['definitions'] = document.optform.definitions.checked ? 'yes' : 'no';
    chrome.extension.getBackgroundPage().zhongwenMain.config.definitions = localStorage['definitions'];

    localStorage['grammar'] = document.optform.grammar.checked ? 'yes' : 'no';
    chrome.extension.getBackgroundPage().zhongwenMain.config.grammar = localStorage['grammar'];

    localStorage['voice'] = document.optform.voice.value;
    chrome.extension.getBackgroundPage().zhongwenMain.config.voice = localStorage['voice'];

    localStorage['enableKey'] = document.optform.enableKey.value.toUpperCase();
    console.log(document.optform.enableKey.value.toUpperCase());
    chrome.extension.getBackgroundPage().zhongwenMain.config.enableKey = localStorage['enableKey'];
}

$(function() {
    $('select').change(storeVals);
    $('input').change(storeVals);
    $('input').blur(storeVals);
    $('.tone-color').change(setTextColorToValue);
    $('.tone-color').blur(setTextColorToValue);

    $('#resettonecolors').click(function(event) {
      localStorage['tone1'] = document.optform.tone1.value = '#ff8080';
      document.optform.tone1.style.color = document.optform.tone1.value;
      localStorage['tone2'] = document.optform.tone2.value = '#80ff80';
      document.optform.tone2.style.color = document.optform.tone2.value;
      localStorage['tone3'] = document.optform.tone3.value = '#8080ff';
      document.optform.tone3.style.color = document.optform.tone3.value;
      localStorage['tone4'] = document.optform.tone4.value = '#df80ff';
      document.optform.tone4.style.color = document.optform.tone4.value;
      localStorage['tone5'] = document.optform.tone5.value = '#ddd';
      document.optform.tone5.style.color = document.optform.tone5.value;
    });
});

function setTextColorToValue(event) {
  event.target.style.color = event.target.value;
}


window.onload = loadVals;
