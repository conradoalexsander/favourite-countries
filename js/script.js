const countryCollection = (() => {
	let tabCountries = document.querySelector('#tabCountries');
	let tabFavourites = document.querySelector('#tabFavourites');

	let allCountries = [];
	let favouriteCountries = [];

	let countCountries = document.querySelector('#countCountries');
	let countFavourites = document.querySelector('#countFavourites');

	let totalPopulationList = document.querySelector('#totalPopulationList');
	//prettier-ignore
	let totalPopulationFavourites = document.querySelector('#totalPopulationFavourites');

	let numberFormat = Intl.NumberFormat('en-US');

	const _formatNumber = number => {
		return numberFormat.format(number);
	};

	const fetchCountries = async () => {
		const res = await fetch('https://restcountries.eu/rest/v2/all');
		const json = await res.json();

		allCountries = json.map(country => {
			const { numericCode: id, name, population, flag } = country;

			return {
				id,
				name,
				population,
				formattedPopulation: _formatNumber(population),
				flag,
			};
		});
		render();
	};

	const render = () => {
		_renderCountryList();
		_renderFavourites();
		_renderSummary();
		_handleCountryButtons();
	};

	const _renderCountryList = () => {
		let countriesHTML = '<div>';

		allCountries.forEach(country => {
			const { name, flag, id, population, formattedPopulation } = country;

			const countryHTML = `
      <div class='country'>
          <div>
              <a id="${id}" class="waves-effect waves-light btn"> 
                  <i class="material-icons">add</i> 
              </a>
          </div>

          <div>
              <img src="${flag}" alt="${name}" />
          </div>
      
          <div>
              <ul>
                  <li> ${name}
                  <li> ${formattedPopulation}
              </ul>
           </div>
       
      </div>`;

			countriesHTML += countryHTML;
		});

		countriesHTML += `</div>`;

		tabCountries.innerHTML = countriesHTML;
	};

	const _renderFavourites = () => {
		let favouriteCountriesHTML = '<div>';

		favouriteCountries.forEach(country => {
			const { name, flag, id, population, formattedPopulation } = country;

			const countryHTML = `
      <div class='country'>
          <div>
          <a id="${id}" class="waves-effect waves-light red darken-4 btn"> 
          <i class="material-icons">remove</i> 
      </a>
          </div>

          <div>
              <img src="${flag}" alt="${name}" />
          </div>
      
          <div>
              <ul>
                  <li> ${name}
                  <li> ${formattedPopulation}
              </ul>
           </div>
       
      </div>`;

			favouriteCountriesHTML += countryHTML;
		});

		favouriteCountriesHTML += `</div>`;

		tabFavourites.innerHTML = favouriteCountriesHTML;
	};

	const _renderSummary = () => {
		countCountries.textContent = allCountries.length;
		countFavourites.textContent = favouriteCountries.length;

		const totalPopulation = allCountries.reduce((acc, cur) => {
			return acc + cur.population;
		}, 0);

		totalPopulationList.textContent = _formatNumber(totalPopulation);

		const totalFavourites = favouriteCountries.reduce((acc, cur) => {
			return acc + cur.population;
		}, 0);

		totalPopulationFavourites.textContent = _formatNumber(totalFavourites);
	};

	const _handleCountryButtons = () => {
		const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));

		countryButtons.forEach(button => {
			button.addEventListener('click', () => {
				_addToFavourites(button.id);
			});
		});

		const favouriteButtons = Array.from(tabFavourites.querySelectorAll('.btn'));
		favouriteButtons.forEach(button => {
			button.addEventListener('click', () => {
				_removeFromFavourites(button.id);
			});
		});
	};

	const _addToFavourites = id => {
		const countryToAdd = allCountries.find(country => country.id === id);
		favouriteCountries = [...favouriteCountries, countryToAdd];
		favouriteCountries.sort((a, b) => a.name.localeCompare(b.name));

		allCountries = allCountries.filter(
			country => country.id !== countryToAdd.id
		);

		console.log(favouriteCountries);

		render();
	};

	const _removeFromFavourites = id => {
		const countryToRemove = favouriteCountries.find(
			country => country.id === id
		);
		allCountries = [...allCountries, countryToRemove];
		allCountries.sort((a, b) => a.name.localeCompare(b.name));

		favouriteCountries = favouriteCountries.filter(
			country => country.id !== countryToRemove.id
		);

		console.log(favouriteCountries);

		render();
	};

	return {
		render: render,
		fetchCountries: fetchCountries,
	};
})();

window.addEventListener('load', () => {
	countryCollection.fetchCountries();
	countryCollection.render();
});
