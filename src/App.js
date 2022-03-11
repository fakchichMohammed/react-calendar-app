import "./styles.css";
import { useState } from "react";
import Calendar, { CalendarDayHeader } from "./calendar.js";

export default function App() {
  const [yearAndMonth, setYearAndMonth] = useState([2022, 3]);
  return (
    <div className="App">
      <Calendar
        yearAndMonth={yearAndMonth}
        onYearAndMonthChange={setYearAndMonth}
        renderDay={(calendarDayObject) => (
          <div>
            <CalendarDayHeader calendarDayObject={calendarDayObject} />
          </div>
        )}
      />
    </div>
  );
}
