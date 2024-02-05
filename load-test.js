import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    scenarios: {
        carga_minima: {
            executor: 'shared-iterations',
            startTime: '10s',
            gracefulStop: '5s',
            env: { SCENARIO_TYPE: 'Carga Mínima' },
            tags: { scenario_tag: 'carga_minima' },
            vus: 20,
            iterations: 60, 
            maxDuration: '5s',
        },
        carga_media: {
            executor: 'shared-iterations',
            startTime: '20s',
            gracefulStop: '5s',
            env: { SCENARIO_TYPE: 'Carga Media' },
            tags: { scenario_tag: 'carga_media' },
            vus: 50,
            iterations: 80, 
            maxDuration: '15s',
        },
        carga_maxima: {
            executor: 'shared-iterations',
            startTime: '40s',
            gracefulStop: '5s',
            env: { SCENARIO_TYPE: 'Carga Máxima' },
            tags: { scenario_tag: 'carga_maxima' },
            vus: 100,
            iterations: 300, 
            maxDuration: '30s',
        },
    },
};

export default function () {

    let getWeatherForecast = http.get('https://sx-prueba-qa.azurewebsites.net/WeatherForecast');
    check(getWeatherForecast, {
        'status is 200': (res) => res.status === 200,
        'content is present': (res) => {
            let body = JSON.parse(res.body);
            return body.some(item => item.summary && item.temperatureC && item.temperatureF);
        },
        'data type is correct': (res) => {
            let body = JSON.parse(res.body);
            return body.every(item => typeof item.summary === 'string' && typeof item.temperatureC === 'number' && typeof item.temperatureF === 'number');
        }
    });

    sleep(1);
}
