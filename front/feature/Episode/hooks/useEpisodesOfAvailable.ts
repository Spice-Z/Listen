import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getEpisodesOfAvailable } from '../../dataLoader/getEpisodesOfAvailable';

export function useEpisodesOfAvailable() {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['getEpisodesOfAvailable'],
    queryFn: () => getEpisodesOfAvailable(),
    onSuccess: (data) => {
      data.episodes.forEach((episode) => {
        const channelId = data.episodesChannelIds[episode.id];
        queryClient.setQueryData(['getEpisodeById', channelId, episode.id], episode);
      });
    },
  });
}
