import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import {
	TiWeatherSunny,
	TiWeatherCloudy,
	TiWeatherPartlySunny,
	TiWeatherStormy,
	TiWeatherShower,
	TiWeatherSnow,
} from "react-icons/ti";
import { WiFog } from "react-icons/wi";

interface ForecastDay {
	date: string;
	day: {
		condition: {
			text: string;
			icon: string;
		};
		daily_chance_of_rain: number;
		maxtemp_f: number;
	};
}

interface CurrentCondition {
	condition: {
		text: string;
		icon: string;
	};
	humidity: number;
	feelslike_f: number;
	temp_f: number;
	wind_dir: string;
	wind_mph: number;
	vis_miles: number;
	pressure_in: number;
	precip_in: number;
}

interface Alert {
	desc: string;
	event: string;
	expires: string;
	headline: string;
}

interface ApiResponse {
	forecast: {
		forecastday: ForecastDay[];
	};
	location: {
		name: string;
		region: string;
	};
	current: CurrentCondition;
	alerts: {
		alert: Alert[];
	};
}

function App() {
	const [zipCode, setZipCode] = useState<string>("");
	const [location, setLocation] = useState<string>("");
	const [forecast, setForecast] = useState<ForecastDay[]>([]);
	const [alert, setAlert] = useState<Alert[]>([]);
	const [current, setCurrent] = useState<CurrentCondition>();

	const fetchWeatherData = async () => {
		try {
			const response: AxiosResponse<ApiResponse> = await axios.get(
				`https://api.weatherapi.com/v1/forecast.json?key=${
					import.meta.env.VITE_API_KEY
				}&days=5&q=${zipCode}&alerts=yes`
			);
			setForecast(response.data.forecast.forecastday);
			setLocation(
				`${response.data.location.name}, ${response.data.location.region}`
			);
			setCurrent(response.data.current);
			setAlert(response.data.alerts.alert);
			console.log(response.data);
		} catch (error) {
			console.error("Error fetching weather data:", error);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			fetchWeatherData();
		}
	};

	const renderWeatherIcon = (condition: string) => {
		if (condition.toLowerCase().includes("sunny")) {
			return <TiWeatherSunny size="3em" />;
		} else if (
			condition.toLowerCase().includes("overcast") ||
			condition.toLowerCase().includes("cloudy")
		) {
			return <TiWeatherCloudy size="3em" />;
		} else if (condition.toLowerCase().includes("partly sunny")) {
			return <TiWeatherPartlySunny size="3em" />;
		} else if (
			condition.toLowerCase().includes("storm") ||
			condition.toLowerCase().includes("thunderstorm")
		) {
			return <TiWeatherStormy size="3em" />;
		} else if (condition.toLowerCase().includes("rain")) {
			return <TiWeatherShower size="3em" />;
		} else if (
			condition.toLowerCase().includes("snow") ||
			condition.toLowerCase().includes("blizzard")
		) {
			return <TiWeatherSnow size="3em" />;
		} else if (condition.toLowerCase().includes("fog")) {
			return <WiFog size="3em" />;
		} else {
			return null;
		}
	};

	return (
		<main>
			<section className="form">
				<input
					className="form-input"
					type="text"
					placeholder="Enter zip code and press Enter"
					value={zipCode}
					onChange={(e) => setZipCode(e.target.value)}
					onKeyUp={handleKeyPress}
					autoFocus
				/>
			</section>
			{current ? (
				<section className="current-container">
					<h2>Current Conditions</h2>
					<div className="current-conditions">
						<div className="current-left">
							<div>
								{current
									? renderWeatherIcon(current.condition.text)
									: null}
								<h2>
									{current?.temp_f.toFixed(0)}° and{" "}
									{current?.condition.text}
								</h2>
								<p>
									Feels like {current?.feelslike_f.toFixed(0)}
									°
								</p>
								<p>
									Winds {current?.wind_dir} at{" "}
									{current?.wind_mph.toFixed(0)}mph
								</p>
							</div>
						</div>
						<div className="current-right">
							<div>
								<p>Humidity: {current?.humidity}%</p>
								<p>Barometer: {current?.pressure_in}</p>
								<p>Visibility: {current?.vis_miles} miles</p>
								<p>Total Precip: {current?.precip_in} inches</p>
							</div>
						</div>
					</div>
				</section>
			) : null}
			{forecast[0] ? (
				<section className="forecast-area">
					<h1>5-Day Forecast for {location}</h1>
					<div className="forecast-items">
						{forecast.map((wx, index) => (
							<div key={index} className="forecast-card">
								<h5>{wx.date.slice(8, 10)}</h5>
								<div className="forecast-content">
									{renderWeatherIcon(wx.day.condition.text)}
									<p>{wx.day.condition.text}</p>
									<h2>{wx.day.maxtemp_f.toFixed(0)}°</h2>
									<p>{wx.day.daily_chance_of_rain}%</p>
								</div>
							</div>
						))}
					</div>
				</section>
			) : null}
			{alert[0] ? (
				<section className="alert-container">
					<h2>Alerts</h2>
					{alert.map((item, index) => (
						<div key={index} className="alert-card">
							<h3>
								{item.event} until{" "}
								{new Date(item.expires).toLocaleString("en-US")}
							</h3>
							<em>{item.desc}</em>
						</div>
					))}
				</section>
			) : null}
		</main>
	);
}

export default App;
