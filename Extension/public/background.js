const folders = ["Folder 1", "Folder 2", "Folder 3"]; // Dummy folders, replace with dynamic data

// Create the main context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addToCollectify",
    title: "Add to Collectify",
    contexts: ["all"]
  });

  // Create submenus for folders
  folders.forEach((folder, index) => {
    chrome.contextMenus.create({
      id: `folder-${index}`,
      parentId: "addToCollectify",
      title: folder,
      contexts: ["all"]
    });
  });
});

// Listen for menu item clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.parentMenuItemId === "addToCollectify") {
    console.log(`Added to folder: ${info.menuItemId.replace("folder-", "")}`);
    // Replace this with your logic to save the link to the folder
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "authenticate") {
    // Make sure to call getAuthToken() from the background script
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError) {
        console.error('Error during OAuth:', chrome.runtime.lastError);
        sendResponse({ success: false });
        return;
      }

      // Save the token to localStorage or Chrome Storage API
      chrome.storage.local.set({ authToken: token }, function() {
        sendResponse({ success: true, token: token });
      });
    });
    
    // Ensure to return true so the sendResponse works asynchronously
    return true;
  }
});
