import { Timestamp } from 'firebase-admin/firestore';
import Parser from 'rss-parser';

const parser = new Parser();
export async function fetchChannelDataByFeedUrl(feedUrl: string) {
  const feed = await parser.parseURL(feedUrl);
  const now = new Date();
  let latestPubDateTimestamp: null | Timestamp = null;
  // feedの情報から必要な情報を抽出する
  const episodesData = feed.items.map((item) => {
    const url = item.enclosure ? item.enclosure.url : undefined;
    const guid = item.guid || item.link || url;
    const title = item.title;
    const description = item.content;
    const content = item.contentSnippet || item.content || '';
    const duration = item.itunes ? item.itunes.duration : undefined;
    const imageUrl = item.itunes && item.itunes.image ? item.itunes.image : '';
    const pubDate = Timestamp.fromDate(item.pubDate ? new Date(item.pubDate) : now);
    const season = item.itunes ? item.itunes.season : undefined;
    const episode = item.itunes ? item.itunes.episode : undefined;
    // 対象データが存在しない場合はエラーを投げる
    if (!guid || !title || !url || !duration || !pubDate) {
      throw new Error('invalid data');
    }
    if (latestPubDateTimestamp === null || latestPubDateTimestamp < pubDate) {
      latestPubDateTimestamp = pubDate;
    }
    return {
      guid,
      title,
      description,
      url,
      content,
      duration,
      imageUrl,
      pubDate,
      season,
      episode,
    };
  });

  const title = feed.title;
  const author = feed.itunes ? feed.itunes.author : '';
  const description = feed.description;
  const imageUrl = feed.itunes ? feed.itunes.image : '';
  const categories = feed.itunes ? feed.itunes.categories : [];
  const categoriesWithSubs = feed.itunes ? feed.itunes.categoriesWithSubs : [];
  // pubDateもlastBuildDateも存在しないものがたまにある
  // 本当は最新のエピソードのpubDate入れるのがいいかも
  const channelPubDate = feed.pubDate
    ? Timestamp.fromDate(new Date(feed.pubDate))
    : feed.lastBuildDate
    ? Timestamp.fromDate(new Date(feed.lastBuildDate))
    : (latestPubDateTimestamp as unknown as Timestamp); // episodeのpubDateを入れているはずなので、Timestampでキャストしている
  const language = feed.language;
  const copyright = feed.copyright;

  const channelData = {
    title,
    author,
    description,
    imageUrl,
    feedUrl,
    channelPubDate,
    categories,
    categoriesWithSubs,
    language,
    copyright,
  };

  return {
    channel: channelData,
    episodes: episodesData,
  };
}
