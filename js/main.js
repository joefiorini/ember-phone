// ==========================================================================
//
// Project: Ember Phone
// An Ember app that approximates iOS7's Phone.app.
//
// Author:  Joe Fiorini <joe@joefiorini.com>
// URL:     http://joefiorini.github.io/ember-phone
// Repo:    https://github.com/joefiorini/ember-phone
//
// ==========================================================================
//
//
// APPLICATION SETUP
// ==========================================================================
//

App = Ember.Application.create();

App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Router.map(function() {
  this.resource("call", {path: "/"}, function() {
    this.route("new", {path: "/keypad"});
  });

  this.resource("contacts", function() {
    this.route("new");
    this.route("show", {path: "/:contactId"});
  });
});

App.ApplicationRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo("call.new");
  }
});

//
// ==========================================================================
//
//
// CONTACTS
// ==========================================================================
//

App.Contact = DS.Model.extend({
  firstName:    DS.attr("string"),
  lastName:     DS.attr("string"),
  company:      DS.attr("string"),
  notes:        DS.attr("string"),
  phoneNumbers: DS.hasMany("phoneNumber", {async: true})
});

App.PhoneNumber = DS.Model.extend({
  number: DS.attr("string"),
  label:  DS.attr("string")
});

App.ContactsIndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.find("contact");
  }
});

App.ContactsIndexController = Ember.ArrayController.extend({
  sortProperties: ["lastName", "firstName"]
});

//
// ==========================================================================
//
//
// CALLS
// ==========================================================================
//

App.CallNewController = Ember.Controller.extend({
  needs: ["phoneNumber"],
  phoneNumber: Ember.computed.alias("controllers.phoneNumber.stringValue"),
  hasEntries: Ember.computed.gt("controllers.phoneNumber.length", 0),

  actions: {
    numberEntered: function(number) {
      this.set('number', number);
      this.get("controllers.phoneNumber").pushObject(number);
    },
    removeNumber: function() {
      this.get('controllers.phoneNumber').popObject();
    },
    addToContacts: function() {
      alert("Not functional yet");
    },
    placeCall: function() {
      alert("Not functional yet");
    }
  }

});

App.PhoneNumberController = Ember.ArrayController.extend({
  stringValue: function() {
    if(this.get("length") > 3 && this.get("length") <= 7) {
      var prefix = this.get('content').slice(0, 3).join(""),
          exchange = this.get('content').slice(3, 7).join("");

      return "%@-%@".fmt(prefix, exchange);
    } else if(this.get("length") > 7 && this.get("length") <= 10) {
      var areaCode = this.get('content').slice(0, 3).join(""),
          prefix = this.get('content').slice(3, 6).join(""),
          exchange = this.get('content').slice(6, 11).join("");

      return "(%@) %@-%@".fmt(areaCode, prefix, exchange);
    } else {
      return this.get("content").join("");
    }
  }.property("content.[]")
});

App.KeypadComponent = Ember.Component.extend({
  actions: {
    numberEntered: function(number) {
      this.sendAction('action', number);
    }
  }
});

App.KeypadButtonComponent = Ember.Component.extend({
  tagName: "button",
  classNames: ["keypad-button"],
  attributeBindings: ["accesskey"],
  accesskey: Ember.computed.defaultTo("number"),
  didInsertElement: function() {
    var number = this.get('number');
    if(number == '*') {
      number = 'star';
    } else if (number == '#') {
      number = 'pound';
    }
    var audio = $('#dtmf-' + number)[0];

    this.set('audioElement', audio);
  },
  playTone: function() {
    if(!this.get('playingTone')) {
      this.get('audioElement').play();
      this.toggleProperty('playingTone');
    }
  },
  stopTone: function() {
    if(this.get('playingTone')) {
      this.get('audioElement').pause();
      this.get('audioElement').currentTime = 0;
      Ember.run.next(this, 'toggleProperty', 'playingTone');
    }
  },
  mouseDown: function() {
    this.playTone();
  },
  mouseUp: function() {
    this.stopTone();
  },
  click: function() {
    this.playTone();
    this.sendAction('action', this.get('number'));
  }
});

//
// ==========================================================================
//
//
// TEST DATA
// ==========================================================================
//

App.PhoneNumber.FIXTURES = [{
  id: 1,
  number: "1234567890",
  label: "home"
}, {
  id: 2,
  number: "1234567890",
  label: "home"
}];

App.Contact.FIXTURES = [{
  id: 1,
  firstName: "Lindsay",
  lastName: "Fünke",
  phoneNumbers: [1]
}, {
  id: 2,
  firstName: "Michael",
  lastName: "Bluth",
  company: "Bluth Construction",
  phoneNumbers: [2]
}, {
  id: 3,
  firstName: "Lucille",
  lastName: "Bluth",
  company: "Bluth Construction"
}, {
  id: 4,
  firstName: "Lucille",
  lastName: "Austero",
  company: "Standpoor Industries"
}];

//
// ==========================================================================
