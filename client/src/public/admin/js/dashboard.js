Chart.register(ChartDataLabels);
  $(document).ready(async() => {
     await loadRevenueOverview();
     await loadDoughnutChart();
  })

  async function loadRevenueOverview() {
      const value = $('#revenueSelect').find(':selected').val();
      const ctx = document.getElementById('revenueChart');
      let chartStatus = Chart.getChart("revenueChart"); // <canvas> id
      if (chartStatus != undefined) {
        chartStatus.destroy();
      }
      const response = await fetch(`/admin/api/orders/yearly-revenue?by=${value}`);
      let result = [];
      if(response.ok) {
      result = (await response.json()).data; 
      }
      let labels = [];
      let data = [];
      for(let i = 0; i < result.length; i++) {
        labels.push(result[i].name);
        data.push(result[i].revenue);
      }


      new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Revenue',
            tension: 0.4,
            borderWidth: 3,
            data,
            borderSkipped: false,
            borderColor: '#007bff',
            backgroundColor: '#007bff66',
            fill: true,
            maxBarThickness: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
                legend: {
                    display: false,
                },
                datalabels: {
                  display: false
                }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                        drawBorder: false,
                        display: true,
                        drawOnChartArea: true,
                        borderDash: [5, 5]
              },
              ticks: {
                        display: true,
                        padding: 10,
                        color: '#b2b9bf',
                        font: {
                            size: 11,
                            family: "Open Sans",
                            style: 'normal',
                            lineHeight: 2
                        },
                        stepSize: 50000,
                    }
            },
                x: {
                    grid: {
                        drawBorder: false,
                        display: false,
                        drawOnChartArea: false,
                        drawTicks: false,
                        borderDash: [5, 5]
                    },
                    ticks: {
                        display: true,
                        color: '#b2b9bf',
                        padding: 20,
                        font: {
                            size: 11,
                            family: "Open Sans",
                            style: 'normal',
                            lineHeight: 2
                        },
                    }
          }
          }
        }
      });
  }

  async function loadDoughnutChart() {
    const value = $('#doughnutChartSelect').find(':selected').val();
    const ctx = document.getElementById('doughnutChart');
    let chartStatus = Chart.getChart("doughnutChart");
      if (chartStatus != undefined) {
        chartStatus.destroy();
      }
    const response = await fetch(`/admin/api/orders/top-revenue?by=${value}`);
      let result = [];
      if(response.ok) {
      result = (await response.json()).data; 
    }

    let labels = [];
    let data = [];
    for(let i = 0; i < result.length; i++) {
      labels.push(result[i].name.length > 10 ? result[i].name.slice(0, 14) + '...'  : result[i].name);
      data.push(result[i].revenue);
    }

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Revenue',
          data,
          backgroundColor: [
            '#007bff',
            '#00dbf1',
            '#6efacc',
            '#25c196',
            '#008a63'
          ],
          hoverOffset: 4
        }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
                legend: {
                    display: true,
                },
                 datalabels: {
            formatter: (value, ctx) => {
                let sum = 0;
                let dataArr = ctx.chart.data.datasets[0].data;
                dataArr.map(data => {
                    sum += data;
                });
                let percentage = (value*100 / sum).toFixed(2)+"%";
                return percentage;
            },
            color: '#fff',
        }
          },
        }
    })
  }

  async function handleRevenueSelectChange() {
    await loadRevenueOverview();
  }