'use strict';

//proper API multi-state API call: https://developer.nps.gov/api/v1/parks?api_key=uXHGqAxVxi0azDOn6hPc4WjrRGr75lKMLkA6vFhe&stateCode=tx%2Cmd&limit=10&start=0 
const apiKey = 'uXHGqAxVxi0azDOn6hPc4WjrRGr75lKMLkA6vFhe'; 
const endpointURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

//allows you to search multiple states using a comma
function removeSpaces(val) {
    return val.split(' ').join('');
 }

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
    // for each video object in the items 
    //array, add a list item to the results 
    //list with the video title, description,
    //and thumbnail
    const addressItem = responseJson.data[i].addresses;
    $('#results-list').append(
      //full name, description, website url
      `<li class="parkList"><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <p><a href="${responseJson.data[i].url}" target= "_blank">${responseJson.data[i].url}</p>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};


function getParkInfo(codes, limitNum) {
  //takes input codes, removes spaces and joins together for multiple
  //state search 
  const codeList = removeSpaces(codes);
  console.log(codeList);
  const params = {
    api_key: apiKey,
    //based off api documentation which talks about how this should be formatted
    stateCode: codeList,
    //example: 50
    limit: limitNum,
    //integer; example: 1
    start: 0
  };
  const queryString = formatQueryParams(params)
  const url = endpointURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchState = $('#js-search-state').val();
    console.log(searchState);
    const maxResults = $('#js-max-results').val();
    console.log(maxResults);
    getParkInfo(searchState, maxResults);
  });
}

$(watchForm);