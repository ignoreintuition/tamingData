window.fetchData = window.fetchData || {};

(function() {
  fetch('./data/aggregate.json')
  .then( response => {
      return response.json();
  }).then( jsonData => {
      window.fetchData.jsonData = jsonData;
  }).catch( err => {
      console.log("Fetch process failed", err);
  })

  fetchData.filterData = function(yr, state){
      if (yr == "All"){
        let total = this.jsonData.filter(dState => dState.state==state)
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue.total;
        }, 0)
        return [{'year': 'All', 'state': state, 'total': total}];
      }
      if (state == "All"){
        let total = this.jsonData.filter(dYr => dYr.year==yr)
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue.total;
        }, 0)
        return [{'year': yr, 'state': 'All', 'total': total}];
      }
      let subset = this.jsonData.filter(dYr => dYr.year==yr)
      .filter(dSt => dSt.state== state);
      return subset;
  }

  document.getElementById("submitBtn").onclick =
  function(e){
      e.preventDefault();
      let state = document.getElementById("stateInput").value || "All"
      let year = document.getElementById("yearInput").value || "All"
      let subset = window.fetchData.filterData(year, state);
      if (subset.length == 0  )
        subset.push({'state': 'N/A', 'year': 'N/A', 'total': 'N/A'})
      document.getElementById("output").innerHTML =
      `<table class="table">
        <thead>
          <tr>
            <th scope="col">State</th>
            <th scope="col">Year</th>
            <th scope="col">Arrivals</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${subset[0].state}</td>
            <td>${subset[0].year}</td>
            <td>${subset[0].total}</td>
          </tr>
        </tbody>
      </table>`
  }
})()
