(function() {
  // Pixel ID: 014c4d00-9f47-4b27-bbed-37c16ef35188
  // Domain: blackwatermrkting.com

  var clientUidData = {"pid":"014c4d00-9f47-4b27-bbed-37c16ef35188","org":"0ca9f43e-a6b5-4af7-a797-524a551ef6ec","wl":"55a36f30-e153-4fb0-9b77-f3c11307a0d5","domain":"blackwatermrkting.com","org_slug":"datastack-ai","wl_slug":"datadoors"};

  // === PIXELSDK ===
  var configScript = document.createElement('script');
  configScript.type = 'application/json';
  configScript.id = 'pixelsdk-config-014c4d00-9f47-4b27-bbed-37c16ef35188-config';
  configScript.textContent = JSON.stringify({
    globalParams: clientUidData
  });

  var pixelSdkScript = document.createElement('script');
  pixelSdkScript.src = 'https://cdn.pixel.leadpipe.com/pixels/50eb9810-e48f-48c6-a106-4430acd08126/p.js';
  pixelSdkScript.defer = true;
  pixelSdkScript.id = 'pixelsdk-id-014c4d00-9f47-4b27-bbed-37c16ef35188';
  pixelSdkScript.setAttribute('data-auto-init', 'true');
  pixelSdkScript.setAttribute('data-config-id', 'pixelsdk-config-014c4d00-9f47-4b27-bbed-37c16ef35188');

  document.head.appendChild(configScript);
  document.head.appendChild(pixelSdkScript);
})();
