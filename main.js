/*
    Zhongzhong - A Chinese-English Popup Dictionary
    Copyright (C) 2015 Pablo Roman
    https://chrome.google.com/webstore/detail/dggcgdjndddfmcfoipccicfoajmciacf

    ---

    Originally based on Zhongwen 4.0.1
    Copyright (C) 2011 Christian Schiller
    https://chrome.google.com/extensions/detail/kkmlkkjojmombglmlpbpapmhcaljjkde

    ---

    Originally based on Rikaikun 0.8
    Copyright (C) 2010 Erek Speed
    http://code.google.com/p/rikaikun/

    ---

    Originally based on Rikaichan 1.07
    by Jonathan Zarate
    http://www.polarcloud.com/

    ---

    Originally based on RikaiXUL 0.4 by Todd Rudick
    http://www.rikai.com/
    http://rikaixul.mozdev.org/

    ---

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA

    ---

    Please do not change or remove any of the copyrights or links to web pages
    when modifying any of the files.

*/
var zhongwenMain = {

  altView: 0,
  enabled: 0,

  tabIDs: {},

    miniHelp:
  '<span style="font-weight: bold;">Zhongzhong Chinese-English Dictionary&nbsp;&nbsp;&nbsp;</span>'+
  '<hr style="margin: 10px 0px!important">' +
  '<span style="font-style: italic; margin-bottom:10px!important;">In order to make Zhongzhong work in input fields and text areas,<br>' +
  ' hold down the Alt-key on your keyboard.</span><br>' +
  '<hr style="margin: 10px 0px!important">' +
  'Keyboard actions' +
  '<p>' +
  '<table cellspacing=5 cellpadding=5>' +
  '<tr><td><b>Alt + ' + localStorage['enableKey'] + '&nbsp;:</b></td><td style="font-weight: bold;">&nbsp;Enable/Disable Zhongzhong</td></tr>' +
  '<tr><td>R&nbsp;</td><td>&nbsp;Read word aloud</td></tr>' +
  '<tr><td>C&nbsp;</td><td>&nbsp;Copy to clipboard</td></tr>' +
  '<tr><td>Alt + S&nbsp;</td><td>&nbsp;Save word to the internal word list</td></tr>' +
  '<tr><td>Alt + W&nbsp;</td><td>&nbsp;Show the word list</td></tr>' +
  '</table>',

  loadDictionary: function() {
    if (!this.dict) {
      this.dict = new zhongwenDict();
      return this.dict.donePromise;
    }
    return Promise.resolve();
  },

  // The callback for onSelectionChanged.
  // Just sends a message to the tab to enable itself if it hasn't
  // already.
  onTabSelect: function(tabId) {
    zhongwenMain._onTabSelect(tabId);
  },
  _onTabSelect: function(tabId) {
    if ((this.enabled == 1))
      chrome.tabs.sendRequest(tabId, {
        "type":"enable",
        "config":zhongwenMain.config
      });
  },

  enable: function(tab) {
    localStorage['enabled'] = 1;

    if (!this.dict) {
      this.loadDictionary()
      .then(() => {
        this.chromeSetup(tab);
      })
      .catch(err => {
        alert('Error loading dictionary: ' + err);
      });
    }
  },

  chromeSetup: function(tab) {
    // Send message to current tab to add listeners and create stuff
    chrome.tabs.sendRequest(tab.id, {
      "type": "enable",
      "config": zhongwenMain.config
    });
    zhongwenMain.enabled = 1;

    chrome.tabs.sendRequest(tab.id, {
      "type": "showPopup",
      "text": zhongwenMain.miniHelp,
      "isHelp": true
    });

    chrome.browserAction.setBadgeBackgroundColor({
      "color": [255, 0, 0, 255]
    });

    chrome.browserAction.setBadgeText({
      "text": "On"
    });

    chrome.contextMenus.create(
    {
      title: "Open word list",
      onclick: function() {
        var url = chrome.extension.getURL("/wordlist.html");
        var tabID = zhongwenMain.tabIDs['wordlist'];
        if (tabID) {
          chrome.tabs.get(tabID, function(tab) {
            if (tab && (tab.url.substr(-13) == 'wordlist.html')) {
              chrome.tabs.reload(tabID);
              chrome.tabs.update(tabID, {
                active: true
              });
            } else {
              chrome.tabs.create({
                url: url
              }, function(tab) {
                zhongwenMain.tabIDs['wordlist'] = tab.id;
                chrome.tabs.reload(tab.id);
              });
            }
          });
        } else {
          chrome.tabs.create({
            url: url
          }, function(tab) {
            zhongwenMain.tabIDs['wordlist'] = tab.id;
            chrome.tabs.reload(tab.id);
          });
        }
      },
      contexts: ['all']
    });
  },

  disable: function(tab) {

    localStorage['enabled'] = 0;

    // Delete dictionary object after we implement it
    delete this.dict;

    zhongwenMain.enabled = 0;
    chrome.browserAction.setBadgeBackgroundColor({
      "color": [0,0,0,0]
    });
    chrome.browserAction.setBadgeText({
      "text": ""
    });

    // Send a disable message to all browsers.
    var windows = chrome.windows.getAll({
      "populate": true
    },
    function(windows) {
      for (var i =0; i < windows.length; ++i) {
        var tabs = windows[i].tabs;
        for ( var j = 0; j < tabs.length; ++j) {
          chrome.tabs.sendRequest(tabs[j].id, {
            "type":"disable"
          });
        }
      }
    });

    chrome.contextMenus.removeAll();
  },

  enableToggle: function(tab) {
    if (zhongwenMain.enabled) {
      zhongwenMain.disable(tab);
    } else {
      zhongwenMain.enable(tab);
    }
  },

  search: function(text, dict) {
    if (dict === 0) {
      var entry = this.dict.wordSearch(text);
      if (entry != null) {
        let toBottom = [];
        for (var i = 0; i < entry.data.length; i++) {
          
          let word = entry.data[i][1];
          if (this.dict.hasKeyword(word) && (entry.matchLen == word.length)) {
            // the final index should be the last one with the maximum length
            entry.grammar = { keyword: word, index: i };
          }
          
          // Hide classifiers
          entry.data[i][0] = entry.data[i][0].replace(/CL:(.+?)\//g,"");
          
          // Move names to bottom
          if (entry.data.length > 1) {
            let isName = entry.data[i][0].match("name");
            if (isName) {
              toBottom.push(i);
            }
          }
        }

        // Splice and put them at the end in correct order
        let l = toBottom.length;
        if (l > 0) {
          let s = [];
          for (let i = l-1; i >= 0; i--) {
            s.push(entry.data.splice(toBottom[i], 1)[0]);
          }
          while (s.length > 0) {
            entry.data.push(s.pop());
          }
        }
        
      }
      return entry;
    } else if (dict === 1) {
      var entry = this.dict.hanziSearch(text.charAt(0));
      return entry;
    }

  }
};
