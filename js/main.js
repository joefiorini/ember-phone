App = Ember.Application.create();

App.Router.map(function() {
  this.resource("call", {path: "/"}, function() {
    this.route("new", {path: "/keypad"});
  });
});

App.ApplicationRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo("call.new");
  }
});

App.KeypadButtonComponent = Ember.Component.extend({
  tagName: "button",
  classNames: ["keypad-button"],
  attributeBindings: ["accesskey"],
  accesskey: Ember.computed.defaultTo("number"),
  click: function() {
    this.sendAction('action', this.get('number'));
  }
});

App.KeypadComponent = Ember.Component.extend({
  actions: {
    numberEntered: function(number) {
      this.sendAction('action', number);
    }
  }
});

App.PhoneNumberController = Ember.ArrayController.extend({
  contentDidChange: function() {
    this.set('areaCode', this.get('content').slice(0, 3).join(""));
    this.set('prefix', this.get('content').slice(3, 6).join(""));
    this.set('exchange', this.get('content').slice(6, 10).join(""));
  }.observes('content.[]'),
  stringValue: function() {
    console.log('calculating stringValue');
    if(this.get("length") > 3 && this.get("length") <= 7) {
      return "%@-%@".fmt(this.get("areaCode"), this.get("prefix"));
    } else if(this.get("length") > 7 && this.get("length") <= 10) {
      return "(%@) %@-%@".fmt(this.get("areaCode"), this.get("prefix"), this.get("exchange"));
    } else {
      return this.get("content").join("");
    }
  }.property("content.[]")
});

App.CallNewController = Ember.Controller.extend({
  needs: ["phoneNumber"],
  phoneNumber: Ember.computed.alias("controllers.phoneNumber.stringValue"),
  actions: {
    numberEntered: function(number) {
      this.set('number', number);
      this.get("controllers.phoneNumber").pushObject(number);
    }
  }
});
