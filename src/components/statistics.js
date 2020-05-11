import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";
import {TypeToIcon, EVENT_TYPES} from '../const.js';

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
    </section>`
  );
};

const addTypeIcon = (type) => {
  return TypeToIcon[type] + ` ` + type;
};

const getData = (events) => {
  const types = new Set(events.map(({type}) => type));
  const typesStatistics = {};

  types.forEach((type) => {
    const statistic = {
      price: 0,
      transport: 0,
      time: 0,
    };

    for (const event of events) {
      if (event.type !== type) {
        continue;
      }

      statistic.price += event.price;
      statistic.transport += 1;
      statistic.time += event.end.getTime() - event.start.getTime();
    }

    typesStatistics[type.toUpperCase()] = statistic;
  });
  return typesStatistics;
};

const renderMoneyChart = (moneyCtx, statistics, types) => {
  const prices = [];
  const typesWithIcons = [];

  types.forEach((type) => {
    prices.push(statistics[type].price);
    typesWithIcons.push(addTypeIcon(type));
  });

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: typesWithIcons,
      datasets: [{
        data: prices,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: 44,
        minBarLength: 50,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};


const renderTransportChart = (transportCtx, statistics, transportTypes) => {
  const usesCount = [];
  const transportTypesWithIcon = [];

  transportTypes.forEach((type) => {
    usesCount.push(statistics[type].transport);
    transportTypesWithIcon.push(addTypeIcon(type));
  });

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: transportTypesWithIcon,
      datasets: [{
        data: usesCount,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: 44,
        minBarLength: 50,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTimeSpentChart = (timeSpendCtx, statistics, types) => {
  const hours = [];
  const typesWithIcons = [];

  types.forEach((type) => {
    const typeDuration = moment.duration(statistics[type].time).asHours();
    hours.push(Math.floor(typeDuration));
    typesWithIcons.push(addTypeIcon(type));
  });

  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: typesWithIcons,
      datasets: [{
        data: hours,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: 44,
        minBarLength: 50,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}H`
        }
      },
      title: {
        display: true,
        text: `TIME-SPENT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};


export default class Statistics extends AbstractSmartComponent {
  constructor(eventsModel) {
    super();

    this._eventsModel = eventsModel;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpentChart = null;
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  show() {
    super.show();

    this._renderCharts();
  }

  recoveryListeners() {}

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeSpentChart) {
      this._timeSpentChart.destroy();
      this._timeSpentChart.destroy();
    }
  }

  _renderCharts() {
    const events = this._eventsModel.getAllEvents();
    const statistics = getData(events);
    const types = Object.keys(statistics);
    const transportTypes = types.filter((type) => {
      return EVENT_TYPES.transfer.some((transferType) => transferType.toUpperCase() === type);
    });

    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = this.getElement().querySelector(`.statistics__chart--time`);

    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * types.length;
    transportCtx.height = BAR_HEIGHT * transportTypes.length;
    timeSpendCtx.height = BAR_HEIGHT * types.length;

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, statistics, types);
    this._transportChart = renderTransportChart(transportCtx, statistics, transportTypes);
    this._timeSpentChart = renderTimeSpentChart(timeSpendCtx, statistics, types);
  }
}
