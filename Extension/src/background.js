// Importing the Backend URL from .env file
const backendURL = import.meta.env.VITE_BACKEND_URL

// This code is for open the extension by clicking the extension icon
chrome.sidePanel
	.setPanelBehavior({ openPanelOnActionClick: true })
	.catch((error) => console.error(error))

// This listens for any message that Named GET_COOKIE
// if any Message comes in that name the other lines will execute
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
 
	if (request.type === "GET_COOKIE") {
		// This gets the cookie
		chrome.cookies.get(
		{ url: backendURL, name: "authToken" },
		(cookie) => {
			if (cookie) {
				sendResponse({ value: cookie.value });
			} else {
				sendResponse({ value: null });
			}
		}
		);
		// Return true to indicate async response
		return true;
	}
	});