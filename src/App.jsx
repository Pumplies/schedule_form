import { useState } from "react";

export default function App() {
  const [selectedDays, setSelectedDays] = useState([]);
  const daysOfWeek = [
    "Пн/Ср/Пт",
    "Вт/Чт",
    "Пн",
    "Вт",
    "Ср",
    "Чт",
    "Пт",
    "Сб",
    "Вс",
  ];
  const [totalHours, setTotalHours] = useState(0);
  const [hoursPerDay, setHoursPerDay] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeType, setTimeType] = useState("Астрономические");
  const [breakTime, setBreakTime] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleHoursIncrement = () => {
    setTotalHours(totalHours + 1);
  };

  const handleHoursDecrement = () => {
    setTotalHours(totalHours > 0 ? totalHours - 1 : 0);
  };

  const handleHoursPerDayIncrement = () => {
    setHoursPerDay(hoursPerDay + 1);
  };

  const handleHoursPerDayDecrement = () => {
    setHoursPerDay(hoursPerDay > 1 ? hoursPerDay - 1 : 1);
  };

  const toggleDay = (day) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const calculateEndDate = (allHours, hoursPerDay, myDays, startDate) => {
    const totalClasses = Math.ceil(allHours / hoursPerDay);
    let currentDate = new Date(startDate);
    let classCount = 0;

    const dayMap = {
      "Пн/Ср/Пт": [1, 3, 5],
      "Вт/Чт": [2, 4],
      Пн: [1],
      Вт: [2],
      Ср: [3],
      Чт: [4],
      Пт: [5],
      Сб: [6],
      Вс: [0],
    };
    const selectedDaysNumeric = myDays.flatMap((day) => dayMap[day]);

    while (classCount < totalClasses) {
      let dayOfWeek = currentDate.getDay();

      if (selectedDaysNumeric.includes(dayOfWeek)) {
        classCount++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
    currentDate.setDate(currentDate.getDate() - 1);

    return currentDate;
  };

  const calculateEndTime = (start, hours, timeType, breakMinutes) => {
    let [startHours, startMinutes] = start.split(":").map(Number);
    let lessonMinutes = timeType === "Астрономические" ? 60 : 45;
    let totalLessonMinutes = hours * lessonMinutes + (hours - 1) * breakMinutes;

    let endHours = Math.floor(
      (startHours * 60 + startMinutes + totalLessonMinutes) / 60
    );
    let endMinutes = (startHours * 60 + startMinutes + totalLessonMinutes) % 60;

    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(
      2,
      "0"
    )}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      startDate &&
      totalHours > 0 &&
      hoursPerDay > 0 &&
      selectedDays.length > 0 &&
      startTime
    ) {
      const calculatedEndDate = calculateEndDate(
        totalHours,
        hoursPerDay,
        selectedDays,
        startDate
      );
      setEndDate(calculatedEndDate.toLocaleDateString());

      const calculatedEndTime = calculateEndTime(
        startTime,
        hoursPerDay,
        timeType,
        breakTime
      );
      setEndTime(calculatedEndTime);

      console.log(
        "Расписание добавлено:",
        selectedDays,
        calculatedEndDate,
        calculatedEndTime
      );
    } else {
      alert("Пожалуйста, заполните все поля.");
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-100">
      <div className="mx-auto p-8 bg-white shadow-lg rounded-lg">
        <form onSubmit={handleSubmit}>
          {/* Group and Time Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between space-x-4">
              <input
                type="text"
                className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Онлайн школа"
              />
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Цвет группы:</span>
                <input
                  type="color"
                  className="border p-2 rounded-lg w-12 h-10"
                />
              </div>
            </div>
          </div>

          {/* Hours, Date Range, and Group Type */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <select
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setTimeType(e.target.value)}
            >
              <option>Астрономические</option>
              <option>Академические</option>
            </select>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                className="bg-gray-200 p-3 rounded-lg"
                onClick={handleHoursDecrement}
              >
                -
              </button>
              <input
                value={totalHours}
                type="text"
                className="border p-3 w-16 text-center rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
              <span className="text-sm text-gray-600">Всего часов</span>
              <button
                type="button"
                className="bg-gray-200 p-3 rounded-lg"
                onClick={handleHoursIncrement}
              >
                +
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="date"
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="text-sm text-gray-600">до</span>
              <input
                type="text"
                value={endDate}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                readOnly
              />
            </div>
          </div>

          {/* Days of the Week Selection */}
          <div className="mb-6">
            <p className="font-semibold mb-2 text-gray-700">
              Выберите дни недели:
            </p>
            <div className="grid grid-cols-4 gap-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`p-3 rounded-lg border ${
                    selectedDays.includes(day)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  } hover:bg-blue-400 transition-colors duration-200 ease-in-out`}
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Break, Hours per Day, and Time */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <select
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setBreakTime(Number(e.target.value))}
            >
              <option value={0}>Без перерыва</option>
              <option value={5}>5 минут</option>
              <option value={10}>10 минут</option>
              <option value={15}>15 минут</option>
            </select>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                className="bg-gray-200 p-3 rounded-lg"
                onClick={handleHoursPerDayDecrement}
              >
                -
              </button>
              <input
                value={hoursPerDay}
                type="text"
                className="border p-3 w-16 text-center rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
              <span className="text-sm text-gray-600">Часов в день</span>
              <button
                type="button"
                className="bg-gray-200 p-3 rounded-lg"
                onClick={handleHoursPerDayIncrement}
              >
                +
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="time"
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setStartTime(e.target.value)}
              />
              <span className="text-sm text-gray-600">до</span>
              <input
                type="text"
                value={endTime}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                readOnly
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 ease-in-out"
            >
              Добавить расписание
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
