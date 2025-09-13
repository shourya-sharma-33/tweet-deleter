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
