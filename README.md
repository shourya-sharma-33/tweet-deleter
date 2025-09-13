# 🧹 Tweet Deleter – Bulk Delete Tweets on X (Twitter)

Deleting tweets manually is a pain. Normally, you have to:

1. Click the **hamburger (three dots)** on a tweet
2. Click **Delete**
3. Confirm the popup
4. Repeat for *every single tweet*

This script saves you from that hassle. With it, you can **select multiple tweets at once** using checkboxes, and delete them all with a single button click.

---

## ✨ Features

* Adds a **checkbox** to every tweet on your timeline/profile.
* Lets you **select multiple tweets** at once.
* Adds a **“Delete Selected”** button at the bottom-right corner of the screen.
* Adds a quick **profile link button** (optional, you can change it to your own link).

---

## 🚀 How to Install & Use

### 1. Install Tampermonkey

Tampermonkey is a browser extension that lets you run custom scripts.

* **Chrome / Edge**: [Install here](https://www.tampermonkey.net/?ext=dhdg&browser=chrome)
* **Firefox**: [Install here](https://www.tampermonkey.net/?ext=dhdg&browser=firefox)

After installation, you’ll see the Tampermonkey icon in your extensions bar.

---

### 2. Enable Developer Mode (Chrome/Edge users)

1. Go to `chrome://extensions/` (or `edge://extensions/`)
2. Toggle **Developer Mode** ON (top-right corner)

---

### 3. Add the Script

1. Click the Tampermonkey icon in your browser.
2. Select **Dashboard**.
3. Click **+ (Create a new script)**.
4. Delete everything inside, and paste this code:

```js
// ==UserScript==
// @name         tweet deleter :3
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add checkboxes to your tweets for bulk deletion + profile link
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .delete-checkbox {
            position: absolute;
            left: 5px;
            top: 5px;
            z-index: 9999;
            transform: scale(1.5);
        }
        #delete-selected-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            background: red;
            color: white;
            font-weight: bold;
            border-radius: 8px;
            cursor: pointer;
            z-index: 10000;
        }
        #profile-link {
            position: fixed;
            bottom: 55px; /* just above delete button */
            right: 20px;
            padding: 6px 10px;
            background: #1d9bf0;
            color: white;
            font-weight: bold;
            border-radius: 6px;
            text-decoration: none;
            z-index: 10000;
        }
        #profile-link:hover {
            background: #0d8ddc;
        }
    `);

    // Add the anchor link
    const profileLink = document.createElement("a");
    profileLink.id = "profile-link";
    profileLink.href = "https://x.com/shouryasharma33";
    profileLink.textContent = "follow my X";
    profileLink.target = "_blank";
    document.body.appendChild(profileLink);

    // Add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.id = "delete-selected-btn";
    deleteBtn.textContent = "delete selected";
    document.body.appendChild(deleteBtn);

    const observer = new MutationObserver(() => {
        document.querySelectorAll('article').forEach(tweet => {
            if (!tweet.querySelector('.delete-checkbox')) {
                const caret = tweet.querySelector('[data-testid="caret"]');
                if (caret) {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'delete-checkbox';
                    tweet.style.position = "relative";
                    tweet.prepend(checkbox);
                }
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    deleteBtn.addEventListener("click", async () => {
        const selectedTweets = [...document.querySelectorAll('.delete-checkbox:checked')];
        if (!selectedTweets.length) {
            alert("No tweets selected!");
            return;
        }

        for (const cb of selectedTweets) {
            const tweetElement = cb.closest('article');
            const menuBtn = tweetElement.querySelector('[data-testid="caret"]');

            if (menuBtn) {
                menuBtn.click();
                await new Promise(r => setTimeout(r, 300));

                const delBtn = Array.from(document.querySelectorAll('[data-testid="Dropdown"] [role="menuitem"]'))
                    .find(el => el.textContent.includes("Delete"));

                if (delBtn) {
                    delBtn.click();
                    await new Promise(r => setTimeout(r, 300));

                    const confirmBtn = document.querySelector('[data-testid="confirmationSheetConfirm"]');
                    if (confirmBtn) confirmBtn.click();

                    await new Promise(r => setTimeout(r, 800));
                }
            }
        }
    });
})();
```

5. **Save** (File → Save or press `Ctrl+S`).
6. Make sure the script is **enabled** (switch in Tampermonkey dashboard).

---

### 4. Use It

1. Go to your X/Twitter profile.
2. You’ll see **checkboxes** on your tweets.
3. Select the ones you want to delete.
4. Click **Delete Selected** at the bottom-right.
5. The script will automatically:

   * Open the delete menu
   * Click delete
   * Confirm deletion

---

## ⚠️ Notes

* This only works for **your own tweets** (not likes, not retweets from others).
* You might need to **scroll down** to load more tweets before selecting them.
* Use carefully — deleted tweets cannot be restored!
