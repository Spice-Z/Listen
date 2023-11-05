import { memo } from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

type Props = {
  width?: number;
  height?: number;
  color?: string;
};

const TranslateIcon = memo<Props>(({ width = 24, height = 24, color = 'white' }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 40 40" fill="none">
      <Rect width="18" height="18" x="19" y="19" stroke={color} stroke-width="2" rx="3" />
      <Path
        fill={color}
        d="M31.056 23.984c-1.664 5.216-5.104 8.176-10.64 9.632.384.464.992 1.392 1.216 1.872 5.728-1.792 9.456-5.152 11.472-10.912l-2.048-.592Zm-6.176.128-1.92.576c2 5.536 5.296 9.2 11.296 10.768.304-.56.928-1.472 1.392-1.92-5.696-1.28-9.152-4.688-10.768-9.424Zm-4.176-1.168v1.888H35.36v-1.888H20.704Zm6.288-2.528v3.68h1.984v-3.68h-1.984Z"
      />
      <Rect width="18" height="18" x="3" y="3" stroke={color} strokeWidth="2" rx="3" />
      <Path
        fill={color}
        d="M8.46 12.92h5.68l.02 1.4H8.38l.08-1.4Zm2.42-7.08.56.88-3.56 10.7c0 .067.067.133.2.2.147.053.327.093.54.12.213.027.427.04.64.04h.28V19H5.18v-1.22h.1c.307 0 .547-.053.72-.16.187-.107.34-.34.46-.7L10.5 4.8h3.22l4.18 12.42c.093.24.233.393.42.46.187.067.427.1.72.1h.1V19h-6.12v-1.22h.32c.213 0 .427-.007.64-.02.227-.013.413-.033.56-.06.147-.04.22-.08.22-.12L10.88 5.84Z"
      />
    </Svg>
  );
});

export default TranslateIcon;
