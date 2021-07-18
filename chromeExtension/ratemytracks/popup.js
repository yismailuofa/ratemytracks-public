let enabled = true;
const button = document.getElementById("toggle");

chrome.storage.sync.get("enabled", (data) => {
  enabled = Boolean(data.enabled)
  button.textContent = enabled ? "Disable" : "Enable";
  enabled ? button.classList.add("disabled") : button.classList.remove("disabled")
});

button.onclick = () => {
  enabled = !enabled;
  button.textContent = enabled ? "Disable" : "Enable";
  enabled ? button.classList.add("disabled") : button.classList.remove("disabled")
  chrome.tabs.reload();
  chrome.storage.sync.set({ enabled: enabled });
};
