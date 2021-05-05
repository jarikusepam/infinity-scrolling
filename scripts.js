document.addEventListener("DOMContentLoaded", () => infinityLoader());

function infinityLoader(
  params = { page: 1, limit: 10, image_width: 300, image_height: 200 }
) {
  const API_URL = "https://picsum.photos/v2/list";

  //set up the IntersectionObserver to load more images if the footer is visible.
  const options = {
    root: null,
    rootMargins: "0px",
    threshold: 0.5,
  };

  const main = document.querySelector("main");
  const fragment = document.createDocumentFragment();

  const observer = new IntersectionObserver(handleIntersect, options);
  observer.observe(document.querySelector("footer"));

  function handleIntersect(entries) {
    if (entries[0].isIntersecting) {
      getData();
    }
  }

  function getData() {
    const { page, limit, image_height, image_width } = params;
    const imageListUrl = `${API_URL}?page=${page}&limit=${limit}`;

    fetch(imageListUrl)
      .then((response) => response.json())
      .then((data) => {
        data.forEach(({ id, author, download_url }) => {
          const fig = document.createElement("figure");
          const fc = document.createElement("figcaption");
          const img = document.createElement("img");
          const url = new URL(download_url);

          // get optimized by width and height an image
          img.src = `${url.origin}/id/${id}/300/200`;

          img.alt = author;
          fc.textContent = author;

          fig.appendChild(img);
          fig.appendChild(fc);
          fragment.appendChild(fig);
        });

        main.appendChild(fragment);

        // increment the page counter
        params.page += 1;
      })
      .catch((err) => {
        throw new Error("Something went wrong");
      });
  }
}
