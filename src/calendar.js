import PropTypes from "prop-types";
import classNames from "classnames";
import useModal from "./useModal";
import Modal from "./modal";
import DatePicker from "react-datepicker";
import {
  daysOfWeek,
  createDaysForCurrentMonth,
  createDaysForNextMonth,
  createDaysForPreviousMonth,
  isWeekendDay,
  getMonthDropdownOptions,
  getYearDropdownOptions,
  isToDay
} from "./helpers";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

Calendar.propTypes = {
  className: PropTypes.string,
  yearAndMonth: PropTypes.arrayOf(PropTypes.number).isRequired, // e.g. [2022, 3] for March 2022
  onYearAndMonthChange: PropTypes.func.isRequired,
  renderDay: PropTypes.func
};
export default function Calendar({
  className = "",
  yearAndMonth = [2022, 3],
  onYearAndMonthChange,
  renderDay = () => isToDay
}) {
  const [year, month] = yearAndMonth;
  let today = isToDay();
  console.log(today);

  let currentMonthDays = createDaysForCurrentMonth(year, month);
  let previousMonthDays = createDaysForPreviousMonth(
    year,
    month,
    currentMonthDays
  );
  let nextMonthDays = createDaysForNextMonth(year, month, currentMonthDays);
  let calendarGridDayObjects = [
    ...previousMonthDays,
    ...currentMonthDays,
    ...nextMonthDays
  ];

  const handleMonthNavBackButtonClick = () => {
    let nextYear = year;
    let nextMonth = month - 1;
    if (nextMonth === 0) {
      nextMonth = 12;
      nextYear = year - 1;
    }
    onYearAndMonthChange([nextYear, nextMonth]);
  };

  const handleMonthNavForwardButtonClick = () => {
    let nextYear = year;
    let nextMonth = month + 1;
    if (nextMonth === 13) {
      nextMonth = 1;
      nextYear = year + 1;
    }
    onYearAndMonthChange([nextYear, nextMonth]);
  };

  const handleMonthSelect = evt => {
    let nextYear = year;
    let nextMonth = parseInt(evt.target.value, 10);
    onYearAndMonthChange([nextYear, nextMonth]);
  };

  const handleYearSelect = evt => {
    let nextMonth = month;
    let nextYear = parseInt(evt.target.value, 10);
    onYearAndMonthChange([nextYear, nextMonth]);
  };

  const {
    isShowing: isAddEventFormShowed,
    toggle: toggleAddEventForm
  } = useModal();

  const [startDate, setStartDate] = useState(new Date());

  return (
    <div className="calendar-root">
      <div className="navigation-header">
        <div className="month-nav-arrow-buttons">
          <button onClick={handleMonthNavBackButtonClick}> prev </button>
          <button onClick={handleMonthNavForwardButtonClick}>next</button>
        </div>
        <select
          className="month-select"
          value={month}
          onChange={handleMonthSelect}
        >
          {getMonthDropdownOptions().map(({ label, value }) =>
            <option value={value} key={value}>
              {label}
            </option>
          )}
        </select>
        <select
          className="year-select"
          value={year}
          onChange={handleYearSelect}
        >
          {getYearDropdownOptions(year).map(({ label, value }) =>
            <option value={value} key={value}>
              {label}
            </option>
          )}
        </select>
      </div>
      <div className="days-of-week">
        {daysOfWeek.map((day, index) =>
          <div
            key={day}
            className={classNames("day-of-week-header-cell", {
              "weekend-day": [6, 0].includes(index)
            })}
          >
            {day}
          </div>
        )}
      </div>
      <div className="days-grid">
        {calendarGridDayObjects.map(day =>
          <button
            onClick={toggleAddEventForm}
            key={day.dateString}
            className={classNames(
              "day-grid-item-container",
              "modal-toggle",
              {
                "weekend-day": isWeekendDay(day.dateString),
                "current-month": day.isCurrentMonth
              },
              "day" + day.dayOfMonth
            )}
          >
            <div className="day-content-wrapper">
              {renderDay(day)}
            </div>
          </button>
        )}
      </div>
      {calendarGridDayObjects.map(day => {
        if (day.dayOfMonth === today) {
          let elementos = document.getElementsByClassName(
            "day" + day.dayOfMonth
          );
          console.log(elementos);
          // elementos.className +="button.day-grid-item-container.current-month.day11"
        }
      })}
      <Modal
        isShowing={isAddEventFormShowed}
        hide={toggleAddEventForm}
        title="Add Event"
      >
        <form>
          <div className="form-group">
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              isClearable
              placeholderText="I have been cleared!"
            />
          </div>
          <div className="form-group">
            <input type="submit" value="Add your event" />
          </div>
        </form>
      </Modal>
      <style jsx="true">{`
        button {
          cursor: pointer;
        }
        button.day-grid-item-container.current-month.day${today} {
          background-color: blueviolet;
        }
        button.modal-toggle,
        input[type="submit"] {
          background-color: turquoise;
          cursor: pointer;
          padding: 1rem 2rem;
          text-transform: uppercase;
          border: none;
        }

        button.modal-toggle:not(:first-child) {
          margin-left: 0px;
        }

        .form-group {
          margin-top: 10px;
        }

        input[type="text"],
        input[type="password"],
        input[type="email"] {
          box-sizing: border-box;
          width: 100%;
          padding: 0.5rem 0.7rem;
        }
      `}</style>
    </div>
  );
}

CalendarDayHeader.propTypes = {
  calendarDayObject: PropTypes.object.isRequired
};
export function CalendarDayHeader({ calendarDayObject }) {
  return (
    <div className="day-grid-item-header">
      {calendarDayObject.dayOfMonth}
    </div>
  );
}
