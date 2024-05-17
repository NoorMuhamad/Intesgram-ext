export const injector = () => {

  document
    .querySelectorAll(
      '._aagw'
    )
    .forEach((el) => {
      if (el.getAttribute("ig-download-botton") === "true") return;

      el.setAttribute("ig-download-botton", "true");

      const downloadButton = document.createElement("button");
      downloadButton.setAttribute("type", "button");
      downloadButton.setAttribute("style", "position: absolute; right: 0; margin: 2px; width: 20%; height: 7%");
      downloadButton.setAttribute("id", "instagram-download-botton");
      downloadButton.innerHTML = "Download"
      el.prepend(downloadButton);

    });
};

export const handler = async () => {
  const handleClick = async (e: MouseEvent) => {
    {
      const target = e.target as Element;
      const btn = target?.closest("#instagram-download-botton");
      if (!btn) return;

      console.log(target);
      const parentDiv = target?.closest('._aagw');

      const imageUrl = parentDiv?.closest('._aagu')?.querySelector('img')?.getAttribute('src') as string;

      let imageUserProfile = parentDiv?.closest('._aagu')?.closest('.xnc8uc2')?.querySelector('._ap3a._aaco._aacw._aacx._aad7._aade')?.innerHTML;

      imageUserProfile = imageUserProfile ? imageUserProfile : (document.querySelector('._ap3a._aaco._aacw._aacx._aad7._aade')?.innerHTML || document.querySelector('._acan._acao._acat._acaw._aj1-._ap30._a6hd')?.innerHTML);

      fetch('http://localhost:3000/instagram-photos', {
        method: 'POST',
        body: JSON.stringify({ image: imageUrl, imageUserProfile }),
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .then(apiResponse => {
          console.log('API Response:', apiResponse);
          alert('Image successfully added to list!');
        })
        .catch(apiError => {
          console.error('Error sending image to API:', apiError);
        });

    }
  };
  document.body.addEventListener("click", handleClick);
};

