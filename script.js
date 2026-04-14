document.addEventListener("DOMContentLoaded", () => {

  // Clock
  function updateClock() {
    const now = new Date();
    document.getElementById("clock").textContent =
      now.toTimeString().slice(0, 8);
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Servers
  const servers = [
    { cpu: 40, mem: 60, disk: 30 },
    { cpu: 70, mem: 80, disk: 50 },
    { cpu: 30, mem: 40, disk: 20 }
  ];

  let active = 0;

  // Update UI
  function updateUI() {
    const s = servers[active];

    document.getElementById("cpu").textContent = s.cpu + "%";
    document.getElementById("mem").textContent = s.mem + "%";
    document.getElementById("disk").textContent = s.disk + "%";

    updateChart(s);
  }

  // Switch server
  window.selectServer = function(index) {
    active = index;
    updateUI();
  };

  // Chart
  const ctx = document.getElementById("lineChart").getContext("2d");

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["1", "2", "3", "4", "5"],
      datasets: [{
        label: "CPU Usage",
        data: [40, 45, 42, 50, 48],
        borderWidth: 2,
        tension: 0.3
      }]
    }
  });

  function updateChart(s) {
    chart.data.datasets[0].data.push(s.cpu);
    chart.data.datasets[0].data.shift();
    chart.update();
  }

  // Simulate changes
  function simulate() {
    const s = servers[active];

    s.cpu = Math.min(100, Math.max(0, s.cpu + (Math.random()*10 - 5)));
    s.mem = Math.min(100, Math.max(0, s.mem + (Math.random()*6 - 3)));
    s.disk = Math.min(100, Math.max(0, s.disk + (Math.random()*4 - 2)));

    updateUI();
  }

  setInterval(simulate, 3000);

  // Initial load
  updateUI();

});