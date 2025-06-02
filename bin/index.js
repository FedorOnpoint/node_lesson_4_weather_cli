#!/usr/bin/env node
import http from 'http'
import readline from 'node:readline'
import 'dotenv/config'
import 'colors';
import {stdin as input, stdout as output} from 'node:process'
import { config } from 'dotenv';

config()
const log = console.log
const rl = readline.createInterface({input, output})
const TOKEN = process.env.TOKEN

function question(data) {
    return new Promise(resolve => rl.question(data, answer => resolve(answer)));
}

function checkWeather(city = 'Moscow') {
    const url = `http://api.weatherstack.com/current?access_key=${TOKEN}&query=${city}`;
    log(`Checking weather in ${city}...`);
    http.get(url, (res) => {
        if (res.statusCode !== 200) {
            log('Error, Status code:', res.statusCode);
            res.resume(); // чтобы освободить память
            return;
        }
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {
            rawData += chunk;
        });
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                log(`Temperature in ${parsedData.location.name} now is ${parsedData.current.temperature} `);
                log(`Wind_speed:  ${parsedData.current.wind_speed} `);
                log(`Humidity:  ${parsedData.current.humidity} `);
                rl.close()
            } catch (e) {
                log('Error parsing JSON:', e.message);
            }
        });
        }).on('error', (e) => {
            log('Request error:', e.message);
        });
}


const answer = await question('Wanna check the weather in Moscow? y/n: ')
if (answer === 'y') checkWeather()
if(answer === 'n'){
    const otherCity = await question('Where do u want to check the weather? city: ')
    checkWeather(otherCity)
}

