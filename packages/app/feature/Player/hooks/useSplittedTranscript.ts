import { useMemo } from 'react';

type Props = {
  transcriptData: { start: number; end: number; text: string }[] | null;
};
export const useSplittedTranscript = ({ transcriptData }: Props) => {
  const splitedTranscriptData = useMemo(() => {
    if (!transcriptData) {
      return [];
    }
    const splited: {
      start: number;
      end: number;
      text: string;
    }[][] = [];
    // transcriptDataの中身を7秒ごとに分割した配列を作る
    // transcriptDataを1つづループで回し、splitedの最新要素のstart - endが7秒より大きい場合は新しい要素を作ってそこに入れる
    // そうでない場合は最新要素に追加する
    transcriptData.forEach((data) => {
      if (splited.length === 0) {
        splited.push([data]);
        return;
      }
      const latestSplited = splited[splited.length - 1];
      const latestSplitedFirstData = latestSplited[0];
      const latestSplitedLastData = latestSplited[latestSplited.length - 1];
      if (latestSplitedLastData.end - latestSplitedFirstData.start > 7) {
        splited.push([data]);
        return;
      }
      latestSplited.push(data);
    });
    return splited;
  }, [transcriptData]);

  const tabs = useMemo(() => {
    const tabData = splitedTranscriptData.map((splited, index) => {
      const firstData = splited[0];
      const lastData = splited[splited.length - 1];
      return {
        id: index,
        startTimeSec: firstData.start,
        endTimeSec: lastData.end,
      };
    });

    return tabData;
  }, [splitedTranscriptData]);

  return {
    splitedTranscriptData,
    tabs,
  };
};
