import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getChannels } from '../../dataLoader/getChannels';

export function useChannels() {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['getChannels'],
    queryFn: () => getChannels(),
    onSuccess: (data) => {
      data.forEach((channel) => {
        queryClient.setQueryData(['getChannelById', channel.id], channel);
      });
    },
  });
}
