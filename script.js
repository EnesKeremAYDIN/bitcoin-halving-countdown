const HALVING_INTERVAL = 210000;

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.data.blocks;
  } catch (error) {
    console.error("Error fetching block count:", error);
    return null;
  }
}

async function calculateHalvingBlocks() {
  const currentBlock = await fetchData('https://api.blockchair.com/bitcoin/stats');
  if (!currentBlock) {
    document.getElementById('countdown').textContent = "Error fetching data.";
    return;
  }

  const blocksUntilNextHalving = HALVING_INTERVAL - (currentBlock % HALVING_INTERVAL);
  const blocksUntilPreviousHalving = currentBlock % HALVING_INTERVAL;

  document.getElementById('halving-interval').textContent = `Halving Interval: ${HALVING_INTERVAL}`;
  document.getElementById('current-block').textContent = `Current Block: ${currentBlock}`;
  document.getElementById('blocks-until-next').textContent = `Blocks Until Next Halving: ${blocksUntilNextHalving}`;
  document.getElementById('blocks-until-previous').textContent = `Blocks Since Last Halving: ${blocksUntilPreviousHalving}`;

  const blockTimeInSeconds = 600;
  const secondsUntilHalving = blocksUntilNextHalving * blockTimeInSeconds;

  startCountdown(secondsUntilHalving);
}

function startCountdown(seconds) {
  const countdownElem = document.getElementById('countdown');

  function updateCountdown() {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    countdownElem.textContent = `${days}d ${hours}h ${minutes}m ${secs}s`;

    if (seconds > 0) {
      seconds--;
    } else {
      clearInterval(interval);
      countdownElem.textContent = "Halving Event!";
    }
  }

  const interval = setInterval(updateCountdown, 1000);
  updateCountdown();
}

calculateHalvingBlocks();
