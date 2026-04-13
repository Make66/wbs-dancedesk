import Svg, { Defs, LinearGradient, Stop, Rect, Circle, Path } from 'react-native-svg';
import { View } from 'react-native';
import { useAppTheme } from '@/theme/ThemeProvider';

type Props = {
  variant: 'profile' | 'interests' | 'permissions';
};

export function OnboardingIllustration({ variant }: Props) {
  const { colors, resolvedMode } = useAppTheme();
  const isDark = resolvedMode === 'dark';

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <Svg width="280" height="210" viewBox="0 0 280 210" fill="none">
        <Defs>
          <LinearGradient id="hero" x1="30" y1="20" x2="240" y2="190" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={colors.primary} stopOpacity="0.95" />
            <Stop offset="1" stopColor={isDark ? '#8CC4FF' : '#9EC5FF'} stopOpacity="0.9" />
          </LinearGradient>
        </Defs>

        <Rect x="18" y="16" width="244" height="170" rx="28" fill={colors.surfaceAlt} />
        <Circle cx="58" cy="54" r="16" fill="url(#hero)" opacity="0.9" />
        <Circle cx="228" cy="46" r="11" fill={colors.primaryMuted} />
        <Circle cx="208" cy="156" r="18" fill={colors.primaryMuted} />

        {variant === 'profile' ? (
          <>
            <Rect x="58" y="42" width="164" height="118" rx="24" fill={colors.surface} />
            <Circle cx="140" cy="76" r="22" fill="url(#hero)" />
            <Rect x="96" y="108" width="88" height="12" rx="6" fill={colors.primaryMuted} />
            <Rect x="82" y="128" width="116" height="10" rx="5" fill={colors.border} opacity="0.7" />
            <Path d="M110 76C110 58 123 46 140 46C157 46 170 58 170 76" stroke={colors.surface} strokeWidth="4" strokeLinecap="round" />
          </>
        ) : null}

        {variant === 'interests' ? (
          <>
            <Rect x="48" y="38" width="184" height="126" rx="26" fill={colors.surface} />
            <Rect x="72" y="62" width="62" height="28" rx="14" fill="url(#hero)" />
            <Rect x="144" y="62" width="54" height="28" rx="14" fill={colors.primaryMuted} />
            <Rect x="84" y="102" width="110" height="28" rx="14" fill={colors.primaryMuted} />
            <Rect x="72" y="138" width="48" height="10" rx="5" fill={colors.border} opacity="0.7" />
            <Rect x="126" y="138" width="78" height="10" rx="5" fill={colors.border} opacity="0.5" />
          </>
        ) : null}

        {variant === 'permissions' ? (
          <>
            <Rect x="54" y="40" width="172" height="124" rx="26" fill={colors.surface} />
            <Path d="M140 62C156 62 169 75 169 91V98H111V91C111 75 124 62 140 62Z" fill="url(#hero)" />
            <Rect x="102" y="98" width="76" height="42" rx="16" fill={colors.primaryMuted} />
            <Circle cx="140" cy="119" r="10" fill={colors.primary} />
            <Path d="M198 76L206 84L220 68" stroke={colors.primary} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : null}
      </Svg>
    </View>
  );
}
