// const headers = new Headers();
// headers.append("content-type", "application/json")
// headers.append("x-api-key", "sk_7ba020e63cbd26daa959b060c007c75501cf32d6a993c6af25175555547bc09ec10f564035efc907e70fc5ad0f186d47985bd77078173239a65534831aee1377024GEk8TrAH419HP6ntCi")

// const requestOptions = {
//       method: "POST",
//       body: {"url":"https://www.amazon.com/s?k=tcl+55+inch+tv&crid=3P5I6QEUC2PM7&sprefix=tcl+55+%2Caps%2C108&ref=nb_sb_ss_pltr-sample-20_1_7","element_prompts":["product title","product prize"]},
//       headers: headers
//   };
  
// const url = new URL("https://api.jigsawstack.com/v1/ai/scrape")
  
// fetch(url, requestOptions)
//               .then(response => response.text())
//               .then(result => console.log(result))
//               .catch(error => console.log('error', error));

async function scrapeData() {
    const endpoint = "https://api.jigsawstack.com/v1/ai/scrape";
    const options = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "x-api-key": "sk_7364b8d40be2a31c390c8491efe207c25f756c88d3ca6889dea0049c99593939ccff48ed4bb9a6e1f48ac102d56c687638afd73359e9084f91d06bc67d502ca4024iOQCXQPPh3LiUJgAwA", // Replace with your actual API key.
    },
    body: JSON.stringify({
        url: "https://www.tcl.com/us/en/products/home-theater/4-series/tcl-55-class-4-series-4k-uhd-led-roku-smart-tv-55s425",
        element_prompts: ["Product title", "Product price", "Product reviews"], // Adjust prompts as per your needs.
    }),
    };

    const result = await fetch(endpoint, options);
    const fullResponse = await result.json();

    const mappedData = fullResponse.data.map((d) => ({
        selector: d.selector,
        response: d.results.map((r) => r.text) 
    }))
    // Output the scraped data
    console.log(mappedData)
}

scrapeData()


              