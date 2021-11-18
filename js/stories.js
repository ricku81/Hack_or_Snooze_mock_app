'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart () {
	storyList = await StoryList.getStories();
	$storiesLoadingMsg.remove();

	putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup (story) {
	// console.debug("generateStoryMarkup", story);

	const hostName = story.getHostName();
	return $(`
      <li id="${story.storyId}">
				<span class="star">
					<i class="far fa-star"></i>
				</span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage () {
	console.debug('putStoriesOnPage');

	$allStoriesList.empty();

	// loop through all of our stories and generate HTML for them
	for (let story of storyList.stories) {
		const $story = generateStoryMarkup(story);
		$allStoriesList.append($story);
	}

	$allStoriesList.show();
}

// add newStory using submit-form
async function addNewStory () {
	const newAuthor = $('#create-author').val();
	const newTitle = $('#create-title').val();
	const newUrl = $('#create-url').val();

	let newStory = await storyList.addStory(currentUser, {
		title  : `${newTitle}`,
		author : `${newAuthor}`,
		url    : `${newUrl}`
	});

	const $story = generateStoryMarkup(newStory);
	$allStoriesList.prepend($story);

	return newStory;
}

// on submit, call addNewStory method and clear inputs of form. Hide form.
$submitForm.on('submit', function (evt) {
	evt.preventDefault();
	addNewStory();

	$('#create-author').val('');
	$('#create-title').val('');
	$('#create-url').val('');
	$submitForm.hide();
});

// adds eventListener to stars to add/remove favorites of User
$('.fa-star').on('click', function (evt) {
	favStory(evt.target);
});
