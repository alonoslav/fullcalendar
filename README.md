# jss:reactive-fullcalendar (with Scheduler functionality)

Based on https://github.com/gquemart/meteor-reactive-fullcalendar

### Instalation

```bash
meteor add jss:reactive-fullcalendar
```

### Usage
Template:

```handlebars
<template name="myTemplate">
  {{ > ReactiveFullcalendar options=calendarOptions }}
</template>
```
    
Client JS:

```javascript
Template.myTemplate.helpers({
  calendarOptions: {
    // Standard fullcalendar options
    height: 700,
    hiddenDays: [0],
    slotDuration: '01:00:00',
    minTime: '08:00:00',
    maxTime: '19:00:00',
    lang: 'fr',
    
    // Function providing events reactive computation for fullcalendar plugin
    events: function (start, end, timezone, callback) {
      var events = [];
      // Get only events from one document of the Calendars collection
      // events is a field of the Calendars collection document
      var calendar = Calendars.findOne({
      	_id: 'myCalendarId',
      }, {
      	fields: { events: 1 },
      });
      
      // events need to be an array of subDocuments:
      // each event field named as fullcalendar Event Object property is automatically used by fullcalendar
      if (calendar && calendar.events) {
        calendar.events.forEach(function (event) {
          var eventDetails = {};
          
          for(key in event) {
            eventDetails[key] = event[key];
          }
          
          events.push(eventDetails);
        });
      }
      
      callback(events);
    },

    goToDate: new Date(), // you can use this parameter for providing reactive fullcalendar date changing

    // Optional: id of the calendar
    id: 'calendar1',
    // Optional: Additional classes to apply to the calendar
    addedClasses: 'col-md-8',
    // Optional: Additional functions to apply after each reactive events computation
    autoruns: [
      function () {
        console.log("user defined autorun function executed!");
      }
    ]
  },
});
```

If you want to use a [Scheduler](https://fullcalendar.io/scheduler/) functionality, you should to add a scheduler key to your fullCalendar options. If you have no key, you can use a trial key:

```javascript
...
calendarOptions: {
    ...
	schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
	...
}
...
```

### More details
- Many fullcalendar can be added on the same page by using different id
- autoruns need to be an array of functions
