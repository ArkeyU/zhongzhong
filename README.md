# Zhongzhong

~~Fork~~ of the Zhongzhong chrome extension that translates Chinese words when hovering on them.

Original: https://github.com/PabloRomanH/zhongzhong

## Dictionary update

Prerequisites: Node.js

1. Clone the repo

```shell
git clone https://github.com/ArkeyU/zhongzhong.git
cd zhongzhong/data
```

2. Download a new version of [CC-CEDICT](https://www.mdbg.net/chinese/dictionary?page=cc-cedict)

```shell
wget https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.zip 
unzip cedict_1_0_ts_utf-8_mdbg.zip
```

3. Run the script `indexdict.js`

```shell
node indexdict.js
```

## Installation
Clone and load it unpacked or pack it.
