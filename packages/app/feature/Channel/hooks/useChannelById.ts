import { useQuery } from '@tanstack/react-query';

import { getChannelById } from '../../dataLoader/getChannelById';

export function useChannelById(channelId) {
  return useQuery({
    queryKey: ['getChannelById', channelId as string],
    queryFn: () => getChannelById(channelId as string),
    enabled: !!channelId,
  });
}
