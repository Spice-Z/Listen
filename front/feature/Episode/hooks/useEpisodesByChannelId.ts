import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getEpisodesByChannelId } from '../../dataLoader/getEpisodesByChannelId';

export function useEpisodesByChannelId(channelId: string | undefined) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['getEpisodesByChannelId', channelId],
    queryFn: () => getEpisodesByChannelId(channelId),
    enabled: !!channelId,
    onSuccess: (data) => {
      data.forEach((episode) => {
        queryClient.setQueryData(['getEpisodeById', channelId, episode.id], episode);
      });
    },
  });
}
