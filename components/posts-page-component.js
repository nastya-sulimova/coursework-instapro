import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";
import { likePost, dislikePost, deletePost } from "../api.js";
// import { formatDistanceToNow } from "/date-fns"
// import { ru } from "/date-fns/locale/ru.js"

export function renderPostsPageComponent({ appEl, userName }) {
  // @TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

const userData = posts.length > 0 ? posts[0].user : null;

const postsUserHeader = userName && userData
  ? `
    <div class="posts-user-header">
      <img src="${userData.imageUrl}" class="posts-user-header__user-image" alt="фото профиля пользователя">
      <p class="posts-user-header__user-name">${userData.name}</p>
    </div>
  `
  : "";

  const appHtml = posts.map((post, index) => {
    // const postDate = new Date(post.createdAt);
        
    //     const timeAgo = formatDistanceToNow(postDate, { 
    //         addSuffix: true, 
    //         locale: ru    
    //     });

    const canDeletePost = user && userName !== null && user._id === post.user.id;

    return `
      <li class="post">

        ${!userName ? `
          <div class="post-header" data-user-id="${post.user.id}">
            <img src="${post.user.imageUrl}" class="post-header__user-image" alt="фото профиля пользователя">
            <p class="post-header__user-name">${post.user.name}</p>
          </div>
        ` : ''}
        
        <div class="post-image-container">
          <img src="${post.imageUrl}" class="post-image" alt="фото поста">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button">
            <img src="${
              post.isLiked ? './assets/images/like-active.svg' : './assets/images/like-not-active.svg'
          }">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${post.likes[0]?.name || 'Никому'}
            ${post.likes.length > 1 ? `и еще ${post.likes.length - 1}` : ''}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
          ${post.createdAt}
        </p>
  
         ${canDeletePost ? `
        <button data-post-delete="${post.id}" class="delete-post-button">
          Удалить пост
        </button>
      ` : ''}
      </li>
    `;
  }).join('');

  
  appEl.innerHTML = `
    <div class="page-container">
      <div class="header-container"></div>
      ${postsUserHeader}
      <ul class="posts">${appHtml}</ul>
    </div>
  `;

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


const addInitLikesListeners = () => {
  const likeButtonsEl = document.querySelectorAll('.like-button');

  likeButtonsEl.forEach((likeButton) => {
    likeButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const postId = likeButton.dataset.postId;
      
      if (!user) {
        alert("Нужно авторизоваться, чтобы ставить лайки!");
        return;
      }

      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const token = user ? `Bearer ${user.token}` : undefined;

      if (post.isLiked) {
        dislikePost({ token, postId })
          .then((updatedPost) => {
            const postIndex = posts.findIndex(p => p.id === postId);
            if (postIndex !== -1) {
              posts[postIndex] = updatedPost.post;
            }
            renderPostsPageComponent({ appEl, userName });
          })
          .catch((error) => {
            console.error("Ошибка при удалении лайка:", error);
          });
      } else {
        likePost({ token, postId })
          .then((updatedPost) => {
            const postIndex = posts.findIndex(p => p.id === postId);
            if (postIndex !== -1) {
              posts[postIndex] = updatedPost.post;
            }
            renderPostsPageComponent({ appEl, userName });
          })
          .catch((error) => {
            console.error("Ошибка при добавлении лайка:", error);
          });
      }
    });
  });
};

addInitLikesListeners();


const addInitDeletePostListeners = () => {
  const deletePostBtn = document.querySelectorAll('.delete-post-button');

  deletePostBtn.forEach((deleteButton) => {
    deleteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const postId = deleteButton.dataset.postDelete;

      if (!confirm("Вы уверены, что хотите удалить этот пост?")) {
        return;
      }

      const token = user ? `Bearer ${user.token}` : undefined;

        deletePost({ token, postId })
          .then(() => {
            const postIndex = posts.findIndex(p => p.id === postId);
            if (postIndex !== -1) {
              posts.splice(postIndex, 1);
            }

            renderPostsPageComponent({ appEl, userName });
          })
          .catch((error) => {
            console.error("Ошибка при удалении поста:", error);
            alert("Не удалось удалить пост: " + error.message);
          });
    });
  });
};

addInitDeletePostListeners();

}