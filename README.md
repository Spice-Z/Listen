# Expo Router Example

Use [`expo-router`](https://expo.github.io/router) to build native navigation using files in the `app/` directory.

## 🚀 How to use

```sh
npx create-react-native-app -t with-router
```

## 📝 Notes

- [Expo Router: Docs](https://expo.github.io/router)
- [Expo Router: Repo](https://github.com/expo/router)
- [Request for Comments](https://github.com/expo/router/discussions/1)


ニュースコネクト
`registerChannel({url:"https://anchor.fm/s/81fb5eec/podcast/rss"})`

Global News Podcast - BBC World Service
`registerChannel({url:"https://podcasts.files.bbci.co.uk/p02nq0gn.rss"})`

TED Talks Daily - TED
`registerChannel({url:"https://feeds.feedburner.com/TEDTalks_audio"})`

WSJ Tech News Briefing
`registerChannel({url:"https://video-api.wsj.com/podcast/rss/wsj/tech-news-briefing"})`

generateTranscript
`generateTranscript({"channelId":"TBuM2ICuClvW5CjkySJ1", "targetDate":"April 1, 2023 00:00:00"})`

`registerChannel({url:"https://anchor.fm/s/81fb5eec/podcast/rss"})`


`generateTranslatedTranscript({"channelId":"8Q7yb9qiVaWZ3YN1Zwrq","episodeId": "p1xs6whYS0A55n26Azik", "langCode": "ja"})`

`generateTranscriptFromIds({"channelId":"8Q7yb9qiVaWZ3YN1Zwrq","episodeId": "26tyUPEzMVsNhNXCW1tF"})`