import puppeteer from 'puppeteer';

const URL:string = "https://buscacepinter.correios.com.br/app/endereco/index.php";

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(URL);
  
  await page.evaluate(() => {
    const cepField = <HTMLInputElement>document.querySelector('#endereco');
    cepField.value = "6290000";
  });
  await page.click('#btn_pesquisar');
  await sleep(2000);
  //await page.pdf({path:"cep.pdf"});
  const result = await page.evaluate(()=>{
    const table = document.querySelector("#resultado-DNEC");
    const info = [];
    const rows = Array.from(table.querySelectorAll('tbody > tr'));

    for(var r of rows){
      const tds = Array.from(r.querySelectorAll('td'));
      const newResult = {};
      newResult[tds[0].getAttribute('data-th')] = tds[0].innerText;
      newResult[tds[1].getAttribute('data-th')] = tds[1].innerText;
      newResult[tds[2].getAttribute('data-th')] = tds[2].innerText;
      newResult[tds[3].getAttribute('data-th')] = tds[3].innerText;
      info.push(newResult);
    }
    return info;
  });
  console.log(result);
  await browser.close();
})();