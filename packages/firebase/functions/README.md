## firebase-functions を格納するディレクトリ

### deploy方法

firebase CLIを設定した上で、以下のコマンドを実行する。
predployでtsのビルドを行うので、事前のビルドはしなくてもよい。

```bash
npm run deploy
```

### 新規チャンネル登録方法

```bash
npm run shell
```
で実行可能にして
```bash
registerChannel({url:"http://www3.nhk.or.jp/rj/podcast/rss/english.xml"})
```

### 文字起こし

`generateTranscriptFromIds({channelId:"bZuaK9TVO0HcWlBQADHX", episodeId:"WWFYwFhNTSVbU0amudhz"})`

### 翻訳

`generateTranslatedTranscript({channelId:"bZuaK9TVO0HcWlBQADHX", episodeId:"WWFYwFhNTSVbU0amudhz", langCode:"ja"})`
