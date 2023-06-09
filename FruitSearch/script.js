const input = document.querySelector('#fruit');
const suggestions = document.querySelector('.suggestions ul');

const fruit = ['Apple', 'Apricot', 'Avocado', 'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry', 'Boysenberry', 'Currant', 'Cherry', 'Coconut', 'Cranberry', 'Cucumber', 'Custard apple', 'Damson', 'Date', 'Dragonfruit', 'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Gooseberry', 'Grape', 'Raisin', 'Grapefruit', 'Guava', 'Honeyberry', 'Huckleberry', 'Jabuticaba', 'Jackfruit', 'Jambul', 'Juniper berry', 'Kiwifruit', 'Kumquat', 'Lemon', 'Lime', 'Loquat', 'Longan', 'Lychee', 'Mango', 'Mangosteen', 'Marionberry', 'Melon', 'Cantaloupe', 'Honeydew', 'Watermelon', 'Miracle fruit', 'Mulberry', 'Nectarine', 'Nance', 'Olive', 'Orange', 'Clementine', 'Mandarine', 'Tangerine', 'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Plantain', 'Plum', 'Pineapple', 'Pomegranate', 'Pomelo', 'Quince', 'Raspberry', 'Salmonberry', 'Rambutan', 'Redcurrant', 'Salak', 'Satsuma', 'Soursop', 'Star fruit', 'Strawberry', 'Tamarillo', 'Tamarind', 'Yuzu'];

function search(str) {
	// return all fruits that contain the entered search string "so far..."
	return fruit.filter((f) => f.toLowerCase().includes(str.toLowerCase()));
}

function searchHandler(e) {
	// clear the ul element
	suggestions.replaceChildren();

	//if the input is not empty, then build li elements
	if (input.value) {
		const fruitList = search(e.target.value);
		showSuggestions(fruitList, input.value)
	}
}

function showSuggestions(results, inputVal) {
	// I can only assume that the reason inputVal is required here is because
	// they want the matching characters in each li to be highlighted somehow.
	for (let thisFruit of results) {
		thisFruit = thisFruit.toLowerCase();
		const match = thisFruit.indexOf(inputVal.toLowerCase());
		
		// boldface the inputVal
		const liInnerHtml = thisFruit.slice(0,match) + "<b>" + thisFruit.slice(match, match + inputVal.length) + "</b>" + thisFruit.slice(match + inputVal.length);
		
		const newLi = document.createElement("li");
		newLi.innerHTML = liInnerHtml;
		suggestions.appendChild(newLi);
	}
}

function useSuggestion(e) {
	input.value = (e.target.nodeName === "B") ? e.target.parentElement.innerText : e.target.innerText;
	suggestions.replaceChildren();
}

// These are here to satisfy Step 8. Styling could be done completely with CSS, but I get the point of 
// "what if we needed to run some other code because these have been 'hovered'?"
function mouseOver(e) {
	(e.target.nodeName === "B") ? e.target.parentElement.style.backgroundColor = "#0d76f2" : e.target.style.backgroundColor = "#0d76f2";
}
function mouseOut(e) {
	(e.target.nodeName === "B") ? e.target.parentElement.style.backgroundColor = "" : e.target.style.backgroundColor = "";
}

function checkESC(e) {
	// clear any entries
    if(e.key === "Escape") {
		suggestions.replaceChildren();
		input.value = "";
    }
}

input.addEventListener('keyup', searchHandler);
suggestions.addEventListener('click', useSuggestion);
suggestions.addEventListener('mouseover', mouseOver);
suggestions.addEventListener('mouseout', mouseOut);
document.body.addEventListener('keyup', checkESC);