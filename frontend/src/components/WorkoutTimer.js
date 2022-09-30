import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { selectAllWorkouts } from "../redux/features/workoutsSlice";

const WorkoutTimer = ({ workout }) => {
	const [timer, setTimer] = useState(5);
	const [isRunning, setIsRunning] = useState(false);
	const [isRestartAvailable, setIsRestartAvailable] = useState(false);
	const [remainder, setRemainder] = useState(0);
	const [total, setTotal] = useState(0);

	const allWorkouts = useSelector(selectAllWorkouts);

	const firstStart = useRef(true);
	const tick = useRef();

	useEffect(() => {
		initializeDisplay();
	}, [allWorkouts]);

	useEffect(() => {
		if (firstStart.current) {
			firstStart.current = !firstStart.current;
			return;
		}

		if (isRunning) {
			tick.current = setInterval(() => {
				setTimer((timer) => timer - 1);
			}, 1000);
		}

		return () => clearInterval(tick.current);
	}, [isRunning]);

	useEffect(() => {
		if (timer <= 0) {
			updateRemainder();
			setIsRestartAvailable(true);
			setIsRunning(false);
		}
	}, [timer]);

	const updateRemainder = () => {
		const newRemainder = remainder - 1;
		setRemainder(newRemainder);
	};

	const initializeDisplay = () => {
		allWorkouts.forEach((item) => {
			if (item._id === workout._id) {
				setRemainder(item.sets);
				setTotal(item.sets);
			}
		});
	};

	const handleStartTimer = () => {
		setIsRunning(true);
	};

	const handleStopTimer = () => {
		setIsRunning(false);
	};

	const handleNextTimer = () => {
		setTimer(5);
		setIsRunning(true);
		setIsRestartAvailable(false);
	};

	const handleRestartTimer = () => {
		setRemainder(total);
		setTimer(5);
		setIsRunning(true);
		setIsRestartAvailable(false);
	};

	return (
		<div className="timer-wrapper">
			<div className="timer-display">
				<p>
					Timer: <span>{timer}</span>
				</p>
				<div className="set-remainder">Remaining sets: {remainder}</div>
			</div>
			<div className="timer-controls">
				{isRestartAvailable && remainder > 0 && (
					<button className="next-btn" onClick={handleNextTimer}>
						Next Round
					</button>
				)}

				{isRestartAvailable && remainder === 0 && (
					<button
						className="restart-btn"
						onClick={handleRestartTimer}
					>
						Restart Exercise
					</button>
				)}

				{!isRunning && !isRestartAvailable && (
					<button className="start-btn" onClick={handleStartTimer}>
						Start
					</button>
				)}

				{isRunning && (
					<button className="stop-btn" onClick={handleStopTimer}>
						Stop
					</button>
				)}
			</div>
		</div>
	);
};

export default WorkoutTimer;
