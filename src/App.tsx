import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import {
	TiWeatherSunny,
	TiWeatherCloudy,
	TiWeatherPartlySunny,
	TiWeatherStormy,
	TiWeatherShower,
} from "react-icons/ti";

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

interface ApiResponse {
	forecast: {
		forecastday: ForecastDay[];
	};
	location: {
		name: string;
		region: string;
	};
}

function App() {
	const [zipCode, setZipCode] = useState<string>("");
	const [location, setLocation] = useState<string>("");
	const [forecast, setForecast] = useState<ForecastDay[]>([]);

	const fetchWeatherData = async () => {
		try {
			const response: AxiosResponse<ApiResponse> = await axios.get(
				`https://api.weatherapi.com/v1/forecast.json?key=${
					import.meta.env.VITE_API_KEY
				}&days=5&q=${zipCode}`
			);
			setForecast(response.data.forecast.forecastday);
			setLocation(
				`${response.data.location.name}, ${response.data.location.region}`
			);
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
					placeholder="Enter zip code"
					value={zipCode}
					onChange={(e) => setZipCode(e.target.value)}
					onKeyUp={handleKeyPress}
					autoFocus
				/>
			</section>
			<section className="forecast-area">
				<h1>{location}</h1>
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
		</main>
	);
}

export default App;
