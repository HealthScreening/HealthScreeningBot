# How the Bot Works

The bot will visit the health screening website, complete the form, and take a screenshot of the final product.

In order to seem as legitimate as possible, the bot goes through the hard work and effort of **actually completing the
screening on the website as if an actual person completed the screening**. This means that you can be rest assured that
the bot will not land you in any trouble — it is indistinguishable from a real screening that you would do yourself.

The bot utilizes the "Guest" mode in order to not require any usernames or passwords, as the OAuth mode requires.

# For the programmers

The bot utilizes [Puppeteer](https://pptr.dev/), which is a **JavaScript library allowing the running program to control
a headless instance of Chromium**, an open-source version of Google Chrome. Chromium has the same rendering capabilities
as Google Chrome, as Google Chrome is built upon Chromium. In essence, any website which works with Google Chrome will
work with Chromium.

In order to make sure that the bot does not click buttons until they are available, the bot waits for the buttons to be
visible before clicking on them,
via [page.waitForSelector(selector, {visible: true})](https://pptr.dev/#?product=Puppeteer&version=v10.2.0&show=api-pagewaitforselectorselector-options).

The steps for getting a screenshot of the finished product is actually quite simple:

1. Launch a copy of Chromium.
2. Navigate to [the guest screening page](https://healthscreening.schools.nyc/?type=G)
3. Wait for the "Fill Out Daily Screening" button to be visible.
4. Click the "I'm a student" button
5. Type in the first name
6. Type in the last name
7. Type in the email
8. For the "School" form input, the value `X445` (Bronx Science) is supplied, although this has **no impact on the final screening** (I tested with schools in every borough and it made zero difference).
9. Click the button
10. For the first question, wait until it is visible.
11. Answer "No"
12. For the second question, wait until it is visible.
13. Answer "No"
14. For the third question, wait until it is visible.

Here is where it diverges:

## If you are vaccinated

15. Answer "Yes"
16. Submit the form
17. Return the screenshot

## If you are not vaccinated

15. Answer "No"
16. For the fourth question, wait until it is visible.
17. Answer "No"
18. Submit the form
19. Return the screenshot

That's it!