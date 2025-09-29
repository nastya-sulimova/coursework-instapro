import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    // @TODO: Реализовать страницу добавления поста
    const appHtml = `
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container">
            <div class="upload=image">
              <label class="file-upload-label secondary-button">
                <input type="file" class="file-upload-input" style="display:none">
                Выберите фото
              </label>
            </div>
          </div>
          <label>
            Опишите фотографию: <textarea class="input textarea" rows="4"></textarea> 
          </label>
          <button class="button" id="add-button">Добавить</button>
  `;

    appEl.innerHTML = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">${appHtml}</div>
    </div>
  `;

    const textareaDescription = document.querySelector(".textarea")
    document.getElementById("add-button").addEventListener("click", () => {
      onAddPostClick({
        description: textareaDescription.value,
        imageUrl: imageUrl,
      });
    });

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });
  
    for (let userEl of document.querySelectorAll(".post-header")) {
      userEl.addEventListener("click", () => {
        goToPage(USER_POSTS_PAGE, {
          userId: userEl.dataset.userId,
        });
      });
    }


    const uploadImageButton = document.querySelector('.upload-image-container')

    renderUploadImageComponent({
      element: uploadImageButton,
      onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
      },
    });

  }

  render();
}
