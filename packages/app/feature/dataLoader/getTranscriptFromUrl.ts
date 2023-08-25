import axios from 'axios';

export const getTranscriptFromUrl = async (
  url: string | null,
): Promise<{ start: number; end: number; text: string }[] | null> => {
  if (!url) {
    return null;
  }
  try {
    const response = await axios.get(url);
    const formattedTranscript = response.data.segments.map((item) => {
      const start = parseFloat(item.start);
      const end = parseFloat(item.end);
      const text = item.text;
      return {
        start,
        end,
        text,
      };
    });
    return formattedTranscript;
  } catch (error) {
    console.log(error);
    return null;
  }
};
