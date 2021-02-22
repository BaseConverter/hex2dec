let decInput = document.querySelector("input#dec");
let binInput = document.querySelector("input#bin");
let hexInput = document.querySelector("input#hex");
let octInput = document.querySelector("input#oct");

var desiredBits = 0


decInput.addEventListener("input", event => {
	let cursorStart = decInput.selectionStart, cursorEnd = decInput.selectionEnd;
 	decInput.value = decInput.value.replace(/([^0-9-]+)/gi, '');
	decInput.setSelectionRange(cursorStart, cursorEnd);

	let value = parseInt(decInput.value)
	hexInput.value = isNaN(value) ? "" : value.toString(16).toUpperCase();
	octInput.value = isNaN(value) ? "" : value.toString(8)
	binInput.value = isNaN(value) ? "" : (value >>> 0).toString(2)
	updateBinInput()
});
hexInput.addEventListener("input", event => {
	let cursorStart = hexInput.selectionStart, cursorEnd = hexInput.selectionEnd;
	hexInput.value = hexInput.value.replace(/([^0-9A-F]+)/gi, '').toUpperCase();
	hexInput.setSelectionRange(cursorStart, cursorEnd);

	let value = parseInt(hexInput.value, 16)
	decInput.value = isNaN(value) ? "" : value
	octInput.value = isNaN(value) ? "" : value.toString(8)
	binInput.value = isNaN(value) ? "" : (value >>> 0).toString(2)

	desiredBits = hexInput.value.length * 4
	updateBinInput()
});
octInput.addEventListener("input", event => {
	let cursorStart = octInput.selectionStart, cursorEnd = octInput.selectionEnd;
	octInput.value = octInput.value.replace(/([^0-7]+)/gi, '');
	octInput.setSelectionRange(cursorStart, cursorEnd);

	let value = parseInt(hexInput.value, 16)
	decInput.value = isNaN(value) ? "" : value
	hexInput.value = isNaN(value) ? "" : value.toString(16).toUpperCase()
	binInput.value = isNaN(value) ? "" : (value >>> 0).toString(2)
	updateBinInput()
});
binInput.addEventListener("input", event => {
	let cursorStart = binInput.selectionStart, cursorEnd = binInput.selectionEnd;
	binInput.value = binInput.value.replace(/([^0-1]+)/gi, '')
	binInput.setSelectionRange(cursorStart, cursorEnd);
	console.log("binInput.value = '" + binInput.value + "', binInput.value.length = " + binInput.value.length)

	if(binInput.value == "") {
		desiredBits = 0;
	}

	updateBinInput()

	
	let value = parseInt(binInput.value, 2)
	decInput.value = isNaN(value) ? "" : value
	hexInput.value = isNaN(value) ? "" : value.toString(16).toUpperCase()
	octInput.value = isNaN(value) ? "" : value.toString(8)
});

function updateBinInput() {
	if(desiredBits == 0) {
		var bits = binInput.value.length
	} else {
		var bits = Math.max(desiredBits, binInput.value.replace(/^0+/, '').length);
	}
	document.querySelectorAll("span.bitsButtonGroup span").forEach(button => button.className = "");
	let selectedSpan = document.querySelector(".bitsButtonGroup span[data-bits='"+bits+"']") || document.querySelector(".bitsButtonGroup span[data-bits='0']")
	selectedSpan.className = "selected";


	binInput.value = binInput.value.replace(/^0+/, '').padStart(bits, "0")
	let bin = binInput.value

	let valuesDiv = document.querySelector("#binInput .values")
	let indicesDiv = document.querySelector("#binInput .indices")


	while( valuesDiv.childNodes.length > bits ) {
		valuesDiv.firstChild.remove();
		indicesDiv.firstChild.remove();
	}
	for(let index = valuesDiv.childNodes.length; index < bits; index++) {
		
		let indexSpan = document.createElement("span");
		indexSpan.onclick = function() {
			let indexFromLeft = binInput.value.length - 1 - index
			binInput.value = binInput.value.substr(0, indexFromLeft) + (binInput.value.charAt(indexFromLeft) == "0" ? "1" : "0") + binInput.value.substr(indexFromLeft + 1);
			binInput.dispatchEvent(new Event('input'));
		}
		indexSpan.innerHTML = index;
		indicesDiv.prepend(indexSpan);

		valuesDiv.prepend(document.createElement("span"));
	}

	let valueSpans = Array.from(valuesDiv.childNodes);
	var valueSpanIndex = valueSpans.length - bin.length;


	document.querySelector("#binInput .fakeText").innerHTML = binInput.value;
	let width = document.querySelector("#binInput .fakeText").getBoundingClientRect().width;	
	document.querySelector("#binInput .values").style.width = width + "px";
	document.querySelector("#binInput .indices").style.width = width + "px";
	document.querySelector("#binInput input").style.minWidth = width + "px";
	
}

document.querySelectorAll("span.bitsButtonGroup span").forEach(button => {
	button.addEventListener("click", even => {
		desiredBits = button.dataset.bits;
		updateBinInput();

	})
})

document.querySelector("#darkModeToggle").addEventListener("change", event => {
	if(event.target.checked) { // Light Mode
		document.documentElement.style.setProperty('--bg', '#f4f5f6')
      	document.documentElement.style.setProperty('--navbg', '#f4f5f6')
      	document.documentElement.style.setProperty('--navborder', '#d1d1d1')
      	document.documentElement.style.setProperty('--navcolor', '#666')
      	document.documentElement.style.setProperty('--inputbg', 'transparent')
      	document.documentElement.style.setProperty('--inputcolor', '#000')
      	document.documentElement.style.setProperty('--buttonbg', '#aaa')

	} else { // Dark Mode
		document.documentElement.style.setProperty('--bg', '#202021')
      	document.documentElement.style.setProperty('--navbg', '#2A2A2B')
      	document.documentElement.style.setProperty('--navborder', '#101010')
      	document.documentElement.style.setProperty('--navcolor', '#B6B7B7')
      	document.documentElement.style.setProperty('--inputbg', 'rgba(255,255,255,0.02)')
      	document.documentElement.style.setProperty('--inputcolor', '#fff')
      	document.documentElement.style.setProperty('--buttonbg', '#3A3A3B')
      	
	}

});

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
	document.querySelector("#darkModeToggle").checked = false;
	document.querySelector("#darkModeToggle").dispatchEvent(new Event('change'));
}

