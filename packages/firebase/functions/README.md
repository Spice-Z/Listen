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
registerChannel({url:"${rssのURL}"})
```