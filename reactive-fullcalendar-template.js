var reactiveFullcalendar = function (options) {
  if (!jQuery.isFunction(options.events)) {
    throw new SyntaxError('Need events options declaring a function to manage reactive data');
  }

  var calendarEl = document.createElement('div');

  calendarEl.id = options.id || 'fullCalendar';
  calendarEl.className = 'calendar ' + options.addedClasses;

  jQuery('#' + calendarEl.id + '_wrapper').append(calendarEl);

  var calendar = jQuery(calendarEl).fullCalendar(options);

  var autorunFunctions = function () {
    if (options.autoruns && jQuery.isArray(options.autoruns)) {
      options.autoruns.forEach(function (funcDef) {
        if (jQuery.isFunction(funcDef)) {
          funcDef();
        }
      });
    }
  };

  var update = function (newOptions) {
    // check do we need to change calendar date
    var goToDate = newOptions.goToDate;

    if (goToDate) {
      calendar.fullCalendar('gotoDate', new Date(goToDate));
    }

    calendar.fullCalendar('refetchEvents');
    calendar.fullCalendar('rerenderEvents');

    if (newOptions.resources) {
      calendar.fullCalendar('refetchResources');
    }
  };

  return {
    update: update,
    autorunFunctions: autorunFunctions
  };
};


Template.ReactiveFullcalendar.onRendered(function () {
  var calendar = reactiveFullcalendar(this.data.options);

  this.autorun(function () {
    var data = Template.currentData();

    calendar.update(data.options);
    calendar.autorunFunctions();
  });
});

Template.ReactiveFullcalendar.helpers({
  id: function () {
    return (this.options && this.options.id || 'fullCalendar') + '_wrapper';
  }
});
