import { useQuery } from '@apollo/client';
import { gql } from '../../graphql/__generated__';
import { useMemo } from 'react';
import { GetEpisodeInCurrentEpisodeDataQuery } from '../../graphql/__generated__/graphql';

type Props = {
  currentEpisodeId: string | null;
  currentEpisodeChannelId: string | null;
};
type Hooks = {
  episode?: GetEpisodeInCurrentEpisodeDataQuery['episode'];
  hasTranslatedTranscript: boolean;
  canDictation: boolean;
};

const GET_EPISODE_IN_CURRENT_EPISODE_DATA = gql(/* GraphQL */ `
  query GetEpisodeInCurrentEpisodeData($channelId: String!, $episodeId: String!) {
    episode(channelId: $channelId, episodeId: $episodeId) {
      id
      transcriptUrl
      translatedTranscripts {
        language
        transcriptUrl
      }
      hasChangeableAd
      canDictation
    }
  }
`);

export const useCurrentEpisodeData = ({
  currentEpisodeId,
  currentEpisodeChannelId,
}: Props): Hooks => {
  const { data } = useQuery(GET_EPISODE_IN_CURRENT_EPISODE_DATA, {
    variables: {
      channelId: currentEpisodeChannelId,
      episodeId: currentEpisodeId,
    },
    skip: !currentEpisodeChannelId || !currentEpisodeId,
  });
  const episode = !data
    ? undefined
    : (data.episode as GetEpisodeInCurrentEpisodeDataQuery['episode'] | undefined);
  const hasTranslatedTranscript = useMemo(() => {
    if (!data) {
      return false;
    }
    if (!data?.episode?.translatedTranscripts) {
      return false;
    }
    return data.episode.translatedTranscripts.length > 0;
  }, [data]);
  const canDictation = useMemo(() => {
    if (!data) {
      return false;
    }
    if (!data?.episode?.canDictation) {
      return false;
    }
    return data.episode.canDictation;
  }, [data]);
  return {
    episode,
    hasTranslatedTranscript,
    canDictation,
  };
};
