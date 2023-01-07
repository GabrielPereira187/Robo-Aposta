const puppeteer = require('puppeteer');
require('dotenv').config();
const url = 'https://www.flashscore.com.br/futebol/brasil/serie-a/resultados/';
const fs = require("fs");
const { json } = require('express');

console.log(process.env.USERNAME);

async function run(){
    const browser = await puppeteer.launch({ headless: false,});

    const page = await browser.newPage();

    //direciona para a URL
    await page.goto(url);

    const gameData = await page.evaluate(() => {
        const games = Array.from(document.querySelectorAll('.event__match.event__match--static.event__match--twoLine'));
        const data = games.map((game) => ({
            home_team: game.querySelector('.event__participant.event__participant--home').innerText,
            away_team: game.querySelector('.event__participant.event__participant--away').innerText,
            id: game.id
        }));
        return data;    
    });

    browser.close();

    fs.writeFile('data.json', JSON.stringify(gameData), (err) => {
        if(err) throw err;
        console.log("Sucesso");
    })

   
}
run();

