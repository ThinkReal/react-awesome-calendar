import React from 'react';
import styles from './index.styles.scss';
import { getElementHeight } from '../util/getElementHeight';
import Event from './Event';

export default class Daily extends React.Component {
  constructor(props) {
    super(props);
    this.onClickTimeLine = this.onClickTimeLine.bind(this);
  }

  componentDidMount() {
    this.getHourPosition();
  }

  componentDidUpdate() {
    this.getHourPosition();
  }

  returnHourWrapperHeight() {
    const hourWrappers = document.getElementsByClassName('dailyHourWrapper');
    const wrapper = getElementHeight(hourWrappers[0]);
    return wrapper || 0;
  }

  returnHourHeaderHeight() {
    const hourHeader = document.getElementsByClassName('dailyHour');
    const header = getElementHeight(hourHeader[0]);
    return header || 0;
  }

  getHourPosition() {
    const { events } = this.props;
    if (Array.isArray(events) && events.length) {
      const dayEvents = events.filter(e => !e.spread);
      const hourWrapperHeight = this.returnHourWrapperHeight();
      const hourHeaderHeight = this.returnHourHeaderHeight() / 2;

      const eventWidthHandled = [];
      dayEvents.forEach(event => {
        const id = `dailyEvent-${event.id}`;
        const fromDate = new Date(event.from);
        const toDate = new Date(event.to);
        const fromHour = this.getHoursMins(fromDate);
        const toHour = this.getHoursMins(toDate);

        const timeDiff = toHour - fromHour;

        const eventHeight = timeDiff * hourWrapperHeight;
        const eventPosition = fromHour * hourWrapperHeight + hourHeaderHeight;

        eventWidthHandled.push(event.id);
        this.handleEventWidth(
          eventWidthHandled,
          dayEvents,
          fromHour,
          toHour,
          event.id,
        );

        document.getElementById(id).style.top = `${eventPosition}px`;
        document.getElementById(id).style.height = `${eventHeight}px`;
      });
    }
  }

  getHoursMins(date) {
    return date.getUTCHours() + date.getUTCMinutes() / 60;
  }

  handleEventWidth(eventWidthHandled, events, fromHour, toHour, currentId) {
    const changedEventsTest = events.filter(
      e => !eventWidthHandled.find(id => id === e.id),
    );

    const otherEvents = changedEventsTest.filter(event => {
      const eventFromDate = new Date(event.from);
      const eventToDate = new Date(event.to);
      const eventFromHour =
        eventFromDate.getUTCHours() + eventFromDate.getUTCMinutes() / 60;
      const eventToHour =
        eventToDate.getUTCHours() + eventToDate.getUTCMinutes() / 60;

      return (
        (fromHour >= eventToHour && toHour < eventFromHour) ||
        (eventToHour >= fromHour && eventFromHour < toHour)
      );
    });
    if (Array.isArray(otherEvents) && otherEvents.length) {
      const id = `dailyEvent-${currentId}`;
      const dayEventMultiple = ' dayEventMultiple';
      const numberOfEvents = otherEvents.length + 1;
      const width = `${100 / numberOfEvents}%`;
      document.getElementById(id).style.width = width;
      document.getElementById(id).style.left = '0px';
      document.getElementById(id).className += dayEventMultiple;

      otherEvents.forEach((e, i) => {
        eventWidthHandled.push(e.id);
        const eventId = `dailyEvent-${e.id}`;
        document.getElementById(eventId).style.width = width;
        document.getElementById(eventId).style.left = `${(100 /
          numberOfEvents) *
        (i + 1)}%`;
        document.getElementById(eventId).className += dayEventMultiple;
      });
    }
  }

  returnHours() {
    const hours = [
      '00:00',
      '01:00',
      '02:00',
      '03:00',
      '04:00',
      '05:00',
      '06:00',
      '07:00',
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00',
      '22:00',
      '23:00',
      '24:00',
    ];
    return hours.map((hour, i) => {
      return (
        <div key={i} className={styles.dailyHourWrapper}>
          <div className={styles.dailyHourText}>
            <span>{hour}</span>
          </div>
        </div>
      );
    });
  }

  returnHoursLine() {
    const hours = [
      '00:00',
      '01:00',
      '02:00',
      '03:00',
      '04:00',
      '05:00',
      '06:00',
      '07:00',
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00',
      '22:00',
      '23:00',
      '24:00',
    ];
    return hours.map((hour, i) => {
      return (
        <div key={i} className={styles.dailyHourWrapper}>
          <div className={styles.dailyHour}>
            <div className={styles.dailyHourLine}/>
          </div>
        </div>
      );
    });
  }

  returnEvents() {
    const { events } = this.props;
    if (Array.isArray(events) && events.length) {
      const dayEvents = events.filter(e => !e.spread);
      return dayEvents.map(event => {
        // const from = new Date(event.from);
        // const fromTime = getTimeFromDate(from);
        // const to = new Date(event.to);
        // const toTime = getTimeFromDate(to);

        return (
          <div
            key={event.id}
            id={`dailyEvent-${event.id}`}
            className={styles.dayEvent}
          >
            <Event
              color={event.color}
              title={event.title}
              // time={`${fromTime} - ${toTime}`}
              onClick={() => this.onClickEvent(event)}
            />
          </div>
        );
      });
    }
  }

  onClickEvent(event) {
    if (this.props.onClickEvent) {
      this.props.onClickEvent(event);
    }
  }

  onClickTimeLine(event) {
    if (this.props.onClickTimeLine) {
      const offsetTop = document.getElementById('dailyTimeLine').offsetTop;
      const scrollTop = document.getElementById('dailyTimeLine').scrollTop;
      const clientY = event.clientY;
      const positionY = scrollTop + clientY - offsetTop - (this.returnHourHeaderHeight() / 2);
      let hourPosition = positionY / this.returnHourWrapperHeight();
      let hour = Math.round(hourPosition * 2) / 2;
      if (hour <= 0) {
        hour = 0;
      }
      if (hour > 24) {
        hour = 24;
      }
      this.props.onClickTimeLine(hour);
    }
  }

  returnTimeLine() {
    return (
      <div id='dailyTimeLine' className={styles.dailyTimeLineWrapper} onClick={this.onClickTimeLine}>
        <div className={styles.dailyHourTextWrapper}>{this.returnHours()}</div>
        <div className={styles.dailyTimeLine}>
          {this.returnEvents()}
          {this.returnHoursLine()}
        </div>
      </div>
    );
  }

  returnAllDayEvents() {
    const { events } = this.props;
    if (Array.isArray(events) && events.length) {
      const dailyEvents = events.filter(e => e.spread);
      return dailyEvents.map(event => {
        // const from = new Date(event.from);
        // const to = new Date(event.to);
        return (
          <div key={event.id} className={styles.allDayEvent}>
            <Event
              color={event.color}
              title={event.title}
              onClick={() => this.onClickEvent(event)}
            />
          </div>
        );
      });
    }
  }

  render() {
    return (
      <div className={styles.dailyWrapper}>
        {this.returnAllDayEvents()}
        {this.returnTimeLine()}
      </div>
    );
  }
}
