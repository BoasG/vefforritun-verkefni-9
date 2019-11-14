/* eslint no-console: ["error", { allow: ["error"] }] */
const API_URL = 'https://apis.is/company?name=';

/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */
const program = (() => {
  function clearResults() {
    const results = document.querySelector('.results');
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }
  }

  function displayError(error) {
    clearResults();
    const pEl = document.createElement('p');
    pEl.className = 'status';
    pEl.append(document.createTextNode(error));
    document.querySelector('.results').append(pEl);
  }

  function createCompanyEl(company) {
    const companyEl = document.createElement('div');
    if (company.active === 1) {
      companyEl.className = 'company company--active';
    } else {
      companyEl.className = 'company company--inactive';
    }
    const dlEl = document.createElement('dl');
    const nameDTEl = document.createElement('dt');
    nameDTEl.append(document.createTextNode('Nafn'));
    dlEl.append(nameDTEl);

    const nameDDEl = document.createElement('dd');
    nameDDEl.append(document.createTextNode(company.name));
    dlEl.append(nameDDEl);

    const snDTEl = document.createElement('dt');
    snDTEl.append(document.createTextNode('Kennitala'));
    dlEl.append(snDTEl);

    const snDDEl = document.createElement('dd');
    snDDEl.append(document.createTextNode(company.sn));
    dlEl.append(snDDEl);

    if (company.active === 1) {
      const addressDTEl = document.createElement('dt');
      addressDTEl.append(document.createTextNode('Heimilisfang'));
      dlEl.append(addressDTEl);

      const addressDDEl = document.createElement('dd');
      addressDDEl.append(document.createTextNode(company.address));
      dlEl.append(addressDDEl);
    }

    companyEl.append(dlEl);

    return companyEl;
  }

  function displayCompanies(companies) {
    clearResults();
    if (companies.length === 0) {
      displayError('Ekkert fyrirtæki fannst fyrir leitarstreng');
    } else {
      const resultsEl = document.querySelector('.results');
      companies.forEach((company) => {
        resultsEl.append(createCompanyEl(company));
      });
    }
  }

  function fetchCompanies(companyName) {
    fetch(`${API_URL}${companyName}`)
      .then((res) => {
        if (!res.ok) {
          return null;
        }
        return res.json();
      })
      .then((data) => displayCompanies(data.results))
      .catch((error) => {
        displayError('Villa við að sækja gögn');
        console.error(error);
      });
  }

  function displayLoading() {
    clearResults();
    const divEl = document.createElement('div');
    divEl.className = 'status';
    const pEl = document.createElement('p');
    pEl.append(document.createTextNode('Leita að fyrirtækjum...'));
    divEl.append(pEl);
    const imgEl = document.createElement('img');
    imgEl.src = 'loading.gif';
    imgEl.alt = 'loading';
    divEl.appendChild(imgEl);
    document.querySelector('.results').append(divEl);
  }

  function onSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector('input');
    const companyName = input.value;

    if (/\S/.test(companyName)) {
      displayLoading();
      fetchCompanies(companyName);
    } else {
      displayError('Lén verður að vera strengur');
    }
  }

  function init(form) {
    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  program.init(form);
});
