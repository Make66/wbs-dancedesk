import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
} from "lucide-react";

type WeatherIconProps = {
  code: number;
  isDay?: number;
  className?: string;
};

export function WeatherIcon({ code, isDay = 1, className }: WeatherIconProps) {
  if (code === 0) {
    return isDay ? <Sun className={className} /> : <Cloud className={className} />;
  }

  if ([1, 2].includes(code)) {
    return <CloudSun className={className} />;
  }

  if (code === 3) {
    return <Cloud className={className} />;
  }

  if ([45, 48].includes(code)) {
    return <CloudFog className={className} />;
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return <CloudDrizzle className={className} />;
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return <CloudRain className={className} />;
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return <CloudSnow className={className} />;
  }

  if ([95, 96, 99].includes(code)) {
    return <CloudLightning className={className} />;
  }

  return <Cloud className={className} />;
}