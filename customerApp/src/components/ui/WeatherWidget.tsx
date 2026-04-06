import { WeatherIcon } from "../../lib/constants/weather-icons";

type Props = {
  weatherCode: number;
  tempMin: number;
  tempMax: number;
  className?: string;
};

export default function WeatherWidget({ weatherCode, tempMax, className }: Props) {
  return (
    <div className={className}>
      <div className="w-fit flex flex-col items-center">
        <WeatherIcon code={weatherCode} className="h-5 w-5" />
        <span className="text-[11px] font-medium">{tempMax}°C</span>
      </div>
    </div>
  );
}
