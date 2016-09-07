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

  var update = function () {
    calendar.fullCalendar('refetchEvents');
  };

  return {
    update,
    autorunFunctions,
  };
};


Template.ReactiveFullcalendar.rendered = function () {
  var data = this.data;
  var calendar = reactiveFullcalendar(data.options);

  this.autorun(function () {
    calendar.update();
    calendar.autorunFunctions();
  });
};

Template.ReactiveFullcalendar.helpers({
  id: function () {
    return (this.options && this.options.id || 'fullCalendar') + '_wrapper';
  }
});
