import { useQuery } from '@tanstack/react-query';

import { getEpisodeByIds } from '../../dataLoader/getEpisodeByIds';

export function useEpisodeByIds({
  channelId,
  episodeId,
}: {
  channelId: string | undefined;
  episodeId: string | undefined;
}) {
  return useQuery({
    queryKey: ['getEpisodeById', channelId, episodeId],
    queryFn: () => getEpisodeByIds(channelId, episodeId),
    enabled: !!channelId && !!episodeId,
  });
}
