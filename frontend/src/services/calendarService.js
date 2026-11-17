import { initialCalendarEvents } from '../data/dummyData';

const CALENDAR_KEY = 'scholarhub_calendar_events';

const getStoredEvents = () => {
  const data = localStorage.getItem(CALENDAR_KEY);
  if (!data) {
    localStorage.setItem(CALENDAR_KEY, JSON.stringify(initialCalendarEvents));
    return initialCalendarEvents;
  }
  return JSON.parse(data);
};

export const calendarService = {
  async getEvents() {
    return getStoredEvents();
  },

  async addEvent(eventData) {
    const events = getStoredEvents();
    const newEvent = {
      id: `evt-${Date.now()}`,
      title: eventData.title,
      category: eventData.category || 'assignment',
      date: eventData.date || new Date().toISOString().split('T')[0],
      time: eventData.time || '10:00 AM',
      subject: eventData.subject || 'General Academic',
      description: eventData.description || ''
    };
    const updated = [newEvent, ...events];
    localStorage.setItem(CALENDAR_KEY, JSON.stringify(updated));
    return newEvent;
  },

  async deleteEvent(eventId) {
    const events = getStoredEvents().filter(e => e.id !== eventId);
    localStorage.setItem(CALENDAR_KEY, JSON.stringify(events));
    return true;
  }
};

export default calendarService;
