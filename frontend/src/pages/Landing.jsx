const Landing = ({ user }) => (
  <div>
  <h1 className="text-center">Welcome to WhatDaysWork!</h1>
  <div className="row">
    <div className="col-12 col-md-6 mb-4">
      <div className="d-flex justify-content-center">
        <div className="card bg-dark text-white w-100">
          <div className="card-header">
            <h3 className="text-center">How it works!</h3>
          </div>
          <p className="px-3 pb-3">
            When using WhatDaysWork, users can share event calendars with
            other parties that they wish to plan a group outing with. From
            there, you and the other shared users can input the days that work
            for you. The final product is a calendar that helpfully lays out
            the days which work for everyone!
          </p>
        </div>
      </div>
    </div>
    <div className="col-12 col-md-6 mb-4">
      <div className="d-flex justify-content-center">
        <div className="card bg-dark text-white w-100">
          <div className="card-header">
            <h3 className="text-center">Our Mission</h3>
          </div>
          <p className="px-3 pb-3">
            Here at WhatDaysWork, we strive to help groups be better at
            communication. Things such as vacations, business gatherings, and
            group events are often hard to plan in a way that works for all
            parties. Using our application can help you find a solution that
            works well for everyone.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

);

export default Landing;
