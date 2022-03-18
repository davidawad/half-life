(function () {
  var $ = document.getElementById.bind(document);
  var $$ = document.querySelectorAll.bind(document);

  var App = function ($el) {
    this.$el = $el;
    this.load();

    this.$el.addEventListener("submit", this.submit.bind(this));

    if (this.dob) {
      this.renderAgeLoop();
    } else {
      this.renderChoose();
    }
  };

  App.fn = App.prototype;

  App.fn.load = function () {
    var value;

    if ((value = localStorage.dob)) this.dob = new Date(parseInt(value));
  };

  App.fn.save = function () {
    if (this.dob) localStorage.dob = this.dob.getTime();
  };

  App.fn.submit = function (e) {
    e.preventDefault();

    var input = this.$$("input")[0];
    if (!input.valueAsDate) return;

    this.dob = input.valueAsDate;
    this.save();
    this.renderAgeLoop();
  };

  App.fn.renderChoose = function () {
    this.html(this.view("dob")());
  };

  App.fn.renderAgeLoop = function () {
    this.interval = setInterval(this.renderAge.bind(this), 100);
  };

  // App.fn.add_years(dt, n){
  //   return new Date(dt.setFullYear(dt.getFullYear() + n));
  // };

  App.fn.renderAge = function () {
    // U.S. Life expectancy as of 2019:
    // https://www.worldometers.info/demographics/life-expectancy/
    const meanLifeExpectancy = 78.79;

    var now = new Date();
    var currentAge = (now - this.dob) / 1000 / 60 / 60 / 24 / 365;

    expectedYears = new Date();
    expectedYears.setFullYear(this.dob.getFullYear() + meanLifeExpectancy);
    // convert to # years
    expectedYears = expectedYears / 1000 / 60 / 60 / 24 / 365;
    expectedYears = expectedYears - currentAge;

    // see this article for solving for half life using
    // https://www.omnicalculator.com/chemistry/half-life
    // T = half-life
    // τ = is the mean lifetime - the average amount of time a nucleus remains intact.
    // T = ln(2)/λ = ln(2)*τ

    let halfLife = Math.log(2) * (expectedYears - currentAge);

    // for debugging
    // console.log("currentAge:", currentAge);
    // console.log("expectedYears:", expectedYears);
    // console.log("λ:", halfLife);

    // var majorMinor = years.toFixed(9).toString().split(".");
    let displayText = halfLife.toFixed(10).toString().split(".");

    requestAnimationFrame(
      function () {
        this.html(
          this.view("age")({
            year: displayText[0],
            milliseconds: displayText[1]
          })
        );
      }.bind(this)
    );
  };

  App.fn.$$ = function (sel) {
    return this.$el.querySelectorAll(sel);
  };

  App.fn.html = function (html) {
    this.$el.innerHTML = html;
  };

  App.fn.view = function (name) {
    var $el = $(name + "-template");
    return Handlebars.compile($el.innerHTML);
  };

  window.app = new App($("app"));
})();
